import { NextRequest, NextResponse } from 'next/server'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'
import { createServerClient } from '@/lib/supabase/server'
import { ISSUE_SPOTTING_PROMPT, ACTION_PLAN_PROMPT, CASE_SUMMARY_PROMPT, SYSTEM_PROMPT_BASE } from '@/lib/prompts'
import { runRulesEngine } from '@/lib/rules-engine'

export const maxDuration = 90

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { caseId } = await req.json()
    if (!caseId) return NextResponse.json({ error: 'caseId required' }, { status: 400 })

    const supabase = createServerClient()

    // Fetch case + extracted facts
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .eq('user_id', userId)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    const { data: factsData } = await supabase
      .from('extracted_facts')
      .select('*')
      .eq('case_id', caseId)

    // Build context string for Claude
    const contextString = JSON.stringify({
      case: {
        developer_name: caseData.developer_name,
        resort_name: caseData.resort_name,
        resort_state: caseData.resort_state,
        purchase_date: caseData.purchase_date,
        purchase_price: caseData.purchase_price,
        loan_balance: caseData.loan_balance,
        maintenance_fee_annual: caseData.maintenance_fee_annual,
        maintenance_fee_status: caseData.maintenance_fee_status,
        rescission_deadline: caseData.rescission_deadline,
        has_hardship: caseData.has_hardship,
        hardship_types: caseData.hardship_types,
        dissatisfaction_reasons: caseData.dissatisfaction_reasons,
        sales_pressure_tactics: caseData.sales_pressure_tactics,
        prior_exit_company: caseData.prior_exit_company,
      },
      extracted_facts: factsData?.reduce((acc: Record<string, string>, f: Record<string, string>) => {
        acc[f.fact_key] = f.fact_value
        return acc
      }, {}) ?? {},
    }, null, 2)

    // Run all three Claude calls in parallel
    const [issuesResponse, summaryResponse] = await Promise.all([
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        system: SYSTEM_PROMPT_BASE,
        messages: [{ role: 'user', content: ISSUE_SPOTTING_PROMPT + contextString }],
      }),
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT_BASE,
        messages: [{ role: 'user', content: CASE_SUMMARY_PROMPT + contextString }],
      }),
    ])

    // Parse issues
    const issuesText = issuesResponse.content.filter(b => b.type === 'text').map(b => b.text).join('')
    let issues: unknown[] = []
    try {
      const match = issuesText.match(/\[[\s\S]*\]/)
      if (match) issues = JSON.parse(match[0])
    } catch (e) {
      console.error('Issues parse error:', e)
    }

    // Parse summary
    const summaryText = summaryResponse.content.filter(b => b.type === 'text').map(b => b.text).join('')
    let summary: Record<string, unknown> = {}
    try {
      const match = summaryText.match(/\{[\s\S]*\}/)
      if (match) summary = JSON.parse(match[0])
    } catch (e) {
      console.error('Summary parse error:', e)
    }

    // Run rules engine
    const rulesInput = {
      purchaseDate: caseData.purchase_date,
      rescissionDeadline: caseData.rescission_deadline,
      resortState: caseData.resort_state,
      developerName: caseData.developer_name,
      loanBalance: caseData.loan_balance,
      maintenanceFeeAnnual: caseData.maintenance_fee_annual,
      maintenanceFeeStatus: caseData.maintenance_fee_status,
      hasHardship: caseData.has_hardship,
      hardshipType: caseData.hardship_types,
      priorExitCompany: caseData.prior_exit_company,
      issueCategories: issues.map((i: unknown) => (i as Record<string, string>).category),
    }
    const rulesResult = runRulesEngine(rulesInput)

    // Get AI action plan
    const actionPlanInput = JSON.stringify({ ...rulesInput, issues, summary, rulesResult }, null, 2)
    const actionPlanResponse = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: SYSTEM_PROMPT_BASE,
      messages: [{ role: 'user', content: ACTION_PLAN_PROMPT + actionPlanInput }],
    })

    const actionPlanText = actionPlanResponse.content.filter(b => b.type === 'text').map(b => b.text).join('')
    let actionPlan: Record<string, unknown> = {}
    try {
      const match = actionPlanText.match(/\{[\s\S]*\}/)
      if (match) actionPlan = JSON.parse(match[0])
    } catch (e) {
      console.error('Action plan parse error:', e)
    }

    // Persist everything
    // 1. Issue flags
    if (issues.length > 0) {
      await supabase.from('issue_flags').delete().eq('case_id', caseId)
      await supabase.from('issue_flags').insert(
        issues.map((issue: unknown) => ({
          case_id: caseId,
          ...(issue as object),
        }))
      )
    }

    // 2. Action plan
    await supabase.from('action_plans').upsert({
      case_id: caseId,
      primary_path: rulesResult.triggeredPaths[0] || 'GENERAL_EDUCATION',
      steps: actionPlan.steps ?? rulesResult.actionSteps,
      missing_documents: actionPlan.missing_documents ?? rulesResult.missingEvidence,
      scam_warnings: actionPlan.scam_warnings ?? rulesResult.scamWarnings,
      attorney_recommended: actionPlan.attorney_recommended ?? rulesResult.requiresAttorney,
      attorney_reason: actionPlan.attorney_reason ?? rulesResult.attorneyReason,
      generated_by: 'AI_RULES_COMBINED',
    }, { onConflict: 'case_id' })

    // 3. Update case status + score + summary
    await supabase.from('cases').update({
      status: 'ANALYZED',
      actionability_score: rulesResult.actionabilityScore.total,
      actionability_grade: rulesResult.actionabilityScore.grade,
      actionability_label: rulesResult.actionabilityScore.label,
      primary_path: rulesResult.triggeredPaths[0] || 'GENERAL_EDUCATION',
      requires_attorney: rulesResult.requiresAttorney,
      attorney_reason: rulesResult.attorneyReason,
      ai_summary_headline: summary.headline,
      ai_summary_situation: summary.situation,
      ai_summary_key_finding: summary.key_finding,
      ai_summary_immediate_action: summary.immediate_action,
      ai_time_sensitive: summary.time_sensitive,
      last_analyzed_at: new Date().toISOString(),
    }).eq('id', caseId)

    return NextResponse.json({
      issues,
      summary,
      actionPlan: {
        ...actionPlan,
        steps: actionPlan.steps ?? rulesResult.actionSteps,
        scamWarnings: actionPlan.scam_warnings ?? rulesResult.scamWarnings,
      },
      rulesResult,
      score: rulesResult.actionabilityScore,
    })
  } catch (err) {
    console.error('POST /api/analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

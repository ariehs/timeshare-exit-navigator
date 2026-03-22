import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { runRulesEngine } from '@/lib/rules-engine'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: cases, error } = await supabase
      .from('cases')
      .select(`
        id, status, developer_name, resort_name, resort_state, purchase_price,
        loan_balance, maintenance_fee_annual, actionability_score, actionability_grade,
        actionability_label, primary_path, created_at, updated_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ cases })
  } catch (err) {
    console.error('GET /api/cases error:', err)
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await req.json()
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Run rules engine with intake data
    const rulesInput = {
      purchaseDate: body.purchase_date,
      rescissionDeadline: body.rescission_deadline,
      resortState: body.resort_state,
      developerName: body.developer_name,
      loanBalance: body.loan_balance,
      maintenanceFeeAnnual: body.maintenance_fee_annual,
      maintenanceFeeStatus: body.maintenance_fee_status,
      hasHardship: body.has_hardship,
      hardshipType: body.hardship_types,
      priorExitCompany: body.prior_exit_company,
      issueCategories: body.issue_categories,
      elderlyOwner: body.owner_age && body.owner_age >= 65,
    }

    const rulesResult = runRulesEngine(rulesInput)

    // Insert case
    const { data: caseRecord, error: caseError } = await supabase
      .from('cases')
      .insert({
        user_id: userId,
        status: 'INTAKE_COMPLETE',
        developer_name: body.developer_name,
        resort_name: body.resort_name,
        resort_state: body.resort_state,
        purchase_date: body.purchase_date,
        purchase_price: body.purchase_price,
        contract_type: body.contract_type || 'POINTS',
        annual_points: body.annual_points,
        maintenance_fee_annual: body.maintenance_fee_annual,
        maintenance_fee_status: body.maintenance_fee_status,
        loan_balance: body.loan_balance,
        rescission_deadline: body.rescission_deadline,
        has_hardship: body.has_hardship,
        hardship_types: body.hardship_types,
        dissatisfaction_reasons: body.dissatisfaction_reasons,
        sales_pressure_tactics: body.sales_pressure_tactics,
        prior_exit_company: body.prior_exit_company,
        actionability_score: rulesResult.actionabilityScore.total,
        actionability_grade: rulesResult.actionabilityScore.grade,
        actionability_label: rulesResult.actionabilityScore.label,
        primary_path: rulesResult.triggeredPaths[0] || 'GENERAL_EDUCATION',
        requires_attorney: rulesResult.requiresAttorney,
        attorney_reason: rulesResult.attorneyReason,
      })
      .select()
      .single()

    if (caseError) throw caseError

    // Insert action plan steps
    if (rulesResult.actionSteps.length > 0) {
      await supabase.from('action_plans').insert({
        case_id: caseRecord.id,
        primary_path: rulesResult.triggeredPaths[0] || 'GENERAL_EDUCATION',
        steps: rulesResult.actionSteps,
        scam_warnings: rulesResult.scamWarnings,
        missing_documents: rulesResult.missingEvidence,
        attorney_recommended: rulesResult.requiresAttorney,
        attorney_reason: rulesResult.attorneyReason,
        generated_by: 'RULES_ENGINE',
      })
    }

    // Insert issue flags
    if (body.issue_categories?.length) {
      const issueInserts = body.issue_categories.map((cat: string) => ({
        case_id: caseRecord.id,
        category: cat,
        title: formatIssueTitle(cat),
        severity: getIssueSeverity(cat),
        source_type: 'USER_STATED',
        confidence: 0.7,
      }))
      await supabase.from('issue_flags').insert(issueInserts)
    }

    return NextResponse.json({ case: caseRecord, rulesResult }, { status: 201 })
  } catch (err) {
    console.error('POST /api/cases error:', err)
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 })
  }
}

function formatIssueTitle(category: string): string {
  const titles: Record<string, string> = {
    MISREPRESENTATION: 'Potential Misrepresentation During Sale',
    MAINTENANCE_FEE_ABUSE: 'Maintenance Fee Concerns',
    PERPETUITY_TRAP: 'Perpetuity / Heirs Obligation',
    LOAN_BURDEN: 'High-Interest Financing Burden',
    EXIT_OBSTRUCTION: 'Exit Process Obstruction',
    ELDER_VULNERABILITY: 'Elder Consumer Protection Issues',
    COMPLAINT_WARRANTED: 'Complaint to Regulatory Agency Warranted',
  }
  return titles[category] || category.replace(/_/g, ' ').toLowerCase()
}

function getIssueSeverity(category: string): string {
  const severities: Record<string, string> = {
    RESCISSION_WINDOW: 'CRITICAL',
    MISREPRESENTATION: 'HIGH',
    ELDER_VULNERABILITY: 'HIGH',
    MAINTENANCE_FEE_ABUSE: 'MEDIUM',
    PERPETUITY_TRAP: 'MEDIUM',
    LOAN_BURDEN: 'MEDIUM',
    EXIT_OBSTRUCTION: 'HIGH',
    COMPLAINT_WARRANTED: 'MEDIUM',
  }
  return severities[category] || 'LOW'
}

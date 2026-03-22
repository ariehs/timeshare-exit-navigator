'use client'

import { useState, useEffect, useCallback } from 'react'

interface CaseData {
  id: string
  status: string
  developer_name: string
  resort_name: string
  resort_state: string
  purchase_date: string
  purchase_price: number
  loan_balance: number
  maintenance_fee_annual: number
  maintenance_fee_status: string
  rescission_deadline: string
  has_hardship: boolean
  hardship_types: string[]
  actionability_score: number
  actionability_grade: string
  actionability_label: string
  primary_path: string
  requires_attorney: boolean
  attorney_reason: string
  ai_summary_headline: string
  ai_summary_situation: string
  ai_summary_key_finding: string
  ai_summary_immediate_action: string
  ai_time_sensitive: boolean
  last_analyzed_at: string
  created_at: string
}

interface UseCaseReturn {
  caseData: CaseData | null
  issues: unknown[]
  actionPlan: unknown
  loading: boolean
  analyzing: boolean
  error: string | null
  runAnalysis: () => Promise<void>
  refresh: () => Promise<void>
}

export function useCase(caseId: string | null, userId = 'demo-user'): UseCaseReturn {
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [issues, setIssues] = useState<unknown[]>([])
  const [actionPlan, setActionPlan] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const headers = { 'x-user-id': userId }

  const fetchAll = useCallback(async () => {
    if (!caseId) { setLoading(false); return }
    setError(null)
    try {
      const [caseRes, issuesRes, planRes] = await Promise.all([
        fetch(`/api/cases/${caseId}`, { headers }),
        fetch(`/api/issues?caseId=${caseId}`, { headers }),
        fetch(`/api/action-plan?caseId=${caseId}`, { headers }),
      ])

      if (!caseRes.ok) throw new Error('Case not found')
      setCaseData(await caseRes.json())

      if (issuesRes.ok) {
        const d = await issuesRes.json()
        setIssues(d.issues ?? [])
      }
      if (planRes.ok) {
        const d = await planRes.json()
        setActionPlan(d.plan)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case')
    } finally {
      setLoading(false)
    }
  }, [caseId, userId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const runAnalysis = useCallback(async () => {
    if (!caseId) return
    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()

      if (data.issues) setIssues(data.issues)
      if (data.actionPlan) setActionPlan(data.actionPlan)
      if (data.score) {
        setCaseData(prev => prev ? {
          ...prev,
          actionability_score: data.score.total,
          actionability_grade: data.score.grade,
          actionability_label: data.score.label,
          status: 'ANALYZED',
          ai_summary_headline: data.summary?.headline ?? prev.ai_summary_headline,
          ai_summary_situation: data.summary?.situation ?? prev.ai_summary_situation,
          ai_summary_key_finding: data.summary?.key_finding ?? prev.ai_summary_key_finding,
          ai_summary_immediate_action: data.summary?.immediate_action ?? prev.ai_summary_immediate_action,
        } : null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }, [caseId, userId])

  return { caseData, issues, actionPlan, loading, analyzing, error, runAnalysis, refresh: fetchAll }
}

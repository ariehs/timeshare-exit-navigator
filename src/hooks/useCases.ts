'use client'

import { useState, useEffect } from 'react'

interface CaseSummary {
  id: string
  status: string
  developer_name: string
  resort_name: string
  resort_state: string
  purchase_price: number
  loan_balance: number
  maintenance_fee_annual: number
  actionability_score: number
  actionability_grade: string
  actionability_label: string
  primary_path: string
  created_at: string
  updated_at: string
}

export function useCases(userId = 'demo-user') {
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases', { headers: { 'x-user-id': userId } })
        if (!res.ok) throw new Error('Failed to fetch cases')
        const data = await res.json()
        setCases(data.cases ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cases')
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [userId])

  return { cases, loading, error }
}

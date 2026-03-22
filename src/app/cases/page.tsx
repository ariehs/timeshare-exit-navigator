'use client'

import Link from 'next/link'
import { ShieldCheck, Plus, ArrowRight, BarChart3, Building2, Loader2 } from 'lucide-react'
import { useCases } from '@/hooks/useCases'

const GRADE_COLORS: Record<string, string> = {
  A: 'text-teal-600 bg-teal-50 border-teal-200',
  B: 'text-teal-500 bg-teal-50 border-teal-100',
  C: 'text-gold-600 bg-gold-50 border-gold-200',
  D: 'text-orange-600 bg-orange-50 border-orange-200',
  F: 'text-rose-600 bg-rose-50 border-rose-200',
}

const STATUS_COLORS: Record<string, string> = {
  ANALYZED: 'badge-teal',
  DOCUMENT_ANALYZED: 'badge-gold',
  INTAKE_COMPLETE: 'badge-ink',
  PENDING: 'badge-ink',
}

export default function CasesPage() {
  const { cases, loading } = useCases()

  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Nav */}
      <div className="border-b border-parchment-300 bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal" />
            <span className="font-serif font-semibold text-ink">Timeshare Exit Navigator</span>
          </Link>
          <Link href="/intake" className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" />
            New Case
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-ink mb-1">My Cases</h1>
          <p className="text-ink/50 font-sans text-sm">All your timeshare exit analyses</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-teal" />
          </div>
        ) : cases.length === 0 ? (
          <div className="card text-center py-16">
            <BarChart3 className="w-10 h-10 text-ink/20 mx-auto mb-4" />
            <h3 className="font-sans font-medium text-ink mb-2">No cases yet</h3>
            <p className="text-ink/50 text-sm font-sans mb-6">Start your first analysis to understand your exit options</p>
            <Link href="/intake" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              Start New Analysis
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => {
              const gradeColor = GRADE_COLORS[c.actionability_grade] ?? GRADE_COLORS.C
              const statusColor = STATUS_COLORS[c.status] ?? 'badge-ink'
              return (
                <Link
                  key={c.id}
                  href={`/dashboard?caseId=${c.id}`}
                  className="card hover:shadow-md transition-all flex items-center gap-4 group"
                >
                  {/* Grade */}
                  <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${gradeColor}`}>
                    <span className="font-serif font-bold text-lg">{c.actionability_grade ?? '?'}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-sans font-medium text-ink">
                        {c.resort_name || c.developer_name || 'Unnamed Case'}
                      </span>
                      <span className={`badge ${statusColor} text-xs`}>
                        {c.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink/40 font-sans">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {c.developer_name ?? '—'}
                      </span>
                      <span>·</span>
                      <span>{c.resort_state ?? '—'}</span>
                      {c.purchase_price && (
                        <>
                          <span>·</span>
                          <span>${Number(c.purchase_price).toLocaleString()}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    {c.actionability_label && (
                      <p className="text-xs text-teal font-sans mt-1">{c.actionability_label}</p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    {c.actionability_score > 0 && (
                      <div className="text-sm font-mono text-ink/50">{c.actionability_score}/100</div>
                    )}
                    <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-ink/60 transition-colors mt-1 ml-auto" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

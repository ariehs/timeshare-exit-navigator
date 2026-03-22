'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck, AlertTriangle, CheckCircle, Clock, FileText,
  ArrowRight, Upload, ChevronDown, ChevronUp, Info, Loader2,
  Building2, DollarSign, Scale, Zap, BookOpen, Users
} from 'lucide-react'

interface CaseData {
  id: string
  developer_name: string
  resort_name: string
  resort_state: string
  status: string
  actionability_score: number
  actionability_grade: string
  actionability_label: string
  primary_path: string
  ai_summary_headline: string
  ai_summary_situation: string
  ai_summary_key_finding: string
  ai_summary_immediate_action: string
  ai_time_sensitive: boolean
  requires_attorney: boolean
  attorney_reason: string
  loan_balance: number
  maintenance_fee_annual: number
  purchase_price: number
  purchase_date: string
  rescission_deadline: string
  has_hardship: boolean
  hardship_types: string[]
}

interface Issue {
  id: string
  category: string
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL'
  description: string
  evidence_basis: string
  source_type: string
  recommended_action: string
  time_sensitive: boolean
  requires_attorney: boolean
  confidence: number
}

interface ActionStep {
  id: string
  title: string
  description: string
  path: string
  priority: number
  timeSensitive: boolean
  deadline?: string
  estimatedCost: string
  estimatedTime: string
  difficulty: string
  documentsNeeded: string[]
}

interface ActionPlan {
  steps: ActionStep[]
  scam_warnings: string[]
  missing_documents: string[]
  attorney_recommended: boolean
  primary_path: string
}

const SEVERITY_CONFIG = {
  CRITICAL: { label: 'Critical', class: 'bg-rose-100 text-rose-700 border-rose-200' },
  HIGH: { label: 'High', class: 'bg-orange-100 text-orange-700 border-orange-200' },
  MEDIUM: { label: 'Medium', class: 'bg-gold-100 text-gold-700 border-gold-200' },
  LOW: { label: 'Low', class: 'bg-parchment-200 text-ink/60 border-parchment-300' },
  INFORMATIONAL: { label: 'Info', class: 'bg-teal-50 text-teal-700 border-teal-100' },
}

const GRADE_CONFIG: Record<string, { color: string; bg: string; ring: string }> = {
  A: { color: 'text-teal-600', bg: 'bg-teal-50', ring: 'stroke-teal-500' },
  B: { color: 'text-teal-500', bg: 'bg-teal-50', ring: 'stroke-teal-400' },
  C: { color: 'text-gold-600', bg: 'bg-gold-50', ring: 'stroke-gold-500' },
  D: { color: 'text-orange-600', bg: 'bg-orange-50', ring: 'stroke-orange-500' },
  F: { color: 'text-rose-600', bg: 'bg-rose-50', ring: 'stroke-rose-500' },
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const config = GRADE_CONFIG[grade] ?? GRADE_CONFIG.C
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={`${config.bg} rounded-xl p-6 flex flex-col items-center`}>
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e8e0d0" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            className={config.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-serif font-bold ${config.color}`}>{grade}</span>
          <span className="text-xs text-ink/40 font-sans">{score}/100</span>
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('caseId')

  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  useEffect(() => {
    if (!caseId) return

    const fetchCase = async () => {
      try {
        const [caseRes, issuesRes, planRes] = await Promise.all([
          fetch(`/api/cases/${caseId}`, { headers: { 'x-user-id': 'demo-user' } }),
          fetch(`/api/issues?caseId=${caseId}`, { headers: { 'x-user-id': 'demo-user' } }),
          fetch(`/api/action-plan?caseId=${caseId}`, { headers: { 'x-user-id': 'demo-user' } }),
        ])

        if (caseRes.ok) setCaseData(await caseRes.json())
        if (issuesRes.ok) { const d = await issuesRes.json(); setIssues(d.issues ?? []) }
        if (planRes.ok) { const d = await planRes.json(); setActionPlan(d.plan) }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCase()
  }, [caseId])

  const runAnalysis = async () => {
    if (!caseId) return
    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-user' },
        body: JSON.stringify({ caseId }),
      })
      const data = await res.json()
      if (data.issues) setIssues(data.issues)
      if (data.actionPlan) setActionPlan(data.actionPlan)
      if (data.score) {
        setCaseData(prev => prev ? {
          ...prev,
          actionability_score: data.score.total,
          actionability_grade: data.score.grade,
          actionability_label: data.score.label,
          ai_summary_headline: data.summary?.headline ?? prev.ai_summary_headline,
          ai_summary_situation: data.summary?.situation ?? prev.ai_summary_situation,
          ai_summary_key_finding: data.summary?.key_finding ?? prev.ai_summary_key_finding,
          ai_summary_immediate_action: data.summary?.immediate_action ?? prev.ai_summary_immediate_action,
        } : null)
      }
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal mx-auto mb-3" />
        <p className="text-ink/60 font-sans">Loading your case...</p>
      </div>
    </div>
  )

  if (!caseData) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-ink/60 font-sans mb-4">No case found.</p>
        <Link href="/intake" className="btn-primary">Start New Analysis</Link>
      </div>
    </div>
  )

  const grade = caseData.actionability_grade ?? 'C'
  const score = caseData.actionability_score ?? 0

  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Top bar */}
      <div className="border-b border-parchment-300 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal" />
            <span className="font-serif font-semibold text-ink">Timeshare Exit Navigator</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={runAnalysis} disabled={analyzing} className="btn-secondary text-sm py-1.5">
              {analyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><Zap className="w-3.5 h-3.5" /> Run AI Analysis</>}
            </button>
            <Link href="/intake" className="btn-primary text-sm py-1.5">
              <Upload className="w-3.5 h-3.5" />
              New Case
            </Link>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-gold-50 border-b border-gold/20 px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-sans text-gold-700">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Educational purposes only.</strong> This is not legal advice.{' '}
            <span className="text-gold-600">AI ANALYSIS</span> = generated by AI ·{' '}
            <span className="text-gold-600">DOCUMENT</span> = extracted from contract ·{' '}
            <span className="text-gold-600">USER-STATED</span> = provided by you
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Case header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-serif text-ink mb-1">
                {caseData.resort_name || caseData.developer_name || 'Your Timeshare Case'}
              </h1>
              <p className="text-ink/50 font-sans text-sm">
                {caseData.developer_name} · {caseData.resort_state} · Case #{caseId?.slice(0, 8)}
              </p>
            </div>
            <span className={`badge ${caseData.status === 'ANALYZED' ? 'badge-teal' : 'badge-gold'}`}>
              {caseData.status?.replace(/_/g, ' ') ?? 'PENDING'}
            </span>
          </div>
        </div>

        {/* Time-sensitive alert */}
        {caseData.rescission_deadline && new Date(caseData.rescission_deadline) >= new Date() && (
          <div className="warning-box mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold font-sans text-rose mb-1">⚡ Time-Sensitive: Rescission Window May Be Open</div>
              <p className="text-rose/80 text-sm font-sans">
                Your rescission deadline is {new Date(caseData.rescission_deadline).toLocaleDateString()}.
                This is your strongest legal option and requires immediate action.
              </p>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {caseData.ai_summary_headline && (
          <div className="card mb-6 bg-teal-50 border-teal-100">
            <div className="section-label text-teal/60 mb-2">AI ANALYSIS · Case Summary</div>
            <h2 className="font-serif text-xl text-ink mb-2">{caseData.ai_summary_headline}</h2>
            <p className="text-ink/70 font-sans text-sm leading-relaxed mb-3">{caseData.ai_summary_situation}</p>
            {caseData.ai_summary_key_finding && (
              <div className="bg-white rounded-lg p-3 border border-teal-100">
                <span className="text-xs font-semibold text-teal/60 uppercase tracking-wide block mb-1">Key Finding</span>
                <p className="text-sm font-sans text-ink">{caseData.ai_summary_key_finding}</p>
              </div>
            )}
            {caseData.ai_summary_immediate_action && (
              <div className="mt-3 flex items-start gap-2 text-sm font-sans text-teal-700">
                <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Immediate action:</strong> {caseData.ai_summary_immediate_action}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issues */}
            {issues.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-semibold text-ink flex items-center gap-2">
                    <Scale className="w-4 h-4 text-rose" />
                    Identified Issues
                    <span className="badge-rose ml-1">{issues.length}</span>
                  </h3>
                  <span className="text-xs text-ink/40 font-sans">AI ANALYSIS</span>
                </div>
                <div className="space-y-3">
                  {issues.slice(0, 6).map((issue) => {
                    const sev = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.LOW
                    return (
                      <div key={issue.id} className={`rounded-lg border p-4 ${sev.class}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`badge ${sev.class} text-xs`}>{sev.label}</span>
                              {issue.time_sensitive && <span className="badge bg-rose-100 text-rose-700 text-xs"><Clock className="w-2.5 h-2.5" /> Time Sensitive</span>}
                            </div>
                            <div className="font-medium font-sans text-sm text-ink">{issue.title}</div>
                            <p className="text-xs text-ink/60 font-sans mt-1 leading-relaxed">{issue.description}</p>
                            {issue.recommended_action && (
                              <div className="mt-2 text-xs font-sans text-ink/70 flex items-start gap-1.5">
                                <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                {issue.recommended_action}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-ink/30 font-mono flex-shrink-0">{Math.round(issue.confidence * 100)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Steps */}
            {actionPlan?.steps && actionPlan.steps.length > 0 && (
              <div className="card">
                <h3 className="font-sans font-semibold text-ink flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-teal" />
                  Action Plan
                </h3>
                <div className="space-y-3">
                  {actionPlan.steps.map((step, i) => (
                    <div key={step.id} className="border border-parchment-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                        className="w-full flex items-start gap-4 p-4 hover:bg-parchment-50 text-left transition-colors"
                      >
                        <div className="w-7 h-7 bg-teal-100 text-teal rounded-full flex items-center justify-center font-sans text-sm font-semibold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium font-sans text-sm text-ink">{step.title}</span>
                            {step.timeSensitive && <span className="badge badge-rose text-xs"><Clock className="w-2.5 h-2.5" /> Urgent</span>}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-ink/40 font-sans">
                            <span>{step.estimatedTime}</span>
                            <span>·</span>
                            <span>{step.estimatedCost}</span>
                            <span>·</span>
                            <span className={step.difficulty === 'EASY' ? 'text-teal' : step.difficulty === 'HARD' ? 'text-rose' : 'text-gold'}>{step.difficulty}</span>
                          </div>
                        </div>
                        {expandedStep === step.id ? <ChevronUp className="w-4 h-4 text-ink/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink/30 flex-shrink-0" />}
                      </button>
                      {expandedStep === step.id && (
                        <div className="px-4 pb-4 bg-parchment-50 border-t border-parchment-200">
                          <p className="text-sm font-sans text-ink/70 mt-3 leading-relaxed">{step.description}</p>
                          {step.documentsNeeded?.filter(Boolean).length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-1">Documents Needed</div>
                              <ul className="space-y-1">
                                {step.documentsNeeded.filter(Boolean).map(doc => (
                                  <li key={doc} className="text-xs font-sans text-ink/60 flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-ink/20 rounded-full" />
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scam warnings */}
            {actionPlan?.scam_warnings && actionPlan.scam_warnings.length > 0 && (
              <div className="warning-box">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose flex-shrink-0" />
                  <span className="font-semibold font-sans text-rose">Scam Warnings</span>
                </div>
                <ul className="space-y-2">
                  {actionPlan.scam_warnings.slice(0, 4).map((warning, i) => (
                    <li key={i} className="text-sm font-sans text-rose/80 flex items-start gap-2">
                      <span className="mt-1 flex-shrink-0">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Attorney referral */}
            {caseData.requires_attorney && (
              <div className="card border-teal-200 bg-teal-50">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold font-sans text-teal mb-1">Attorney Consultation Recommended</div>
                    <p className="text-sm font-sans text-teal/70 leading-relaxed">{caseData.attorney_reason}</p>
                    <p className="text-xs font-sans text-teal/50 mt-2">
                      We do not refer to specific attorneys. Search your state bar association for consumer protection or real estate attorneys.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Score */}
            <div className="card">
              <div className="section-label mb-3">Actionability Score</div>
              <ScoreRing score={score} grade={grade} />
              <div className="mt-4 text-center">
                <div className="font-sans font-semibold text-ink">{caseData.actionability_label ?? 'Analysis Pending'}</div>
              </div>
              {score === 0 && (
                <button onClick={runAnalysis} disabled={analyzing} className="btn-primary w-full mt-4 text-sm justify-center">
                  {analyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</> : <><Zap className="w-3.5 h-3.5" /> Run Analysis</>}
                </button>
              )}
            </div>

            {/* Key facts */}
            <div className="card">
              <div className="section-label mb-3">Key Facts</div>
              <dl className="space-y-3">
                {[
                  { icon: Building2, label: 'Developer', value: caseData.developer_name, source: 'USER' },
                  { icon: DollarSign, label: 'Purchase Price', value: caseData.purchase_price ? `$${Number(caseData.purchase_price).toLocaleString()}` : null, source: 'USER' },
                  { icon: DollarSign, label: 'Loan Balance', value: caseData.loan_balance !== null ? `$${Number(caseData.loan_balance).toLocaleString()}` : null, source: 'USER' },
                  { icon: DollarSign, label: 'Annual Fees', value: caseData.maintenance_fee_annual ? `$${Number(caseData.maintenance_fee_annual).toLocaleString()}/yr` : null, source: 'USER' },
                ].filter(f => f.value).map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <fact.icon className="w-3.5 h-3.5 text-ink/30" />
                      <span className="text-xs text-ink/50 font-sans">{fact.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium font-sans text-ink">{fact.value}</div>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Document upload CTA */}
            <div className="card-parchment border-dashed border-parchment-400">
              <div className="text-center">
                <Upload className="w-8 h-8 text-ink/20 mx-auto mb-3" />
                <div className="font-medium font-sans text-ink mb-1 text-sm">Upload Your Contract</div>
                <p className="text-xs text-ink/50 font-sans mb-4">Upload for clause-by-clause analysis and confidence-scored fact extraction</p>
                <button className="btn-secondary text-xs py-2 px-4 w-full justify-center">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Generate letters */}
            <div className="card">
              <div className="section-label mb-3">Draft Letters</div>
              <div className="space-y-2">
                {[
                  { type: 'RESCISSION', label: 'Rescission Notice', desc: 'Cancel within window' },
                  { type: 'COMPLAINT', label: 'Complaint Letter', desc: 'File with DBPR/CFPB' },
                ].map(letter => (
                  <button
                    key={letter.type}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-parchment-300 hover:border-teal/30 hover:bg-teal-50 transition-all text-left"
                    onClick={async () => {
                      const res = await fetch('/api/letters', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-user-id': 'demo-user' },
                        body: JSON.stringify({ caseId, letterType: letter.type }),
                      })
                      const data = await res.json()
                      if (data.letterData?.body) {
                        const blob = new Blob([data.letterData.body], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${letter.type.toLowerCase()}-letter.txt`
                        a.click()
                      }
                    }}
                  >
                    <FileText className="w-4 h-4 text-teal flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium font-sans text-ink">{letter.label}</div>
                      <div className="text-xs text-ink/40 font-sans">{letter.desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-ink/30 ml-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="card">
              <div className="section-label mb-3">Official Resources</div>
              <div className="space-y-2 text-sm font-sans">
                {[
                  { label: 'FL DBPR', url: 'https://www.myfloridalicense.com', desc: 'FL timeshare regulator' },
                  { label: 'CFPB Complaint', url: 'https://www.consumerfinance.gov/complaint', desc: 'Federal complaint portal' },
                  { label: 'FTC Report Fraud', url: 'https://reportfraud.ftc.gov', desc: 'Federal fraud reporting' },
                  { label: 'Marriott Owner Services', url: 'tel:800-860-9384', desc: '800-860-9384' },
                ].map(r => (
                  <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-parchment-100 transition-colors">
                    <div>
                      <div className="font-medium text-ink">{r.label}</div>
                      <div className="text-xs text-ink/40">{r.desc}</div>
                    </div>
                    <BookOpen className="w-3.5 h-3.5 text-ink/20" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <footer className="border-t border-parchment-300 mt-12 py-6 px-6 bg-white">
        <p className="text-xs text-ink/40 font-sans max-w-4xl mx-auto">
          This analysis is for educational purposes only and does not constitute legal advice. All AI-generated content is labeled as AI ANALYSIS and should be verified independently. Confidence scores indicate the reliability of extracted information based on available data. Consult a licensed attorney for legal guidance.
        </p>
      </footer>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck, ChevronRight, ChevronLeft, Check,
  AlertTriangle, Info, Building2, DollarSign,
  Calendar, Frown, Wrench, Scale, Loader2
} from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  { id: 1, title: 'Developer & Resort', icon: Building2 },
  { id: 2, title: 'Contract Details', icon: FileText2 },
  { id: 3, title: 'Financial Status', icon: DollarSign },
  { id: 4, title: 'Sales Experience', icon: Scale },
  { id: 5, title: 'Your Situation', icon: Frown },
  { id: 6, title: 'Prior Actions', icon: Wrench },
  { id: 7, title: 'Hardship', icon: Calendar },
  { id: 8, title: 'Review', icon: Check },
]

function FileText2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const DEVELOPERS = ['Marriott Vacation Club', 'Wyndham Destinations', 'Hilton Grand Vacations', 'Disney Vacation Club', 'Bluegreen Vacations', 'Holiday Inn Club Vacations', 'Diamond Resorts', 'Vistana Signature Experiences', 'Other']

const PRESSURE_TACTICS = [
  'Told the offer was "today only"',
  'Kept in presentation longer than told',
  'Told could resell easily',
  'Promised rental income',
  'Claimed fees would never increase',
  'Minimized or hid perpetuity clause',
  'Discouraged reading contract carefully',
  'Promised "free" gifts to attend',
]

const DISSATISFACTION = [
  'Maintenance fees increased significantly',
  'Cannot book desired dates/locations',
  'Points expire before use',
  'Did not understand perpetual obligation',
  'Financial hardship since purchase',
  'Misrepresentation during sales presentation',
  'Developer changed terms or programs',
  'Poor customer service / responsiveness',
]

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    developer_name: '',
    resort_name: '',
    resort_state: '',
    purchase_date: '',
    purchase_price: '',
    contract_type: 'POINTS',
    annual_points: '',
    maintenance_fee_annual: '',
    maintenance_fee_status: 'CURRENT',
    loan_balance: '',
    rescission_deadline: '',
    sales_pressure_tactics: [] as string[],
    resale_claims: false,
    rental_income_claims: false,
    dissatisfaction_reasons: [] as string[],
    prior_exit_company: false,
    prior_exit_company_details: '',
    has_hardship: false,
    hardship_types: [] as string[],
    owner_age: '',
    additional_notes: '',
  })

  const update = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const toggleArray = (key: string, value: string) => {
    const arr = form[key as keyof typeof form] as string[]
    update(key, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user', // Replace with real auth
        },
        body: JSON.stringify({
          ...form,
          purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
          annual_points: form.annual_points ? Number(form.annual_points) : null,
          maintenance_fee_annual: form.maintenance_fee_annual ? Number(form.maintenance_fee_annual) : null,
          loan_balance: form.loan_balance !== '' ? Number(form.loan_balance) : null,
          owner_age: form.owner_age ? Number(form.owner_age) : null,
        }),
      })
      const data = await res.json()
      if (data.case?.id) {
        router.push(`/dashboard?caseId=${data.case.id}`)
      }
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-parchment-300 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors">
          <ShieldCheck className="w-5 h-5 text-teal" />
          <span className="font-serif font-semibold text-ink">Timeshare Exit Navigator</span>
        </Link>
        <span className="text-sm text-ink/40 font-sans">Step {step} of {STEPS.length}</span>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-parchment-300 p-6">
          <div className="text-xs font-semibold tracking-widest uppercase text-ink/40 mb-4">Progress</div>
          <nav className="space-y-1 flex-1">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-sans transition-all
                  ${s.id === step ? 'bg-teal-50 text-teal font-medium border border-teal-100' :
                    s.id < step ? 'text-ink/40' : 'text-ink/30'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs
                  ${s.id < step ? 'bg-teal text-white' :
                    s.id === step ? 'bg-teal-100 text-teal font-bold' : 'bg-parchment-200 text-ink/30'}`}>
                  {s.id < step ? <Check className="w-3 h-3" /> : s.id}
                </div>
                {s.title}
              </div>
            ))}
          </nav>
          <div className="disclaimer-box text-xs mt-4">
            <Info className="w-3 h-3 inline mr-1" />
            Your information is used only to generate your analysis. Not legal advice.
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 max-w-2xl">
          <div className="mb-8">
            <div className="section-label mb-2">Step {step} of {STEPS.length}</div>
            <h1 className="text-2xl font-serif text-ink">{STEPS[step - 1].title}</h1>
          </div>

          {/* Step 1: Developer & Resort */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Developer / Brand</label>
                <select
                  value={form.developer_name}
                  onChange={e => update('developer_name', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select developer...</option>
                  {DEVELOPERS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Resort Name</label>
                <input
                  type="text"
                  value={form.resort_name}
                  onChange={e => update('resort_name', e.target.value)}
                  placeholder="e.g. Marriott's Grand Chateau"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Resort State</label>
                <select
                  value={form.resort_state}
                  onChange={e => update('resort_state', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select state...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Purchase Date</label>
                <input
                  type="date"
                  value={form.purchase_date}
                  onChange={e => update('purchase_date', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contract Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Contract Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['POINTS', 'WEEKS'].map(type => (
                    <button
                      key={type}
                      onClick={() => update('contract_type', type)}
                      className={`p-4 rounded-lg border-2 text-sm font-medium font-sans transition-all
                        ${form.contract_type === type
                          ? 'border-teal bg-teal-50 text-teal'
                          : 'border-parchment-300 text-ink/60 hover:border-parchment-400'}`}
                    >
                      {type === 'POINTS' ? '📊 Points-Based' : '📅 Fixed/Floating Week'}
                    </button>
                  ))}
                </div>
              </div>
              {form.contract_type === 'POINTS' && (
                <div>
                  <label className="block text-sm font-medium font-sans text-ink mb-1.5">Annual Points Allocation</label>
                  <input
                    type="number"
                    value={form.annual_points}
                    onChange={e => update('annual_points', e.target.value)}
                    placeholder="e.g. 2500"
                    className="input-field"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 font-sans">$</span>
                  <input
                    type="number"
                    value={form.purchase_price}
                    onChange={e => update('purchase_price', e.target.value)}
                    placeholder="25000"
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">
                  Rescission Deadline
                  <span className="text-xs text-ink/40 font-normal ml-2">(if known — usually 5–10 days from signing)</span>
                </label>
                <input
                  type="date"
                  value={form.rescission_deadline}
                  onChange={e => update('rescission_deadline', e.target.value)}
                  className="input-field"
                />
                {form.rescission_deadline && new Date(form.rescission_deadline) >= new Date() && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-teal font-sans">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Your rescission window may still be open — this is time-critical!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Financial Status */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Annual Maintenance Fee</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 font-sans">$</span>
                  <input
                    type="number"
                    value={form.maintenance_fee_annual}
                    onChange={e => update('maintenance_fee_annual', e.target.value)}
                    placeholder="1400"
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-2">Maintenance Fee Status</label>
                <div className="space-y-2">
                  {[
                    { value: 'CURRENT', label: 'Current — fees are paid up', color: 'teal' },
                    { value: 'DELINQUENT', label: 'Delinquent — behind on fees', color: 'rose' },
                    { value: 'UNKNOWN', label: 'Not sure', color: 'gold' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${form.maintenance_fee_status === opt.value ? 'border-teal bg-teal-50' : 'border-parchment-300 hover:border-parchment-400'}`}>
                      <input
                        type="radio"
                        name="fee_status"
                        value={opt.value}
                        checked={form.maintenance_fee_status === opt.value}
                        onChange={() => update('maintenance_fee_status', opt.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${form.maintenance_fee_status === opt.value ? 'border-teal bg-teal' : 'border-parchment-400'}`}>
                        {form.maintenance_fee_status === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-sans text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">
                  Remaining Loan Balance
                  <span className="text-xs text-ink/40 font-normal ml-2">(0 if paid off)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 font-sans">$</span>
                  <input
                    type="number"
                    value={form.loan_balance}
                    onChange={e => update('loan_balance', e.target.value)}
                    placeholder="0"
                    className="input-field pl-7"
                  />
                </div>
                <p className="text-xs text-ink/40 mt-1 font-sans">A $0 balance significantly improves deed-back eligibility</p>
              </div>
            </div>
          )}

          {/* Step 4: Sales Experience */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-3">
                  Which tactics were used during your sales presentation? <span className="text-ink/40 font-normal">(select all that apply)</span>
                </label>
                <div className="space-y-2">
                  {PRESSURE_TACTICS.map(tactic => (
                    <label key={tactic} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${form.sales_pressure_tactics.includes(tactic) ? 'border-rose-300 bg-rose-50' : 'border-parchment-300 hover:border-parchment-400'}`}>
                      <input
                        type="checkbox"
                        checked={form.sales_pressure_tactics.includes(tactic)}
                        onChange={() => toggleArray('sales_pressure_tactics', tactic)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                        ${form.sales_pressure_tactics.includes(tactic) ? 'border-rose bg-rose' : 'border-parchment-400'}`}>
                        {form.sales_pressure_tactics.includes(tactic) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="font-sans text-sm">{tactic}</span>
                    </label>
                  ))}
                </div>
              </div>
              {form.sales_pressure_tactics.length >= 2 && (
                <div className="disclaimer-box">
                  <Info className="w-4 h-4 inline mr-2 text-gold" />
                  <span className="text-gold font-medium">Note:</span> Multiple pressure tactics may indicate misrepresentation issues worth documenting for a potential complaint.
                </div>
              )}
            </div>
          )}

          {/* Step 5: Your Situation */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-3">
                  Why are you looking to exit? <span className="text-ink/40 font-normal">(select all that apply)</span>
                </label>
                <div className="space-y-2">
                  {DISSATISFACTION.map(reason => (
                    <label key={reason} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${form.dissatisfaction_reasons.includes(reason) ? 'border-teal-300 bg-teal-50' : 'border-parchment-300 hover:border-parchment-400'}`}>
                      <input
                        type="checkbox"
                        checked={form.dissatisfaction_reasons.includes(reason)}
                        onChange={() => toggleArray('dissatisfaction_reasons', reason)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                        ${form.dissatisfaction_reasons.includes(reason) ? 'border-teal bg-teal' : 'border-parchment-400'}`}>
                        {form.dissatisfaction_reasons.includes(reason) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="font-sans text-sm">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-1.5">Additional context</label>
                <textarea
                  value={form.additional_notes}
                  onChange={e => update('additional_notes', e.target.value)}
                  placeholder="Anything else about your situation that may be relevant..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 6: Prior Actions */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-3">
                  Have you previously hired an exit company or attorney?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      onClick={() => update('prior_exit_company', opt.value)}
                      className={`p-4 rounded-lg border-2 text-sm font-medium font-sans transition-all
                        ${form.prior_exit_company === opt.value
                          ? 'border-teal bg-teal-50 text-teal'
                          : 'border-parchment-300 text-ink/60 hover:border-parchment-400'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {form.prior_exit_company && (
                <>
                  <div className="warning-box">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    <span className="font-medium">Important:</span> If you paid an exit company upfront and they didn't deliver, you may be a victim of fraud — AND a target for recovery scams. We'll flag this in your analysis.
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-ink mb-1.5">Company name and what happened</label>
                    <textarea
                      value={form.prior_exit_company_details}
                      onChange={e => update('prior_exit_company_details', e.target.value)}
                      placeholder="e.g. Paid $3,500 to XYZ Exit Co in 2022. They stopped responding after 6 months."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 7: Hardship */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-sans text-ink mb-3">
                  Are you experiencing any of the following hardships?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'financial', label: 'Significant financial hardship or change in income' },
                    { value: 'medical', label: 'Medical condition affecting ability to travel' },
                    { value: 'disability', label: 'Disability or mobility limitations' },
                    { value: 'age', label: 'Age-related inability to use the timeshare (65+)' },
                    { value: 'death', label: 'Death of co-owner / spouse' },
                    { value: 'divorce', label: 'Divorce or separation' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${form.hardship_types.includes(opt.value) ? 'border-gold-300 bg-gold-50' : 'border-parchment-300 hover:border-parchment-400'}`}>
                      <input
                        type="checkbox"
                        checked={form.hardship_types.includes(opt.value)}
                        onChange={() => {
                          toggleArray('hardship_types', opt.value)
                          if (!form.hardship_types.includes(opt.value)) {
                            update('has_hardship', true)
                          } else if (form.hardship_types.length <= 1) {
                            update('has_hardship', false)
                          }
                        }}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                        ${form.hardship_types.includes(opt.value) ? 'border-gold-500 bg-gold-500' : 'border-parchment-400'}`}>
                        {form.hardship_types.includes(opt.value) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="font-sans text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {form.hardship_types.length > 0 && (
                <div className="disclaimer-box">
                  <Info className="w-4 h-4 inline mr-2" />
                  Documented hardship can strengthen your request for a deed-back or hardship exit. We'll incorporate this into your action plan.
                </div>
              )}
            </div>
          )}

          {/* Step 8: Review */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-sans font-semibold text-ink mb-4">Summary</h3>
                <dl className="space-y-3">
                  {[
                    { label: 'Developer', value: form.developer_name || '—' },
                    { label: 'Resort', value: `${form.resort_name || '—'} (${form.resort_state || '—'})` },
                    { label: 'Purchase Date', value: form.purchase_date || '—' },
                    { label: 'Contract Type', value: form.contract_type },
                    { label: 'Purchase Price', value: form.purchase_price ? `$${Number(form.purchase_price).toLocaleString()}` : '—' },
                    { label: 'Loan Balance', value: form.loan_balance !== '' ? `$${Number(form.loan_balance).toLocaleString()}` : '—' },
                    { label: 'Annual Fees', value: form.maintenance_fee_annual ? `$${Number(form.maintenance_fee_annual).toLocaleString()}/yr` : '—' },
                    { label: 'Pressure Tactics', value: `${form.sales_pressure_tactics.length} selected` },
                    { label: 'Hardship', value: form.hardship_types.length > 0 ? form.hardship_types.join(', ') : 'None' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <dt className="text-ink/50 font-sans">{label}</dt>
                      <dd className="font-medium font-sans text-ink text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {form.rescission_deadline && new Date(form.rescission_deadline) >= new Date() && (
                <div className="warning-box">
                  <AlertTriangle className="w-4 h-4 inline mr-2 text-rose" />
                  <strong>Time Sensitive:</strong> Your rescission deadline may still be open. Submit now to see your options immediately.
                </div>
              )}

              <div className="disclaimer-box text-xs">
                By continuing, you understand that this platform provides consumer education only and does not constitute legal advice. The analysis generated is based on information you provide and may be incomplete.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-parchment-200">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-ghost disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            {step < STEPS.length ? (
              <button
                onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
                className="btn-primary"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate My Analysis
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

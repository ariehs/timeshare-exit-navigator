'use client'

import Link from 'next/link'
import {
  ShieldCheck, FileSearch, BarChart3, FileText,
  AlertTriangle, CheckCircle, ArrowRight, Star, Users, Clock
} from 'lucide-react'

const STATS = [
  { value: '9.6M', label: 'Timeshare owners in the US' },
  { value: '$24K', label: 'Average purchase price' },
  { value: '$1,400', label: 'Avg. annual maintenance fee' },
  { value: '85%', label: 'Report regret within 5 years' },
]

const STEPS = [
  {
    num: '01',
    title: 'Tell us about your situation',
    desc: 'Complete our intake questionnaire. No upload required to start — just what you know.',
  },
  {
    num: '02',
    title: 'Upload your contract (optional)',
    desc: 'Our document analysis extracts key terms, deadlines, and clauses with confidence scoring.',
  },
  {
    num: '03',
    title: 'Review your analysis',
    desc: 'See your actionability score, identified issues, and prioritized steps — all clearly labeled.',
  },
  {
    num: '04',
    title: 'Take informed action',
    desc: 'Generate draft letters, file complaints, and know what to watch out for.',
  },
]

const OUTPUTS = [
  { icon: FileSearch, title: 'Contract Analysis', desc: 'Clause-by-clause breakdown with plain-English summaries and confidence scores' },
  { icon: BarChart3, title: 'Actionability Score', desc: 'A data-driven score (A–F) of your exit options based on your specific situation' },
  { icon: AlertTriangle, title: 'Issue Identification', desc: 'Flagged concerns including potential misrepresentation, fee abuse, and perpetuity traps' },
  { icon: FileText, title: 'Draft Letters', desc: 'Rescission notices, complaint letters, and hardship requests — customized to your case' },
  { icon: ShieldCheck, title: 'Scam Protection', desc: 'Red flags and warning signs for the exit company industry\'s most common schemes' },
  { icon: CheckCircle, title: 'Action Plan', desc: 'Step-by-step prioritized roadmap with timelines, costs, and required documents' },
]

const NEVER_DO = [
  'Claim to be a law firm or provide legal advice',
  'Promise any particular outcome or cancellation',
  'Charge upfront fees for exit services',
  'Recommend specific attorneys or exit companies',
  'Fabricate or embellish information from your contract',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Nav */}
      <nav className="border-b border-parchment-300 bg-parchment-50/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-semibold text-ink text-lg">Timeshare Exit Navigator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/intake" className="btn-primary text-sm py-2 px-4">
              Start Free Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="badge-teal mb-6 inline-flex">
            <Star className="w-3 h-3" />
            Consumer Education Platform — Not Legal Advice
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-ink mb-6 leading-tight">
            Understand your<br />
            <em className="text-teal not-italic">timeshare exit</em><br />
            options.
          </h1>
          <p className="text-xl text-ink/60 font-sans mb-8 leading-relaxed max-w-xl">
            Analyze your contract, identify your options, and take informed action —
            without paying thousands to an exit company that may not deliver.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/intake" className="btn-primary">
              Start Free Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-sm text-ink/40 font-sans">No account required to start</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="card-parchment text-center">
              <div className="text-3xl font-serif font-bold text-ink mb-1">{stat.value}</div>
              <div className="text-xs text-ink/50 font-sans">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink text-parchment py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-label text-parchment/30 mb-4">How it works</div>
          <h2 className="text-3xl font-serif text-parchment mb-12">Four steps to clarity</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div className="text-gold font-serif text-4xl font-bold mb-3 opacity-60">{step.num}</div>
                <h3 className="font-sans font-semibold text-parchment mb-2">{step.title}</h3>
                <p className="text-parchment/50 text-sm font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="section-label mb-4">What you get</div>
        <h2 className="text-3xl font-serif text-ink mb-12">Your complete case file</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {OUTPUTS.map((item) => (
            <div key={item.title} className="card hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-teal" />
              </div>
              <h3 className="font-sans font-semibold text-ink mb-2">{item.title}</h3>
              <p className="text-ink/60 text-sm font-sans leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guardrails */}
      <section className="bg-parchment-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="section-label mb-4">Our guardrails</div>
              <h2 className="text-3xl font-serif text-ink mb-4">What we never do</h2>
              <p className="text-ink/60 font-sans mb-8">
                The timeshare exit industry is full of predatory companies that charge thousands in
                upfront fees and deliver nothing. We are not that. We are a consumer education platform.
              </p>
              <ul className="space-y-3">
                {NEVER_DO.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-sans text-ink/70">
                    <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-rose text-xs font-bold">✕</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="warning-box">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose mb-2 font-sans">Scam Warning</div>
                  <p className="text-rose/80 text-sm font-sans leading-relaxed mb-3">
                    Legitimate timeshare exit help is almost always free (developer programs) or
                    billed hourly by licensed attorneys.
                  </p>
                  <p className="text-rose/80 text-sm font-sans leading-relaxed">
                    <strong>If any company asks for $2,000–$10,000+ upfront to "cancel" your timeshare,
                    walk away.</strong> These are among the most common consumer fraud schemes in the country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-serif text-ink mb-4">Ready to understand your options?</h2>
        <p className="text-ink/60 font-sans mb-8 max-w-xl mx-auto">
          Start with our free intake questionnaire. No credit card, no account required.
          Takes about 10 minutes.
        </p>
        <Link href="/intake" className="btn-primary text-base px-8 py-4">
          Start Free Analysis
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-ink/40 font-sans">
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Consumer education only</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> ~10 minutes</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Not legal advice</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-parchment-300 bg-parchment-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs text-ink/40 font-sans leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> Timeshare Exit Navigator is a consumer education platform. We are not a law firm
            and do not provide legal advice. Nothing on this platform constitutes an attorney-client relationship.
            All information is for educational purposes only. If you have specific legal questions, consult a licensed
            attorney in your state.
          </p>
        </div>
      </footer>
    </div>
  )
}

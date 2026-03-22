import { ReactNode } from 'react'
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react'

// ─── Badge ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'teal' | 'gold' | 'rose' | 'ink' | 'default'
const BADGE_CLASSES: Record<BadgeVariant, string> = {
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  gold: 'bg-gold-100 text-gold-700 border-gold-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  ink: 'bg-ink-100 text-ink-600 border-ink-200',
  default: 'bg-parchment-200 text-ink/60 border-parchment-300',
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border font-sans ${BADGE_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ─── Alert ───────────────────────────────────────────────────────────────────

type AlertVariant = 'warning' | 'info' | 'success' | 'error'
const ALERT_CONFIG: Record<AlertVariant, { bg: string; border: string; text: string; icon: typeof AlertTriangle }> = {
  warning: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', icon: AlertTriangle },
  info: { bg: 'bg-parchment-100', border: 'border-gold/30', text: 'text-ink/70', icon: Info },
  success: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', icon: CheckCircle },
  error: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-900', icon: X },
}

export function Alert({
  variant = 'info',
  title,
  children,
}: {
  variant?: AlertVariant
  title?: string
  children: ReactNode
}) {
  const cfg = ALERT_CONFIG[variant]
  const Icon = cfg.icon
  return (
    <div className={`rounded-lg border p-4 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.text}`} />
        <div>
          {title && <div className={`font-semibold font-sans text-sm mb-1 ${cfg.text}`}>{title}</div>}
          <div className={`text-sm font-sans leading-relaxed ${cfg.text}`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Confidence Dot ──────────────────────────────────────────────────────────

export function ConfidenceDot({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color = pct >= 80 ? 'bg-teal-500' : pct >= 60 ? 'bg-gold-500' : 'bg-rose-400'
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink/40 font-mono">
      <span className={`w-2 h-2 rounded-full ${color}`} title={`${pct}% confidence`} />
      {pct}%
    </span>
  )
}

// ─── Source Label ────────────────────────────────────────────────────────────

type SourceType = 'DOCUMENT' | 'USER_STATED' | 'AI_ANALYSIS' | 'RULES_ENGINE'
const SOURCE_CONFIG: Record<SourceType, { label: string; class: string }> = {
  DOCUMENT: { label: 'DOCUMENT', class: 'text-teal-600 bg-teal-50 border-teal-100' },
  USER_STATED: { label: 'USER-STATED', class: 'text-gold-700 bg-gold-50 border-gold-100' },
  AI_ANALYSIS: { label: 'AI ANALYSIS', class: 'text-ink/50 bg-parchment-100 border-parchment-300' },
  RULES_ENGINE: { label: 'RULES ENGINE', class: 'text-teal/70 bg-teal-50/50 border-teal-100' },
}

export function SourceLabel({ type }: { type: SourceType }) {
  const cfg = SOURCE_CONFIG[type] ?? SOURCE_CONFIG.AI_ANALYSIS
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-widest border font-sans ${cfg.class}`}>
      {cfg.label}
    </span>
  )
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-parchment-300 my-4" />
  return (
    <div className="flex items-center gap-3 my-4">
      <hr className="flex-1 border-parchment-300" />
      <span className="text-xs text-ink/30 font-sans uppercase tracking-widest">{label}</span>
      <hr className="flex-1 border-parchment-300" />
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="text-center py-10 px-6">
      <div className="w-12 h-12 bg-parchment-200 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-ink/30" />
      </div>
      <h3 className="font-sans font-medium text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink/50 font-sans mb-4">{description}</p>}
      {action}
    </div>
  )
}

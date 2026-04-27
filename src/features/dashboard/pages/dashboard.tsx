import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../../auth/auth-context'
import { useMyAppraisals } from '../../../hooks/use-appraisal'
import { useReviewQueue } from '../../../hooks/use-reviews'
import { Avatar } from '@shared/layouts/avatar'
import { Icon } from '@shared/layouts/icon'
import { Appraisal } from '../../../data/mock-appraisals'

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_FLOW = [
  { key: 'draft',        label: 'Draft',        actor: 'You' },
  { key: 'sl_review',    label: 'SL Review',    actor: 'Squad Leader' },
  { key: 'hod_review',   label: 'HoD Review',   actor: 'Head of Dept' },
  { key: 'hodiv_review', label: 'HoDiv Review', actor: 'Head of Div' },
  { key: 'acknowledge',  label: 'Acknowledge',  actor: 'You' },
  { key: 'completed',    label: 'Completed',    actor: 'HR' },
] as const

const STATUS_BADGE: Record<string, string> = {
  draft:        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  sl_review:    'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  hod_review:   'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  hodiv_review: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  acknowledge:  'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  completed:    'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
}

// Static 4-quarter performance history
const PERF_HISTORY = {
  quarters:   ["Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26"],
  self:       [3.6, 3.9, 4.1, 4.0] as number[],
  reviewer:   [3.4, 3.7, 3.9, null] as (number | null)[],
  calibrated: [3.5, 3.6, 3.7, null] as (number | null)[],
}

const ACTIVITIES = [
  { avatar: 'DA', who: 'Dewi Anggraeni',  what: 'left a note on',       target: 'KRA: Indonesia payment rails',  when: '2h ago',    tone: 'success' as const },
  { avatar: 'AP', who: 'You',             what: 'attached evidence to', target: 'KRA: Migrate auth to OIDC',     when: 'Yesterday', tone: 'brand'   as const },
  { avatar: 'HR', who: 'HR Console',      what: 'reminded you about',   target: 'cycle deadline',                when: 'Mar 20',    tone: 'warning' as const },
  { avatar: 'RO', who: 'Rifky Oktaviano', what: 'reminded you to submit',target: 'self-appraisal · Mar 28',     when: '2d ago',    tone: 'gray'    as const },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function weightedScore(a: Appraisal) {
  return a.kras.reduce((sum, k) => sum + (k.self_score * k.weight / 100), 0)
}

function getStatusLabel(s: string) {
  return STATUS_FLOW.find(f => f.key === s)?.label ?? s
}

function roleLabel(role: string) {
  if (role === 'sl')     return 'Squad Leader'
  if (role === 'hodept') return 'Head of Department'
  if (role === 'hodiv')  return 'Head of Division'
  return role
}

function reviewPath(role: 'sl' | 'hod' | 'hodiv', id: string) {
  return `/review/${role}/${id}` as any
}

// ── Mini SVG performance chart ────────────────────────────────────────────────
function PerfChart() {
  const xs = [40, 140, 240, 340]
  const sy = (v: number) => 155 - (v / 5) * 130

  function pts(data: (number | null)[]) {
    return data.map((v, i) => v !== null ? `${xs[i]},${sy(v)}` : null).filter(Boolean).join(' ')
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4">
        {[
          { label: 'Self score',     color: '#465fff' },
          { label: 'Reviewer final', color: '#12b76a' },
          { label: 'Calibrated',     color: '#94a3b8' },
        ].map(s => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-block h-0.5 w-5 rounded" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 380 185" className="w-full" style={{ height: 175 }}>
        {[0, 1, 2, 3, 4, 5].map(v => (
          <g key={v}>
            <line x1={40} y1={sy(v)} x2={345} y2={sy(v)} stroke="#e5e7eb" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={32} y={sy(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v.toFixed(1)}</text>
          </g>
        ))}
        {PERF_HISTORY.quarters.map((q, i) => (
          <text key={q} x={xs[i]} y={175} textAnchor="middle" fontSize={11} fill="#94a3b8">{q}</text>
        ))}
        <polyline points={pts(PERF_HISTORY.self)}       fill="none" stroke="#465fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts(PERF_HISTORY.reviewer)}   fill="none" stroke="#12b76a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts(PERF_HISTORY.calibrated)} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" />
        {PERF_HISTORY.self.map((v, i) => (
          <circle key={i} cx={xs[i]} cy={sy(v)} r={4} fill="#fff" stroke="#465fff" strokeWidth={2} />
        ))}
        {PERF_HISTORY.reviewer.map((v, i) => v !== null && (
          <circle key={i} cx={xs[i]} cy={sy(v)} r={4} fill="#fff" stroke="#12b76a" strokeWidth={2} />
        ))}
      </svg>
    </div>
  )
}

// ── Approval flow ─────────────────────────────────────────────────────────────
function ApprovalFlow({ status }: { status: string }) {
  const idx = STATUS_FLOW.findIndex(s => s.key === status)
  return (
    <ol className="mt-5 space-y-4">
      {STATUS_FLOW.map((s, i) => {
        const done    = i < idx
        const current = i === idx
        return (
          <li key={s.key} className="flex gap-3">
            <div className="relative">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold ${
                done    ? 'bg-success-500 text-white'
                : current ? 'bg-brand-500 text-white ring-4 ring-brand-500/15'
                          : 'border-2 border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'
              }`}>
                {done ? Icon.check : i + 1}
              </span>
              {i < STATUS_FLOW.length - 1 && (
                <span className={`absolute left-1/2 top-8 h-7 w-0.5 -translate-x-1/2 ${done ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-800'}`} />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className={`text-sm font-semibold ${current ? 'text-gray-900 dark:text-white' : done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                {s.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.actor}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ── KRA expandable row ────────────────────────────────────────────────────────
function KRARow({ kra, expanded, onToggle }: {
  kra: Appraisal['kras'][number]
  expanded: boolean
  onToggle: () => void
}) {
  const filled = kra.self_score > 0
  const pct    = filled ? (kra.self_score / 5) * 100 : 0
  const bar    = !filled ? 'bg-gray-200 dark:bg-gray-700' : kra.self_score >= 4 ? 'bg-success-500' : kra.self_score >= 3 ? 'bg-warning-500' : 'bg-error-500'

  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <button onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/60 dark:hover:bg-white/[0.02]">
        <span className="grid h-9 w-12 shrink-0 place-items-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {kra.weight}%
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{kra.title}</p>
            {filled
              ? <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${kra.self_score >= 4 ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400' : 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'}`}>Self {kra.self_score}/5</span>
              : <span className="inline-flex items-center rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">Score required</span>
            }
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{kra.evidence.length} evidence</span>
          </div>
          {kra.target && (
            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              Target: <span className="font-medium text-gray-700 dark:text-gray-300">{kra.target}</span>
            </p>
          )}
        </div>
        <div className="hidden w-44 shrink-0 sm:block">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Self score</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{filled ? `${kra.self_score}/5` : '—'}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className={`h-full transition-all ${bar}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>{Icon.chev}</span>
      </button>

      {expanded && (
        <div className="border-t border-dashed border-gray-200 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{kra.description}</p>
              {filled && kra.self_comment && (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Your comment</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{kra.self_comment}</p>
                </>
              )}
              <div className="mt-4">
                <Link to="/self-appraisal"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                  {filled ? 'Edit in self-appraisal' : 'Score & comment'}
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Evidence ({kra.evidence.length})</p>
              {kra.evidence.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No evidence yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {kra.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-gray-400">{Icon.paper}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800 dark:text-white/90">{e.name}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{e.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Team overview (SL / HoD / HoDiv) ─────────────────────────────────────────
type ReviewItem = { id: string; cycleName: string; userId: string; status: string; reviewRole: 'sl' | 'hod' | 'hodiv' }

function TeamOverview({ role, items }: { role: string; items: ReviewItem[] }) {
  const navigate = useNavigate()

  const pending  = items.filter(r =>
    (role === 'sl'     && r.status === 'sl_review') ||
    (role === 'hodept' && r.status === 'hod_review') ||
    (role === 'hodiv'  && r.status === 'hodiv_review'),
  )
  const inReview = items.filter(r => ['sl_review', 'hod_review', 'hodiv_review'].includes(r.status))
  const done     = items.filter(r => ['completed', 'acknowledge'].includes(r.status))

  const stats = [
    { label: 'Total team',    val: items.length,    color: '#94a3b8' },
    { label: 'In review',     val: inReview.length, color: '#465fff' },
    { label: 'Pending my OK', val: pending.length,  color: '#f97316' },
    { label: 'Completed',     val: done.length,     color: '#12b76a' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{roleLabel(role)} · Q1 2026 Appraisal</p>
        </div>
        {pending.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
            {pending.length} pending your review
          </span>
        )}
      </div>

      {/* Mini pipeline stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-full rounded-full" style={{
                width: items.length ? `${(s.val / items.length) * 100}%` : '0%',
                background: s.color,
              }} />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{s.val}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Review queue table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">Review queue</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Action required as {roleLabel(role)}</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            pending.length
              ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
          }`}>{pending.length} pending</span>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No appraisals in your queue.</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Submitted appraisals will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Cycle</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map(r => {
                  const needsAction =
                    (r.reviewRole === 'sl'    && r.status === 'sl_review') ||
                    (r.reviewRole === 'hod'   && r.status === 'hod_review') ||
                    (r.reviewRole === 'hodiv' && r.status === 'hodiv_review')
                  return (
                    <tr key={`${r.id}-${r.reviewRole}`} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={r.userId.slice(0, 2).toUpperCase()} tone="brand" size="sm" />
                          <p className="font-semibold text-gray-800 dark:text-white/90">{r.userId}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{r.cycleName}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[r.status] ?? ''}`}>
                          {getStatusLabel(r.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {needsAction ? (
                          <button onClick={() => navigate({ to: reviewPath(r.reviewRole, r.id) })}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                            Review {Icon.chev}
                          </button>
                        ) : (
                          <button className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuth()
  const { data: appraisals, isLoading } = useMyAppraisals(user?.id ?? '')
  const { data: slQueue }    = useReviewQueue(user?.id ?? '', 'sl')
  const { data: hodQueue }   = useReviewQueue(user?.id ?? '', 'hod')
  const { data: hodivQueue } = useReviewQueue(user?.id ?? '', 'hodiv')

  const [expandedKra, setExpandedKra] = useState<string | null>(null)

  const appraisal = appraisals?.[0]
  const canReview = user?.role === 'sl' || user?.role === 'hodept' || user?.role === 'hodiv'
  const firstName = user?.name.split(' ')[0] ?? 'there'
  const status    = appraisal?.status ?? 'draft'

  const weighted      = appraisal ? weightedScore(appraisal) : 0
  const evidenceCount = appraisal?.kras.reduce((s, k) => s + k.evidence.length, 0) ?? 0

  const allTeamItems: ReviewItem[] = [
    ...(slQueue    ?? []).map(i => ({ ...i, reviewRole: 'sl'    as const })),
    ...(hodQueue   ?? []).map(i => ({ ...i, reviewRole: 'hod'   as const })),
    ...(hodivQueue ?? []).map(i => ({ ...i, reviewRole: 'hodiv' as const })),
  ]

  return (
    <main className="space-y-6 px-6 py-6 lg:px-8">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>Home</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="font-medium text-gray-800 dark:text-white/90">My Appraisals</span>
          </nav>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">Hello, {firstName}</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {user?.position ?? ''}{user?.squad ? ` · ${user.squad}` : ''}{user?.dept ? ` · ${user.dept}` : ''}
            <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
            Q1 2026 runs{' '}
            <strong className="text-gray-700 dark:text-gray-300">Jan 1</strong> –{' '}
            <strong className="text-gray-700 dark:text-gray-300">Mar 31, 2026</strong>
          </p>
        </div>
        <Link to="/self-appraisal"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
          {Icon.doc}<span>Open self-appraisal</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm text-gray-400">Loading appraisal…</p>
        </div>
      ) : !appraisal ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No active appraisal cycle found.</p>
          <p className="mt-1 text-xs text-gray-400">HR has not opened a cycle for this account yet.</p>
        </div>
      ) : (
        <>
          {/* ── Banners ── */}
          {status === 'draft' && (
            <div className="rounded-2xl border border-warning-200 bg-warning-50 px-5 py-4 dark:border-warning-800/50 dark:bg-warning-500/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-500 text-white">{Icon.warn}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-warning-800 dark:text-warning-300">
                      Action required · Submit self-appraisal before Mar 31, 2026
                    </h3>
                    <p className="mt-1 text-sm text-warning-700 dark:text-warning-400">
                      {appraisal.kras.filter(k => k.self_score === 0).length > 0
                        ? `${appraisal.kras.filter(k => k.self_score === 0).length} of ${appraisal.kras.length} KRAs still need a self-score.`
                        : 'All KRAs scored — review your reflection and submit final.'
                      }
                    </p>
                  </div>
                </div>
                <Link to="/self-appraisal"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-warning-300 bg-white px-4 py-2.5 text-sm font-semibold text-warning-700 hover:bg-warning-100 dark:border-warning-800/60 dark:bg-warning-500/5 dark:text-warning-300">
                  Continue self-appraisal {Icon.chev}
                </Link>
              </div>
            </div>
          )}

          {(status === 'sl_review' || status === 'hod_review' || status === 'hodiv_review') && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800/50 dark:bg-blue-500/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">{Icon.doc}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                      Submitted · in review with {STATUS_FLOW.find(s => s.key === status)?.actor}
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">You'll be notified when the next reviewer takes action.</p>
                  </div>
                </div>
                <Link to="/self-appraisal"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-500/5 dark:text-blue-300">
                  View submission
                </Link>
              </div>
            </div>
          )}

          {status === 'acknowledge' && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800/50 dark:bg-blue-500/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">{Icon.check}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Final scores ready · Acknowledge to close the cycle</h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">HoDiv has signed off. Review final scores and acknowledge.</p>
                  </div>
                </div>
                <Link to="/acknowledge/$appraisalId" params={{ appraisalId: appraisal.id }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Review &amp; acknowledge {Icon.chev}
                </Link>
              </div>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {([
              {
                icon: Icon.bar,   tone: 'brand',
                label: 'Self score (live)',
                value: weighted > 0 ? weighted.toFixed(1) : '—', sub: '/100',
                foot: `${appraisal.kras.filter(k => k.self_score > 0).length}/${appraisal.kras.length} KRAs scored`,
              },
              {
                icon: Icon.doc,   tone: status === 'completed' ? 'success' : status === 'draft' ? 'warning' : 'info',
                label: 'Appraisal status',
                value: getStatusLabel(status), sub: '',
                foot: `With ${STATUS_FLOW.find(s => s.key === status)?.actor ?? ''}`,
              },
              {
                icon: Icon.paper, tone: 'success',
                label: 'Evidence attached',
                value: evidenceCount, sub: 'items',
                foot: 'Across all KRAs',
              },
              {
                icon: Icon.clock, tone: 'info',
                label: 'Days to cycle end',
                value: '4', sub: 'days',
                foot: 'Mar 31, 2026 · submission window',
              },
            ] as const).map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  s.tone === 'brand'   ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                  : s.tone === 'success' ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                  : s.tone === 'warning' ? 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400'
                  :                        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300'
                }`}>
                  {s.icon}
                </div>
                <div className="mt-5">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white/90">{s.value}</span>
                    {s.sub && <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{s.sub}</span>}
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{s.foot}</p>
              </div>
            ))}
          </div>

          {/* ── Performance chart + Approval flow ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Performance history</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Self vs reviewer-final vs HR-calibrated, last 4 quarters.</p>
              <div className="mt-4"><PerfChart /></div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Approval flow</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Q1 2026 routing.</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status] ?? ''}`}>
                  {getStatusLabel(status)}
                </span>
              </div>
              <ApprovalFlow status={status} />
            </div>
          </div>

          {/* ── KRA list ── */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">My KRAs · Q1 2026</h3>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  From template snapshot · weight total {appraisal.kras.reduce((s, k) => s + k.weight, 0)}%
                </p>
              </div>
              <Link to="/self-appraisal"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                {Icon.doc} {status === 'draft' ? 'Continue self-appraisal' : 'View submission'}
              </Link>
            </div>
            {appraisal.kras.map(kra => (
              <KRARow key={kra.id} kra={kra}
                expanded={expandedKra === kra.id}
                onToggle={() => setExpandedKra(expandedKra === kra.id ? null : kra.id)}
              />
            ))}
          </div>

          {/* ── Team overview for leader roles ── */}
          {canReview && <TeamOverview role={user!.role} items={allTeamItems} />}

          {/* ── Activity + Cycle summary ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent activity</h3>
                <button className="text-sm font-semibold text-brand-600 dark:text-brand-300">View all</button>
              </div>
              <ol className="mt-4 space-y-4">
                {ACTIVITIES.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <Avatar initials={a.avatar} tone={a.tone} size="md" />
                    <div className="min-w-0 flex-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-gray-800 dark:text-white/90">{a.who}</span>{' '}{a.what}{' '}
                        <span className="font-medium text-brand-600 dark:text-brand-300">{a.target}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{a.when}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Cycle summary</h3>
              <dl className="mt-4 space-y-3.5">
                {([
                  ['Cycle',   appraisal.cycleName],
                  ['Period',  'Jan 1 – Mar 31, 2026'],
                  ['Status',  getStatusLabel(status)],
                  ['SL',      appraisal.reviewers.sl.name],
                  ['HoD',     appraisal.reviewers.hod.name],
                  ['HoDiv',   appraisal.reviewers.hodiv.name],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 pb-3.5 last:border-0 last:pb-0 dark:border-gray-800">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">{k}</dt>
                    <dd className="text-right text-sm font-semibold text-gray-800 dark:text-white/90">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/self-appraisal"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                {status === 'draft' ? 'Continue self-appraisal' : 'Open appraisal'}
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

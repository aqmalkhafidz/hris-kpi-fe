import { useState, useMemo } from 'react'
import { Icon } from '@shared/layouts/icon'
import { Avatar } from '@shared/layouts/avatar'
import { PageShell } from '@shared/layouts/page-shell'
import { Badge } from '@shared/ui/badge'
import {
  useHrDashboard,
  type HrDashboardCycle,
  type HrDashboardPipeline,
  type HrDashboardDivision,
  type HrDashboardScoreBucket,
  type HrDashboardRecentSubmission,
  type HrDashboardAttention,
  type HrDashboardStats,
} from '../hooks/use-hr-dashboard'

function StatCard({
  icon, label, value, sub, tone = 'brand',
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  tone?: 'brand' | 'success' | 'warning' | 'error'
}) {
  const iconBg = {
    brand:   'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    error:   'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
  }[tone]
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
      </div>
      <p className="mt-4 text-[13px] text-gray-500 dark:text-gray-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-[28px] font-bold leading-none tracking-tight text-gray-900 dark:text-white">{value}</p>
        {sub && <span className="text-xs text-gray-500 dark:text-gray-400">{sub}</span>}
      </div>
    </div>
  )
}

function CycleHeader({ cycle, pipeline }: { cycle: HrDashboardCycle; pipeline: HrDashboardPipeline }) {
  const completionPct = pipeline.invited > 0
    ? Math.round(((pipeline.completed + pipeline.hodivApproved + pipeline.hodApproved) / pipeline.invited) * 100)
    : 0
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-brand-50/40 p-6 dark:border-gray-800 dark:from-white/[0.02] dark:to-brand-500/5">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="brand">Active cycle</Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">Started {cycle.startDate}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{cycle.name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {cycle.selfDeadline && (
              <>
                Self-appraisal closes{' '}
                <strong className="text-gray-700 dark:text-gray-200">{cycle.selfDeadline}</strong>
                {' '}·{' '}
              </>
            )}
            Cycle ends{' '}
            <strong className="text-gray-700 dark:text-gray-200">{cycle.endDate}</strong>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Cycle progress</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor"
                    className="text-gray-200 dark:text-gray-800" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" className="text-brand-500" stroke="currentColor"
                    strokeWidth="3" strokeDasharray={`${completionPct} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-gray-900 dark:text-white">
                  {completionPct}%
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {pipeline.completed + pipeline.hodivApproved + pipeline.hodApproved}/{pipeline.invited}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">past HoD review</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
              {Icon.send}<span>Send reminder</span>
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200">
              {Icon.download}<span>Export report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PipelineCard({ cycle, pipeline }: { cycle: HrDashboardCycle; pipeline: HrDashboardPipeline }) {
  const stages = [
    { id: 'invited',   label: 'Invited',        val: pipeline.invited,       color: '#94a3b8' },
    { id: 'draft',     label: 'Draft started',  val: pipeline.draftStarted,  color: '#7592ff' },
    { id: 'self',      label: 'Self submitted', val: pipeline.selfSubmitted, color: '#465fff' },
    { id: 'sl',        label: 'SL approved',    val: pipeline.slApproved,    color: '#7c5cff' },
    { id: 'hod',       label: 'HoD approved',   val: pipeline.hodApproved,   color: '#10b981' },
    { id: 'hodiv',     label: 'HoDiv approved', val: pipeline.hodivApproved, color: '#059669' },
    { id: 'completed', label: 'Completed',      val: pipeline.completed,     color: '#047857' },
  ]
  const total = pipeline.invited || 1
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">Cycle pipeline</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{cycle.name} · {cycle.startDate} – {cycle.endDate}</p>
        </div>
        <Badge tone="brand">Active</Badge>
      </div>
      <div className="mt-6 space-y-3">
        {stages.map((s, i) => {
          const pct  = (s.val / total) * 100
          const next = stages[i + 1]
          const drop = next ? s.val - next.val : 0
          return (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">{s.label}</span>
                <span className="tabular-nums text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{s.val}</span>
                  <span className="ml-1">/ {pipeline.invited}</span>
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
              </div>
              {next && drop > 0 && (
                <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  −{drop} dropped to next stage
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type SortKey = 'completion' | 'avg' | 'name'

function DivisionTable({ divisions }: { divisions: HrDashboardDivision[] }) {
  const [sortBy, setSortBy] = useState<SortKey>('completion')
  const rows = useMemo(() => {
    const r = divisions.map(d => ({
      ...d,
      completion: d.total > 0 ? ((d.completed + d.inReview) / d.total) * 100 : 0,
    }))
    if (sortBy === 'completion') r.sort((a, b) => b.completion - a.completion)
    if (sortBy === 'avg')        r.sort((a, b) => b.avg - a.avg)
    if (sortBy === 'name')       r.sort((a, b) => a.name.localeCompare(b.name))
    return r
  }, [sortBy, divisions])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">Progress by division</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Hover a row for breakdown</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
          >
            <option value="completion">Sort: Completion</option>
            <option value="avg">Sort: Avg score</option>
            <option value="name">Sort: Name</option>
          </select>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            {Icon.download}<span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-6 py-3">Division</th>
              <th className="px-3 py-3 text-right">Headcount</th>
              <th className="px-3 py-3">Progress</th>
              <th className="px-3 py-3 text-right">Avg score</th>
              <th className="px-3 py-3 text-right">Stage breakdown</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Belum ada appraisal terdistribusi di cycle ini.
                </td>
              </tr>
            )}
            {rows.map(r => {
              const denom = r.total || 1
              const pctCompleted = (r.completed  / denom) * 100
              const pctReview    = (r.inReview   / denom) * 100
              const pctDraft     = (r.draft      / denom) * 100
              const pctNotStart  = (r.notStarted / denom) * 100
              return (
                <tr key={r.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{r.name}</p>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums text-gray-700 dark:text-gray-300">{r.total}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-2 w-44 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div style={{ width: `${pctCompleted}%`, background: '#12b76a' }} />
                        <div style={{ width: `${pctReview}%`,    background: '#465fff' }} />
                        <div style={{ width: `${pctDraft}%`,     background: '#fdb022' }} />
                        <div style={{ width: `${pctNotStart}%`,  background: '#e5e7eb' }} />
                      </div>
                      <span className="tabular-nums text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {Math.round(r.completion)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
                      r.avg >= 4
                        ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                        : 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'
                    }`}>
                      {r.avg.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-1.5 text-[11px] tabular-nums">
                      <span title="Completed"   className="rounded bg-success-50 px-1.5 py-0.5 text-success-700 dark:bg-success-500/10 dark:text-success-400">{r.completed}</span>
                      <span title="In review"   className="rounded bg-brand-50 px-1.5 py-0.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{r.inReview}</span>
                      <span title="Draft"       className="rounded bg-warning-50 px-1.5 py-0.5 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">{r.draft}</span>
                      <span title="Not started" className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{r.notStarted}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-300">{Icon.chev}</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 border-t border-gray-200 px-6 py-3 text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: '#12b76a' }} />Completed</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: '#465fff' }} />In review</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: '#fdb022' }} />Draft</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: '#e5e7eb' }} />Not started</span>
      </div>
    </div>
  )
}

const BUCKET_COLORS: Record<string, string> = {
  '1.0–1.9': '#f04438',
  '2.0–2.9': '#f97066',
  '3.0–3.9': '#fdb022',
  '4.0–4.4': '#84cc16',
  '4.5–5.0': '#12b76a',
}
const BUCKET_MIDS = [1.5, 2.5, 3.5, 4.2, 4.75]

function ScoreDistributionCard({ buckets }: { buckets: HrDashboardScoreBucket[] }) {
  const total = buckets.reduce((s, b) => s + b.count, 0)
  const max   = Math.max(...buckets.map(b => b.count), 1)
  const avg = total === 0
    ? 0
    : buckets.reduce((sum, bucket, idx) => sum + bucket.count * (BUCKET_MIDS[idx] ?? 0), 0) / total
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">Score distribution</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Final scores · {total} appraisals reviewed</p>
        </div>
        <Badge tone="neutral">5-pt scale</Badge>
      </div>
      <div className="mt-6 flex items-end justify-between gap-3 px-1" style={{ height: 160 }}>
        {buckets.map(b => {
          const h = (b.count / max) * 140
          return (
            <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[11px] font-semibold tabular-nums text-gray-700 dark:text-gray-200">{b.count}</span>
              <div className="w-full rounded-t-lg" style={{ height: h, background: BUCKET_COLORS[b.label] ?? '#465fff' }} />
              <span className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">{b.label}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Avg score</p>
          <p className="mt-0.5 font-semibold tabular-nums text-gray-900 dark:text-white">{avg.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Total reviewed</p>
          <p className="mt-0.5 font-semibold tabular-nums text-gray-900 dark:text-white">{total}</p>
        </div>
      </div>
    </div>
  )
}

function AttentionCard({ items }: { items: HrDashboardAttention[] }) {
  const toneBg: Record<string, string> = {
    error:   'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300',
    brand:   'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900 dark:text-white">Needs attention</p>
        <button className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300">View all</button>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          Tidak ada notifikasi.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((a, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-gray-200 px-3 py-3 dark:border-gray-800">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneBg[a.tone]}`}>
                {Icon.warn}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{a.title}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{a.subtitle}</p>
              </div>
              <button className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]">
                Action
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RecentSubmissions({ items }: { items: HrDashboardRecentSubmission[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900 dark:text-white">Recent submissions</p>
        <button className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300">Full feed</button>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          Belum ada aktivitas.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((s, i) => (
            <li key={i} className="flex items-center gap-3">
              <Avatar initials={s.initials} tone="brand" size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {s.who}{' '}
                  <span className="font-normal text-gray-500 dark:text-gray-400">moved to</span>{' '}
                  {s.to}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{s.team}</p>
              </div>
              <span className="text-[11px] tabular-nums text-gray-400 dark:text-gray-500">{s.when}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StatCards({ stats }: { stats: HrDashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Icon.team}  label="Active employees"    value={stats.activeEmployees} sub="in this cycle"      tone="brand"   />
      <StatCard icon={Icon.check} label="Self-appraisal done" value={stats.selfDone}        sub={stats.activeEmployees ? `of ${stats.activeEmployees}` : ''} tone="success" />
      <StatCard icon={Icon.clock} label="Awaiting review"     value={stats.awaitingReview}  sub="across SL/HoD/HoDiv" tone="warning" />
      <StatCard icon={Icon.warn}  label="Overdue"             value={stats.overdue}         sub="past self deadline"   tone="error"   />
    </div>
  )
}

export function HrDashboardPage() {
  const { data, isLoading, error } = useHrDashboard()

  if (isLoading) {
    return (
      <PageShell breadcrumb="HR Dashboard">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </PageShell>
    )
  }
  if (error || !data) {
    return (
      <PageShell breadcrumb="HR Dashboard">
        <div className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-700 dark:border-error-800/50 dark:bg-error-500/10 dark:text-error-300">
          Gagal memuat dashboard.
        </div>
      </PageShell>
    )
  }
  if (!data.cycle) {
    return (
      <PageShell breadcrumb="HR Dashboard">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Belum ada cycle yang dibuat.</p>
          <p className="mt-1 text-xs text-gray-400">Buat cycle baru di menu Cycles untuk memulai distribusi appraisal.</p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell breadcrumb="HR Dashboard">
      <CycleHeader cycle={data.cycle} pipeline={data.pipeline} />
      <StatCards stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2"><DivisionTable divisions={data.divisions} /></div>
        <PipelineCard cycle={data.cycle} pipeline={data.pipeline} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ScoreDistributionCard buckets={data.scoreBuckets} />
        <AttentionCard items={data.attention} />
        <RecentSubmissions items={data.recentSubmissions} />
      </div>
    </PageShell>
  )
}

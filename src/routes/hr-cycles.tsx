import { PageShell } from '../components/shell/page-shell'
import { Badge } from '../components/shell/badge'

const CYCLES = [
  { id: 'c1', name: 'Q1 2026 Performance Review', period: 'Jan 1 — Mar 31, 2026', deadline: 'Apr 30, 2026', status: 'active'   as const },
  { id: 'c2', name: 'Q4 2025 Performance Review', period: 'Oct 1 — Dec 31, 2025', deadline: 'Jan 31, 2026', status: 'closed'   as const },
  { id: 'c3', name: 'Q2 2026 Performance Review', period: 'Apr 1 — Jun 30, 2026', deadline: 'Jul 31, 2026', status: 'upcoming' as const },
]

const TONE = { active: 'success', closed: 'gray', upcoming: 'brand' } as const

export function HrCyclesPage() {
  return (
    <PageShell breadcrumb="Cycles">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px', color: 'var(--text-strong,#14182a)' }}>
            Performance Cycles
          </h1>
          <button disabled className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed">
            + New Cycle
          </button>
        </div>

        <div className="space-y-3">
          {CYCLES.map(cycle => (
            <div key={cycle.id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{cycle.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Period: {cycle.period}</p>
                  <p className="text-xs text-gray-400">Submission deadline: {cycle.deadline}</p>
                </div>
                <Badge tone={TONE[cycle.status]}>
                  {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400">Cycle management is read-only in this demo.</p>
      </div>
    </PageShell>
  )
}

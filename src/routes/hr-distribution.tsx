import { PageShell } from '../components/shell/page-shell'

const DISTRIBUTION = [
  { label: 'Far Exceed Expectation', score: 5, count: 2, pct: 20, color: 'bg-success-500' },
  { label: 'Exceed Expectation',     score: 4, count: 3, pct: 30, color: 'bg-brand-400'   },
  { label: 'Meet Expectation',       score: 3, count: 4, pct: 40, color: 'bg-brand-200'   },
  { label: 'Below Expectation',      score: 2, count: 1, pct: 10, color: 'bg-warning-400' },
  { label: 'Far Below Expectation',  score: 1, count: 0, pct: 0,  color: 'bg-error-400'   },
]

export function HrDistributionPage() {
  const total = DISTRIBUTION.reduce((s, d) => s + d.count, 0)

  return (
    <PageShell breadcrumb="Distribution">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px', color: 'var(--text-strong,#14182a)' }}>
          Score Distribution
        </h1>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-700 dark:text-white mb-1">Q1 2026 Performance Review</p>
          <p className="text-xs text-gray-400 mb-5">{total} employees · final scores</p>

          <div className="flex h-40 items-end gap-3 mb-6">
            {DISTRIBUTION.map(d => (
              <div key={d.score} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-600">{d.count}</span>
                <div
                  className={`w-full rounded-t-lg ${d.color} transition-all`}
                  style={{ height: `${d.pct === 0 ? 4 : (d.pct / 40) * 100}%` }}
                />
                <span className="text-xs text-gray-400">{d.score}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {DISTRIBUTION.map(d => (
              <div key={d.score} className="flex items-center gap-3">
                <span className="flex-1 text-xs text-gray-600">{d.label}</span>
                <div className="w-32 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-12 text-right">{d.count} ({d.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400">Distribution is read-only in this demo.</p>
      </div>
    </PageShell>
  )
}

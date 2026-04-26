import { useEmployees } from '../hooks/use-org'
import { PageShell } from '../components/shell/page-shell'

export function HrDashboardPage() {
  const { data: employees, isLoading } = useEmployees()

  const total  = employees?.length ?? 0
  const byDept = employees?.reduce<Record<string, number>>((acc, e) => {
    acc[e.dept] = (acc[e.dept] ?? 0) + 1
    return acc
  }, {}) ?? {}

  const stats = [
    { label: 'Total Employees',     value: total },
    { label: 'Departments',         value: Object.keys(byDept).length },
    { label: 'Active Cycles',       value: 1 },
    { label: 'Pending Calibration', value: 0 },
  ]

  return (
    <PageShell breadcrumb="HR Dashboard">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px', color: 'var(--text-strong,#14182a)' }}>
          HR Dashboard
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-2xl font-bold text-brand-600">{isLoading ? '—' : s.value}</p>
              <p className="mt-1 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4">Employees by Department</p>
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(byDept).map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <span className="w-40 text-xs text-gray-600 truncate">{dept}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-400"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-700 dark:text-white mb-2">Current Cycle</p>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Q1 2026 Performance Review</span>
            <span className="rounded-full bg-brand-50 px-3 py-0.5 text-xs font-semibold text-brand-600">Active</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Period: Jan 1 — Mar 31, 2026 · Deadline: Apr 30, 2026</p>
        </div>
      </div>
    </PageShell>
  )
}

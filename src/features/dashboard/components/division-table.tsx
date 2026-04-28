import { Icon } from '@shared/layouts/icon';
import { useState, useMemo } from 'react';
import type { HrDashboardDivision } from '../hooks/use-hr-dashboard';

type SortKey = 'completion' | 'avg' | 'name';

export function DivisionTable({
  divisions,
}: {
  divisions: HrDashboardDivision[];
}) {
  const [sortBy, setSortBy] = useState<SortKey>('completion');
  const rows = useMemo(() => {
    const r = divisions.map((d) => ({
      ...d,
      completion:
        d.total > 0 ? ((d.completed + d.inReview) / d.total) * 100 : 0,
    }));
    if (sortBy === 'completion') r.sort((a, b) => b.completion - a.completion);
    if (sortBy === 'avg') r.sort((a, b) => b.avg - a.avg);
    if (sortBy === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [sortBy, divisions]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            Progress by division
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hover a row for breakdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-600 focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300"
          >
            <option value="completion">Sort: Completion</option>
            <option value="avg">Sort: Avg score</option>
            <option value="name">Sort: Name</option>
          </select>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
            {Icon.download}
            <span>Export</span>
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
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Belum ada appraisal terdistribusi di cycle ini.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const denom = r.total || 1;
              const pctCompleted = (r.completed / denom) * 100;
              const pctReview = (r.inReview / denom) * 100;
              const pctDraft = (r.draft / denom) * 100;
              const pctNotStart = (r.notStarted / denom) * 100;
              return (
                <tr
                  key={r.name}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {r.name}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {r.total}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-2 w-44 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          style={{
                            width: `${pctCompleted}%`,
                            background: '#12b76a',
                          }}
                        />
                        <div
                          style={{
                            width: `${pctReview}%`,
                            background: '#465fff',
                          }}
                        />
                        <div
                          style={{
                            width: `${pctDraft}%`,
                            background: '#fdb022',
                          }}
                        />
                        <div
                          style={{
                            width: `${pctNotStart}%`,
                            background: '#e5e7eb',
                          }}
                        />
                      </div>
                      <span className="tabular-nums text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {Math.round(r.completion)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
                        r.avg >= 4
                          ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                          : 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'
                      }`}
                    >
                      {r.avg.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-1.5 text-[11px] tabular-nums">
                      <span
                        title="Completed"
                        className="rounded bg-success-50 px-1.5 py-0.5 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                      >
                        {r.completed}
                      </span>
                      <span
                        title="In review"
                        className="rounded bg-brand-50 px-1.5 py-0.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      >
                        {r.inReview}
                      </span>
                      <span
                        title="Draft"
                        className="rounded bg-warning-50 px-1.5 py-0.5 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
                      >
                        {r.draft}
                      </span>
                      <span
                        title="Not started"
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {r.notStarted}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-300">
                      {Icon.chev}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 border-t border-gray-200 px-6 py-3 text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ background: '#12b76a' }}
          />
          Completed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ background: '#465fff' }}
          />
          In review
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ background: '#fdb022' }}
          />
          Draft
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-sm"
            style={{ background: '#e5e7eb' }}
          />
          Not started
        </span>
      </div>
    </div>
  );
}

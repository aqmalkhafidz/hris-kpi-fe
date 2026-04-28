import { Avatar } from '@shared/layouts/avatar';
import type { HrDashboardRecentSubmission } from '../hooks/use-hr-dashboard';

export function RecentSubmissions({
  items,
}: {
  items: HrDashboardRecentSubmission[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900 dark:text-white">
          Recent submissions
        </p>
        <button className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300">
          Full feed
        </button>
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
                  <span className="font-normal text-gray-500 dark:text-gray-400">
                    moved to
                  </span>{' '}
                  {s.to}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {s.team}
                </p>
              </div>
              <span className="text-[11px] tabular-nums text-gray-400 dark:text-gray-500">
                {s.when}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

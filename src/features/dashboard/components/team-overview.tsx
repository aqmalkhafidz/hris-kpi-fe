import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { useNavigate } from '@tanstack/react-router';
import { STATUS_BADGE, reviewRoutes } from '../constants';
import { getStatusLabel, roleLabel } from '../utils';

export type ReviewItem = {
  id: number;
  cycleName: string;
  userId: number;
  status: string;
  reviewRole: 'sl' | 'hod' | 'hodiv';
};

export function TeamOverview({
  role,
  items,
}: {
  role: string;
  items: ReviewItem[];
}) {
  const navigate = useNavigate();

  const pending = items.filter(
    (r) =>
      (role === 'sl' && r.status === 'sl_review') ||
      (role === 'hodept' && r.status === 'hod_review') ||
      (role === 'hodiv' && r.status === 'hodiv_review')
  );
  const inReview = items.filter((r) =>
    ['sl_review', 'hod_review', 'hodiv_review'].includes(r.status)
  );
  const done = items.filter((r) =>
    ['completed', 'acknowledge'].includes(r.status)
  );

  const stats = [
    { label: 'Total team', val: items.length, color: '#94a3b8' },
    { label: 'In review', val: inReview.length, color: '#465fff' },
    { label: 'Pending my OK', val: pending.length, color: '#f97316' },
    { label: 'Completed', val: done.length, color: '#12b76a' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Team overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {roleLabel(role)} · Q1 2026 Appraisal
          </p>
        </div>
        {pending.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
            {pending.length} pending your review
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full"
                style={{
                  width: items.length
                    ? `${(s.val / items.length) * 100}%`
                    : '0%',
                  background: s.color,
                }}
              />
            </div>
            <p className="mt-3 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
              {s.val}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Review queue
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Action required as {roleLabel(role)}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              pending.length
                ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {pending.length} pending
          </span>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No appraisals in your queue.
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Submitted appraisals will appear here.
            </p>
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
                {items.map((r) => {
                  const needsAction =
                    (r.reviewRole === 'sl' && r.status === 'sl_review') ||
                    (r.reviewRole === 'hod' && r.status === 'hod_review') ||
                    (r.reviewRole === 'hodiv' && r.status === 'hodiv_review');
                  return (
                    <tr
                      key={`${r.id}-${r.reviewRole}`}
                      className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={`U${r.userId}`}
                            tone="brand"
                            size="sm"
                          />
                          <p className="font-semibold text-gray-800 dark:text-white/90">
                            {r.userId}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                        {r.cycleName}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[r.status] ?? ''}`}
                        >
                          {getStatusLabel(r.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {needsAction ? (
                          <button
                            onClick={() =>
                              navigate({
                                to: reviewRoutes[r.reviewRole],
                                params: { appraisalId: String(r.id) },
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                          >
                            Review {Icon.chev}
                          </button>
                        ) : (
                          <button className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

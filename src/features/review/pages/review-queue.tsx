import { useAuth } from '@features/auth/context/auth-context';
import { STATUS_BADGE, reviewRoutes } from '@features/dashboard/constants';
import { getStatusLabel, roleLabel } from '@features/dashboard/utils';
import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { EmptyState } from '@shared/ui/empty-state';
import { PageHeader } from '@shared/ui/page-header';
import { useNavigate } from '@tanstack/react-router';
import { useReviewQueue } from '../hooks/use-reviews';

type ReviewerRole = 'sl' | 'hod' | 'hodiv';
const PENDING_STATUS: Record<ReviewerRole, string> = {
  sl: 'sl_review',
  hod: 'hod_review',
  hodiv: 'hodiv_review',
};

function reviewerRoleFor(role: string | undefined): ReviewerRole | null {
  if (role === 'sl') return 'sl';
  if (role === 'hodept') return 'hod';
  if (role === 'hodiv') return 'hodiv';
  return null;
}

export function ReviewQueuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const reviewerRole = reviewerRoleFor(user?.role);
  const { data: queue = [], isLoading } = useReviewQueue(
    reviewerRole ? user?.id : null,
    reviewerRole ?? 'sl'
  );

  if (!reviewerRole || !user) {
    return (
      <PageShell breadcrumb="Reviews">
        <EmptyState title="You don't have a review queue." />
      </PageShell>
    );
  }

  const pendingStatus = PENDING_STATUS[reviewerRole];
  const pending = queue.filter((a) => a.status === pendingStatus);
  const waiting = queue.filter((a) => a.status !== pendingStatus);

  return (
    <PageShell breadcrumb="Reviews">
      <PageHeader
        category="Team Reviews"
        title="Reviews"
        description={`${roleLabel(user.role)} · pick a member appraisal to review`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total in queue" value={queue.length} tone="neutral" />
        <StatCard
          label="Pending your review"
          value={pending.length}
          tone="warning"
        />
        <StatCard
          label="Awaiting other reviewer"
          value={waiting.length}
          tone="info"
        />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.02]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Pending your review
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click a member to open the review form
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
        </header>

        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            Loading queue...
          </div>
        ) : pending.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nothing waiting on you right now.
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              New submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Cycle</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pending.map((a) => (
                  <tr
                    key={a.id}
                    className="cursor-pointer hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                    onClick={() =>
                      navigate({
                        to: reviewRoutes[reviewerRole],
                        params: { appraisalId: String(a.id) },
                      })
                    }
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={a.owner.initials}
                          tone="brand"
                          size="sm"
                        />
                        <p className="font-semibold text-gray-800 dark:text-white/90">
                          {a.owner.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {a.cycleName}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[a.status] ?? ''}`}
                      >
                        {getStatusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate({
                            to: reviewRoutes[reviewerRole],
                            params: { appraisalId: String(a.id) },
                          });
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                      >
                        Review {Icon.chev}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {waiting.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.02]">
          <header className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Awaiting other reviewers
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You've handed these off; tracking until cycle closes
            </p>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Cycle</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {waiting.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={a.owner.initials}
                          tone="gray"
                          size="sm"
                        />
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          {a.owner.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {a.cycleName}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[a.status] ?? ''}`}
                      >
                        {getStatusLabel(a.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'neutral' | 'warning' | 'info';
}) {
  const toneClass =
    tone === 'warning'
      ? 'text-warning-600 dark:text-warning-400'
      : tone === 'info'
        ? 'text-blue-600 dark:text-blue-300'
        : 'text-gray-700 dark:text-gray-200';
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

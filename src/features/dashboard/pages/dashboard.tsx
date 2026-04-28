import { useMyAppraisals } from '@features/appraisal/hooks/use-appraisal';
import { useAuth } from '@features/auth/context/auth-context';
import { useReviewQueue } from '@features/review/hooks/use-reviews';
import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ApprovalFlow } from '../components/approval-flow';
import { KRARow } from '../components/kra-row';
import { PerfChart } from '../components/perf-chart';
import { TeamOverview, type ReviewItem } from '../components/team-overview';
import { STATUS_BADGE, STATUS_FLOW } from '../constants';
import { useMyActivity, usePerfHistory } from '../hooks/use-my-dashboard';
import { getStatusLabel, weightedScore } from '../utils';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: appraisals, isLoading } = useMyAppraisals(user?.id ?? 0);
  const { data: slQueue } = useReviewQueue(user?.id, 'sl');
  const { data: hodQueue } = useReviewQueue(user?.id, 'hod');
  const { data: hodivQueue } = useReviewQueue(user?.id, 'hodiv');
  const { data: perfHistory } = usePerfHistory(user?.id);
  const { data: activities = [] } = useMyActivity(user?.id);

  const [expandedKra, setExpandedKra] = useState<number | null>(null);

  const appraisal = appraisals?.[0];
  const canReview =
    user?.role === 'sl' || user?.role === 'hodept' || user?.role === 'hodiv';
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const status = appraisal?.status ?? 'draft';

  const weighted = appraisal ? weightedScore(appraisal) : 0;
  const evidenceCount =
    appraisal?.kras.reduce((s, k) => s + k.evidence.length, 0) ?? 0;

  const allTeamItems: ReviewItem[] = [
    ...(slQueue ?? []).map((i) => ({ ...i, reviewRole: 'sl' as const })),
    ...(hodQueue ?? []).map((i) => ({ ...i, reviewRole: 'hod' as const })),
    ...(hodivQueue ?? []).map((i) => ({ ...i, reviewRole: 'hodiv' as const })),
  ];

  return (
    <PageShell breadcrumb="My Appraisals">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>Home</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="font-medium text-gray-800 dark:text-white/90">
              My Appraisals
            </span>
          </nav>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            Hello, {firstName}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {user?.position ?? ''}
            {user?.squad ? ` · ${user.squad}` : ''}
            {user?.dept ? ` · ${user.dept}` : ''}
            <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
            Q1 2026 runs{' '}
            <strong className="text-gray-700 dark:text-gray-300">
              Jan 1
            </strong>{' '}
            –{' '}
            <strong className="text-gray-700 dark:text-gray-300">
              Mar 31, 2026
            </strong>
          </p>
        </div>
        <Link
          to="/self-appraisal"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
        >
          {Icon.doc}
          <span>Open self-appraisal</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm text-gray-400">Loading appraisal…</p>
        </div>
      ) : !appraisal ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            No active appraisal cycle found.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            HR has not opened a cycle for this account yet.
          </p>
        </div>
      ) : (
        <>
          {status === 'draft' && (
            <div className="rounded-2xl border border-warning-200 bg-warning-50 px-5 py-4 dark:border-warning-800/50 dark:bg-warning-500/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-500 text-white">
                    {Icon.warn}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-warning-800 dark:text-warning-300">
                      Action required · Submit self-appraisal before Mar 31,
                      2026
                    </h3>
                    <p className="mt-1 text-sm text-warning-700 dark:text-warning-400">
                      {appraisal.kras.filter((k) => k.self_score === 0).length >
                      0
                        ? `${appraisal.kras.filter((k) => k.self_score === 0).length} of ${appraisal.kras.length} KRAs still need a self-score.`
                        : 'All KRAs scored — review your reflection and submit final.'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/self-appraisal"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-warning-300 bg-white px-4 py-2.5 text-sm font-semibold text-warning-700 hover:bg-warning-100 dark:border-warning-800/60 dark:bg-warning-500/5 dark:text-warning-300"
                >
                  Continue self-appraisal {Icon.chev}
                </Link>
              </div>
            </div>
          )}

          {(status === 'sl_review' ||
            status === 'hod_review' ||
            status === 'hodiv_review') && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800/50 dark:bg-blue-500/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
                    {Icon.doc}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                      Submitted · in review with{' '}
                      {STATUS_FLOW.find((s) => s.key === status)?.actor}
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      You'll be notified when the next reviewer takes action.
                    </p>
                  </div>
                </div>
                <Link
                  to="/self-appraisal"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-500/5 dark:text-blue-300"
                >
                  View submission
                </Link>
              </div>
            </div>
          )}

          {status === 'acknowledge' && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800/50 dark:bg-blue-500/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
                    {Icon.check}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                      Final scores ready · Acknowledge to close the cycle
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      HoDiv has signed off. Review final scores and acknowledge.
                    </p>
                  </div>
                </div>
                <Link
                  to="/acknowledge/$appraisalId"
                  params={{ appraisalId: String(appraisal.id) }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Review &amp; acknowledge {Icon.chev}
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(
              [
                {
                  icon: Icon.bar,
                  tone: 'brand',
                  label: 'Self score (live)',
                  value: weighted > 0 ? weighted.toFixed(1) : '—',
                  sub: '/100',
                  foot: `${appraisal.kras.filter((k) => k.self_score > 0).length}/${appraisal.kras.length} KRAs scored`,
                },
                {
                  icon: Icon.doc,
                  tone:
                    status === 'completed'
                      ? 'success'
                      : status === 'draft'
                        ? 'warning'
                        : 'info',
                  label: 'Appraisal status',
                  value: getStatusLabel(status),
                  sub: '',
                  foot: `With ${STATUS_FLOW.find((s) => s.key === status)?.actor ?? ''}`,
                },
                {
                  icon: Icon.paper,
                  tone: 'success',
                  label: 'Evidence attached',
                  value: evidenceCount,
                  sub: 'items',
                  foot: 'Across all KRAs',
                },
                {
                  icon: Icon.clock,
                  tone: 'info',
                  label: 'Days to cycle end',
                  value: '4',
                  sub: 'days',
                  foot: 'Mar 31, 2026 · submission window',
                },
              ] as const
            ).map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    s.tone === 'brand'
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                      : s.tone === 'success'
                        ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                        : s.tone === 'warning'
                          ? 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300'
                  }`}
                >
                  {s.icon}
                </div>
                <div className="mt-5">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {s.label}
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white/90">
                      {s.value}
                    </span>
                    {s.sub && (
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        {s.sub}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {s.foot}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Performance history
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Self vs reviewer-final vs HR-calibrated, last 4 quarters.
              </p>
              <div className="mt-4 min-h-[260px] flex-1">
                {perfHistory && perfHistory.quarters.length > 0 ? (
                  <PerfChart data={perfHistory} />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-gray-400">
                    Belum ada riwayat appraisal completed.
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Approval flow
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Q1 2026 routing.
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status] ?? ''}`}
                >
                  {getStatusLabel(status)}
                </span>
              </div>
              <ApprovalFlow status={status} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  My KRAs · Q1 2026
                </h3>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  From template snapshot · weight total{' '}
                  {appraisal.kras.reduce((s, k) => s + k.weight, 0)}%
                </p>
              </div>
              <Link
                to="/self-appraisal"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                {Icon.doc}{' '}
                {status === 'draft'
                  ? 'Continue self-appraisal'
                  : 'View submission'}
              </Link>
            </div>
            {appraisal.kras.map((kra) => (
              <KRARow
                key={kra.id}
                kra={kra}
                expanded={expandedKra === kra.id}
                onToggle={() =>
                  setExpandedKra(expandedKra === kra.id ? null : kra.id)
                }
              />
            ))}
          </div>

          {canReview && <TeamOverview role={user!.role} items={allTeamItems} />}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Recent activity
                </h3>
                <button className="text-sm font-semibold text-brand-600 dark:text-brand-300">
                  View all
                </button>
              </div>
              {activities.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
                  Belum ada aktivitas.
                </p>
              ) : (
                <ol className="mt-4 space-y-4">
                  {activities.map((a, i) => (
                    <li key={i} className="flex gap-3">
                      <Avatar initials={a.avatar} tone={a.tone} size="md" />
                      <div className="min-w-0 flex-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-gray-800 dark:text-white/90">
                            {a.who}
                          </span>{' '}
                          {a.what}{' '}
                          <span className="font-medium text-brand-600 dark:text-brand-300">
                            {a.target}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {a.when}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Cycle summary
              </h3>
              <dl className="mt-4 space-y-3.5">
                {(
                  [
                    ['Cycle', appraisal.cycleName],
                    ['Period', 'Jan 1 – Mar 31, 2026'],
                    ['Status', getStatusLabel(status)],
                    ['SL', appraisal.reviewers.sl.name],
                    ['HoD', appraisal.reviewers.hod.name],
                    ['HoDiv', appraisal.reviewers.hodiv.name],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 pb-3.5 last:border-0 last:pb-0 dark:border-gray-800"
                  >
                    <dt className="text-sm text-gray-500 dark:text-gray-400">
                      {k}
                    </dt>
                    <dd className="text-right text-sm font-semibold text-gray-800 dark:text-white/90">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/self-appraisal"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                {status === 'draft'
                  ? 'Continue self-appraisal'
                  : 'Open appraisal'}
              </Link>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}

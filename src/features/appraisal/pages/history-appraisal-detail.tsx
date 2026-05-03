import { useAppraisalById } from '@features/appraisal/hooks/use-appraisal';
import { useAuth } from '@features/auth/context/auth-context';
import { AuditTimeline } from '@shared/domain/audit-timeline';
import { ScoreComparison } from '@shared/domain/score-comparison';
import { Avatar } from '@shared/layouts/avatar';
import { PageShell } from '@shared/layouts/page-shell';
import { Badge } from '@shared/ui/badge';
import { EmptyState } from '@shared/ui/empty-state';
import { PageHeader } from '@shared/ui/page-header';
import { SectionCard } from '@shared/ui/section-card';
import { StatusBadge } from '@shared/ui/status-badge';
import { Link, useParams } from '@tanstack/react-router';

function formatDate(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function weightedAvg(kras: { weight: number; self_score: number }[]): number {
  const total = kras.reduce((s, k) => s + k.weight, 0) || 1;
  return kras.reduce((s, k) => s + k.self_score * k.weight, 0) / total;
}

export function HistoryAppraisalDetailPage() {
  const { appraisalId } = useParams({ strict: false }) as {
    appraisalId: string;
  };
  const id = Number(appraisalId);
  const { data: appraisal, isLoading, isError } = useAppraisalById(id);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <PageShell breadcrumb="Appraisal Detail">
        <EmptyState title="Loading appraisal..." />
      </PageShell>
    );
  }

  if (isError || !appraisal) {
    return (
      <PageShell breadcrumb="Appraisal Detail">
        <EmptyState
          title="Appraisal not found"
          description="Check your access or go back to history."
        />
      </PageShell>
    );
  }

  const showOwner = user?.role !== 'staff';
  const isCalibratedByHodiv = appraisal.kras.some((k) => k.hodiv_score != null);
  const selfAvg = weightedAvg(appraisal.kras);

  const periodLabel = [
    formatDate(appraisal.cycleStartDate),
    formatDate(appraisal.cycleEndDate),
  ]
    .filter(Boolean)
    .join(' – ');

  return (
    <PageShell breadcrumb="Appraisal Detail">
      <Link
        to="/history-appraisal"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Appraisal History
      </Link>

      <PageHeader
        category={
          showOwner
            ? `${appraisal.owner.name} · ${appraisal.cycleShort}`
            : appraisal.cycleShort
        }
        title={appraisal.cycleName}
        description={periodLabel || undefined}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="brand">Self avg {selfAvg.toFixed(2)}/5</Badge>
            <StatusBadge status={appraisal.status} size="md" />
          </div>
        }
      />

      {/* Reviewer summary strip */}
      <div className="flex flex-wrap gap-3">
        {(
          [
            { label: 'SL', r: appraisal.reviewers?.sl },
            { label: 'HoD', r: appraisal.reviewers?.hod },
            { label: 'HoDiv', r: appraisal.reviewers?.hodiv },
          ] as const
        )
          .filter((x) => x.r?.name)
          .map(({ label, r }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <Avatar initials={r.initials} size="sm" tone="brand" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                  {r.name}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Self appraisal */}
      <SectionCard
        title="Self Appraisal"
        description={`${appraisal.kras.length} KRA${appraisal.kras.length === 1 ? '' : 's'} · avg ${selfAvg.toFixed(2)}/5`}
      >
        <div className="space-y-4">
          {appraisal.kras.map((kra) => (
            <div
              key={kra.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {kra.title}
                  </p>
                  {kra.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {kra.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone="gray">Weight {kra.weight}%</Badge>
                  <Badge tone="brand">{kra.self_score}/5</Badge>
                </div>
              </div>
              {kra.self_comment && (
                <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
                  {kra.self_comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Reflection */}
      {appraisal.reflection && (
        <SectionCard title="Reflection">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {appraisal.reflection}
          </p>
        </SectionCard>
      )}

      {/* Review scores — only when HoDiv has calibrated */}
      {isCalibratedByHodiv && (
        <SectionCard
          title="Review Scores"
          description="SL → HoD → HoDiv calibration per KRA"
        >
          <div className="space-y-5">
            {appraisal.kras.map((kra) => {
              const hasComments =
                kra.sl_comment || kra.hod_comment || kra.hodiv_comment;
              return (
                <div key={kra.id}>
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {kra.title}
                    </p>
                    <span className="shrink-0 text-xs text-gray-400">
                      Weight {kra.weight}%
                    </span>
                  </div>
                  <ScoreComparison
                    kra={kra}
                    roles={['self', 'sl', 'hod', 'hodiv']}
                  />
                  {hasComments && (
                    <div className="mt-3 space-y-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-white/[0.03]">
                      {kra.sl_comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            SL:
                          </span>{' '}
                          {kra.sl_comment}
                        </p>
                      )}
                      {kra.hod_comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            HoD:
                          </span>{' '}
                          {kra.hod_comment}
                        </p>
                      )}
                      {kra.hodiv_comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            HoDiv:
                          </span>{' '}
                          {kra.hodiv_comment}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* Audit trail */}
      <SectionCard
        title="Activity"
        description="Full audit trail for this appraisal"
      >
        <AuditTimeline entries={appraisal.audit_log} />
      </SectionCard>
    </PageShell>
  );
}

import {
  useAdvanceAppraisal,
  useAppraisalById,
  useReturnAppraisal,
  useSubmitAppraisal,
} from '@features/appraisal/hooks/use-appraisal';
import { useAuth } from '@features/auth/context/auth-context';
import { AuditTimeline } from '@shared/domain/audit-timeline';
import { EvidenceList } from '@shared/domain/evidence-list';
import { ScorePicker } from '@shared/domain/score-picker';
import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import type { AppraisalStatus, Kra } from '@shared/lib/types/appraisal';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { EmptyState } from '@shared/ui/empty-state';
import { FormField, Textarea } from '@shared/ui/form-field';
import { PageHeader } from '@shared/ui/page-header';
import { SectionCard } from '@shared/ui/section-card';
import { StatusBadge } from '@shared/ui/status-badge';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { ReturnModal } from '../components/return-modal';

const SCORE_LABELS: Record<number, string> = {
  1: 'Far Below',
  2: 'Below',
  3: 'Meet',
  4: 'Exceed',
  5: 'Far Exceed',
};

type ReviewStage = 'sl' | 'hod' | 'hodiv';
type ComparisonRole = 'self' | 'sl' | 'hod' | 'hodiv';

interface StageConfig {
  scoreField: 'sl_score' | 'hod_score' | 'hodiv_score';
  commentField: 'sl_comment' | 'hod_comment' | 'hodiv_comment';
  statusGate: AppraisalStatus;
  breadcrumb: string;
  pageHeader: { category: string; title: string; tail: string };
  reviewerLabel: string;
  commentPlaceholder: string;
  returnTargetLabel: string;
  submitLabel: { idle: string; busy: string };
  finalNote?: string;
}

const STAGE_CONFIG: Record<ReviewStage, StageConfig> = {
  sl: {
    scoreField: 'sl_score',
    commentField: 'sl_comment',
    statusGate: 'sl_review',
    breadcrumb: 'SL Review',
    pageHeader: {
      category: 'Team Reviews',
      title: 'Squad Leader Review',
      tail: 'review each KRA before routing to HoD',
    },
    reviewerLabel: 'Your SL score',
    commentPlaceholder:
      'Add context for HoD: validation notes, delivery quality, blockers, or coaching feedback.',
    returnTargetLabel: 'Employee',
    submitLabel: { idle: 'Approve to HoD', busy: 'Submitting...' },
  },
  hod: {
    scoreField: 'hod_score',
    commentField: 'hod_comment',
    statusGate: 'hod_review',
    breadcrumb: 'HoD Review',
    pageHeader: {
      category: 'Department Calibration',
      title: 'Head of Department Review',
      tail: 'calibrate against department distribution before routing to HoDiv',
    },
    reviewerLabel: 'Your HoD score',
    commentPlaceholder:
      'Calibration notes for HoDiv: alignment with peers, outlier rationale, coaching themes.',
    returnTargetLabel: 'SL',
    submitLabel: { idle: 'Approve to HoDiv', busy: 'Submitting...' },
  },
  hodiv: {
    scoreField: 'hodiv_score',
    commentField: 'hodiv_comment',
    statusGate: 'hodiv_review',
    breadcrumb: 'HoDiv Review',
    pageHeader: {
      category: 'Division Sign-off',
      title: 'Head of Division Review',
      tail: 'final calibration before employee acknowledgement',
    },
    reviewerLabel: 'Your HoDiv score',
    commentPlaceholder:
      'Final sign-off rationale or division-level calibration notes for the employee.',
    returnTargetLabel: 'HoD',
    submitLabel: {
      idle: 'Finalise & route to employee',
      busy: 'Finalising...',
    },
    finalNote:
      'Finalising will route this appraisal to the employee for acknowledgement.',
  },
};

const ROLE_LABEL: Record<ComparisonRole, string> = {
  self: 'Staff',
  sl: 'SL',
  hod: 'HoD',
  hodiv: 'HoDiv',
};

const SCORE_FIELD_BY_ROLE: Record<ComparisonRole, keyof Kra> = {
  self: 'self_score',
  sl: 'sl_score',
  hod: 'hod_score',
  hodiv: 'hodiv_score',
};

const COMMENT_FIELD_BY_ROLE: Record<ComparisonRole, keyof Kra> = {
  self: 'self_comment',
  sl: 'sl_comment',
  hod: 'hod_comment',
  hodiv: 'hodiv_comment',
};

const ROLE_FLOW: ComparisonRole[] = ['self', 'sl', 'hod', 'hodiv'];

const ACTIVE_ROLE_BY_STAGE: Record<ReviewStage, ComparisonRole> = {
  sl: 'sl',
  hod: 'hod',
  hodiv: 'hodiv',
};

interface ReviewDraft {
  score: number;
  comment: string;
}

export function ReviewPage({ stage }: { stage: ReviewStage }) {
  const config = STAGE_CONFIG[stage];
  const { appraisalId } = useParams({ strict: false }) as {
    appraisalId: string;
  };
  const numericAppraisalId = Number(appraisalId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: appraisal, isLoading } = useAppraisalById(numericAppraisalId);
  const submitMut = useSubmitAppraisal();
  const advanceMut = useAdvanceAppraisal();
  const returnMut = useReturnAppraisal();

  const [activeKraId, setActiveKraId] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, ReviewDraft>>({});
  const [submitting, setSubmitting] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const draftKras = useMemo(() => {
    if (!appraisal) return [];
    return appraisal.kras.map((kra) => ({
      ...kra,
      [config.scoreField]:
        scores[kra.id]?.score ?? (kra[config.scoreField] as number | undefined),
      [config.commentField]:
        scores[kra.id]?.comment ??
        (kra[config.commentField] as string | undefined) ??
        '',
    }));
  }, [appraisal, scores, config.scoreField, config.commentField]);

  const active =
    draftKras.find((kra) => kra.id === (activeKraId ?? draftKras[0]?.id)) ??
    draftKras[0];
  const activeRole = ACTIVE_ROLE_BY_STAGE[stage];
  const activeRoleIndex = ROLE_FLOW.findIndex((role) => role === activeRole);
  const contextRoles = ROLE_FLOW.filter(
    (role, index) => index < activeRoleIndex
  );
  const canSubmit = appraisal?.status === config.statusGate;
  const completed = draftKras.filter(
    (kra) => ((kra[config.scoreField] as number | undefined) ?? 0) > 0
  );
  const allScored =
    draftKras.length > 0 && completed.length === draftKras.length;

  const patchScore = (kra: Kra, patch: Partial<ReviewDraft>) => {
    setScores((prev) => ({
      ...prev,
      [kra.id]: {
        score:
          prev[kra.id]?.score ??
          (kra[config.scoreField] as number | undefined) ??
          0,
        comment:
          prev[kra.id]?.comment ??
          (kra[config.commentField] as string | undefined) ??
          '',
        ...patch,
      },
    }));
  };

  const submitReview = async () => {
    if (!appraisal || !user) return;
    setSubmitting(true);
    await submitMut.mutateAsync({
      appraisalId: appraisal.id,
      updates: { kras: draftKras },
      showSuccessToast: false,
    });
    await advanceMut.mutateAsync({ appraisalId: appraisal.id });
    setSubmitting(false);
    navigate({ to: '/reviews' });
  };

  const goPrev = () => {
    if (!active) return;
    const idx = draftKras.findIndex((kra) => kra.id === active.id);
    if (idx > 0) setActiveKraId(draftKras[idx - 1].id);
  };

  const goNext = () => {
    if (!active) return;
    const idx = draftKras.findIndex((kra) => kra.id === active.id);
    if (idx < draftKras.length - 1) setActiveKraId(draftKras[idx + 1].id);
  };

  const activeIndex = active
    ? draftKras.findIndex((kra) => kra.id === active.id)
    : -1;
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= draftKras.length - 1;

  const confirmReturn = async (reason: string) => {
    if (!appraisal || !user) return;
    setSubmitting(true);
    if (Object.keys(scores).length > 0) {
      await submitMut.mutateAsync({
        appraisalId: appraisal.id,
        updates: { kras: draftKras },
        showSuccessToast: false,
      });
    }
    await returnMut.mutateAsync({ appraisalId: appraisal.id, reason });
    setSubmitting(false);
    setReturnOpen(false);
    navigate({ to: '/reviews' });
  };

  if (isLoading) {
    return (
      <PageShell breadcrumb={config.breadcrumb}>
        <EmptyState title="Loading review queue..." />
      </PageShell>
    );
  }

  if (!appraisal) {
    return (
      <PageShell breadcrumb={config.breadcrumb}>
        <EmptyState title="Appraisal not found." />
      </PageShell>
    );
  }

  const activeScore = active
    ? ((active[config.scoreField] as number | undefined) ?? 0)
    : 0;
  const activeComment = active
    ? ((active[config.commentField] as string | undefined) ?? '')
    : '';
  const evidenceCount = active?.evidence.length ?? 0;

  return (
    <PageShell breadcrumb={config.breadcrumb}>
      <PageHeader
        category={config.pageHeader.category}
        title={config.pageHeader.title}
        description={`${appraisal.cycleName} · ${appraisal.owner.name} (${appraisal.owner.initials}) · ${config.pageHeader.tail}`}
        actions={<StatusBadge status={appraisal.status} size="md" />}
      />

      {stage === 'hodiv' && canSubmit && config.finalNote && (
        <section className="rounded-2xl border border-success-100 bg-success-50 px-5 py-4 text-sm text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-300">
          {config.finalNote}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
          <SectionCard>
            <div className="mb-4 flex items-center gap-3">
              <Avatar
                initials={appraisal.owner.initials}
                size="lg"
                tone="brand"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {appraisal.owner.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Staff member
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Review progress</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {completed.length}/{draftKras.length} KRAs
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100/80 ring-1 ring-brand-200/70 dark:bg-brand-500/20 dark:ring-brand-400/20">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{
                    width: `${(completed.length / Math.max(draftKras.length, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="KRA review list">
            <div className="space-y-1.5">
              {draftKras.map((kra, index) => {
                const selected = active?.id === kra.id;
                const score =
                  (kra[config.scoreField] as number | undefined) ?? 0;
                const done = score > 0;
                return (
                  <button
                    key={kra.id}
                    type="button"
                    onClick={() => setActiveKraId(kra.id)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                      selected
                        ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300'
                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done ? 'bg-success-500 text-white' : 'border border-dashed border-gray-300 text-gray-400 dark:border-gray-700'}`}
                    >
                      {done ? Icon.check : index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {kra.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                        Self {kra.self_score}/5 · Weight {kra.weight}%
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Submit checklist">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${allScored ? 'bg-success-500 text-white' : 'border border-gray-300 text-transparent dark:border-gray-700'}`}
                >
                  {Icon.check}
                </span>
                <span
                  className={
                    allScored
                      ? 'text-gray-700 dark:text-gray-200'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  All KRAs scored
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${canSubmit ? 'bg-success-500 text-white' : 'border border-gray-300 text-transparent dark:border-gray-700'}`}
                >
                  {Icon.check}
                </span>
                <span
                  className={
                    canSubmit
                      ? 'text-gray-700 dark:text-gray-200'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  Status is {config.breadcrumb}
                </span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="History">
            <AuditTimeline entries={appraisal.audit_log} compact maxItems={4} />
          </SectionCard>
        </aside>

        <section className="space-y-6 lg:col-span-8 xl:col-span-9">
          {active ? (
            <SectionCard
              title={active.title}
              description={`Target: ${active.target} · Weight ${active.weight}%`}
              action={
                <Badge tone="neutral">
                  KRA {draftKras.findIndex((kra) => kra.id === active.id) + 1}
                </Badge>
              }
            >
              <div className="space-y-6">
                {!canSubmit && (
                  <div className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
                    This appraisal is currently{' '}
                    <strong>{appraisal.status.replace(/_/g, ' ')}</strong>;
                    scoring is locked.
                  </div>
                )}

                <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Prior reviewer input
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Full score &amp; comment from earlier stages — read
                        before scoring.
                      </p>
                    </div>
                    <Badge tone="neutral">
                      {contextRoles.length} reviewer
                      {contextRoles.length === 1 ? '' : 's'}
                    </Badge>
                  </div>

                  <div
                    className={`grid gap-3 ${contextRoles.length > 1 ? 'md:grid-cols-2' : ''}`}
                  >
                    {contextRoles.length > 0 ? (
                      contextRoles.map((role) => {
                        const score =
                          (active[SCORE_FIELD_BY_ROLE[role]] as
                            | number
                            | undefined) ?? 0;
                        const comment = (
                          (active[COMMENT_FIELD_BY_ROLE[role]] as
                            | string
                            | undefined) ?? ''
                        ).trim();
                        const reviewer =
                          role === 'self'
                            ? appraisal.owner
                            : appraisal.reviewers[
                                role as 'sl' | 'hod' | 'hodiv'
                              ];

                        return (
                          <article
                            key={role}
                            className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.02]"
                          >
                            <header className="mb-3 flex items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
                              <div className="flex items-center gap-2">
                                <span
                                  title={reviewer.name}
                                  className="flex h-7 w-7 cursor-default items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                                >
                                  {reviewer.initials}
                                </span>
                                {score > 0 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {SCORE_LABELS[score]}
                                  </span>
                                )}
                              </div>
                              {score > 0 ? (
                                <span className="text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-white">
                                  {score}
                                </span>
                              ) : (
                                <span className="text-xs italic text-gray-400">
                                  No score
                                </span>
                              )}
                            </header>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-200">
                              {comment || (
                                <span className="italic text-gray-400">
                                  No comment was provided at this stage.
                                </span>
                              )}
                            </p>
                          </article>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
                        This review starts the trail. No earlier reviewer
                        context is available yet.
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Evidence and scope
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Keep the decision aligned with the target and proof
                        submitted.
                      </p>
                    </div>
                    <Badge tone="neutral">
                      {evidenceCount} evidence item
                      {evidenceCount === 1 ? '' : 's'}
                    </Badge>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.04]">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                        Target
                      </p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">
                        {active.target}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.04]">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                          Weight
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                          {active.weight}%
                        </p>
                      </div>
                      <div className="flex-1 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.04]">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                          Current stage
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                          {ROLE_LABEL[activeRole]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <EvidenceList items={active.evidence} />
                </section>

                <section className="rounded-2xl border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {config.reviewerLabel}
                    </p>
                    <Badge tone={activeScore ? 'brand' : 'neutral'}>
                      {activeScore
                        ? `${activeScore} · ${SCORE_LABELS[activeScore]}`
                        : 'Choose a score'}
                    </Badge>
                  </div>
                  <ScorePicker
                    value={activeScore}
                    disabled={!canSubmit}
                    onChange={(score) => patchScore(active, { score })}
                  />
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Decision note
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Capture the reasoning that the next reviewer or employee
                      should understand.
                    </p>
                  </div>
                  <FormField label="Reviewer comment">
                    <Textarea
                      rows={5}
                      disabled={!canSubmit}
                      value={activeComment}
                      onChange={(event) =>
                        patchScore(active, { comment: event.target.value })
                      }
                      placeholder={config.commentPlaceholder}
                    />
                  </FormField>
                </section>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isFirst}
                      onClick={goPrev}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isLast}
                      onClick={goNext}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!canSubmit || submitting}
                      onClick={() => setReturnOpen(true)}
                    >
                      Return to {config.returnTargetLabel}
                    </Button>
                    <Button
                      type="button"
                      onClick={submitReview}
                      disabled={!canSubmit || !allScored || submitting}
                      icon={Icon.send}
                    >
                      {submitting
                        ? config.submitLabel.busy
                        : config.submitLabel.idle}
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : (
            <EmptyState title="No KRA selected." />
          )}
        </section>
      </div>

      <ReturnModal
        open={returnOpen}
        targetStageLabel={config.returnTargetLabel}
        submitting={submitting}
        onClose={() => setReturnOpen(false)}
        onConfirm={confirmReturn}
      />
    </PageShell>
  );
}

export function SlReviewPage() {
  return <ReviewPage stage="sl" />;
}

export function HodReviewPage() {
  return <ReviewPage stage="hod" />;
}

export function HodivReviewPage() {
  return <ReviewPage stage="hodiv" />;
}

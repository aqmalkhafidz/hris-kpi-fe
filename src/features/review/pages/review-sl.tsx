import { useMemo, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  useAdvanceAppraisal,
  useAppraisalById,
  useReturnAppraisal,
  useSubmitAppraisal,
} from '@features/appraisal/hooks/use-appraisal'
import { useAuth } from '@features/auth/context/auth-context'
import { Avatar } from '@shared/layouts/avatar'
import { Badge } from '@shared/ui/badge'
import { Icon } from '@shared/layouts/icon'
import { PageShell } from '@shared/layouts/page-shell'
import { Button } from '@shared/ui/button'
import { EmptyState } from '@shared/ui/empty-state'
import { EvidenceList } from '@shared/domain/evidence-list'
import { FormField, Textarea } from '@shared/ui/form-field'
import { PageHeader } from '@shared/ui/page-header'
import { ScoreDot } from '@shared/ui/score-dot'
import { ScorePicker } from '@shared/domain/score-picker'
import { SectionCard } from '@shared/ui/section-card'
import { StatusBadge } from '@shared/ui/status-badge'
import { AuditTimeline } from '@shared/domain/audit-timeline'
import { ReturnModal } from '../components/return-modal'
import type { Kra } from '@shared/lib/types/appraisal'

const SCORE_LABELS: Record<number, string> = {
  1: 'Far Below',
  2: 'Below',
  3: 'Meet',
  4: 'Exceed',
  5: 'Far Exceed',
}

interface ReviewDraft {
  score: number
  comment: string
}

export function SlReviewPage() {
  const { appraisalId } = useParams({ strict: false }) as { appraisalId: string }
  const numericAppraisalId = Number(appraisalId)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: appraisal, isLoading } = useAppraisalById(numericAppraisalId)
  const submitMut = useSubmitAppraisal()
  const advanceMut = useAdvanceAppraisal()
  const returnMut = useReturnAppraisal()
  const [activeKraId, setActiveKraId] = useState<number | null>(null)
  const [scores, setScores] = useState<Record<string, ReviewDraft>>({})
  const [submitting, setSubmitting] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)

  const draftKras = useMemo(() => {
    if (!appraisal) return []
    return appraisal.kras.map(kra => ({
      ...kra,
      sl_score: scores[kra.id]?.score ?? kra.sl_score,
      sl_comment: scores[kra.id]?.comment ?? kra.sl_comment ?? '',
    }))
  }, [appraisal, scores])

  const active = draftKras.find(kra => kra.id === (activeKraId ?? draftKras[0]?.id)) ?? draftKras[0]
  const canSubmit = appraisal?.status === 'sl_review'
  const completed = draftKras.filter(kra => (kra.sl_score ?? 0) > 0)
  const allScored = draftKras.length > 0 && completed.length === draftKras.length

  const patchScore = (kra: Kra, patch: Partial<ReviewDraft>) => {
    setScores(prev => ({
      ...prev,
      [kra.id]: {
        score: prev[kra.id]?.score ?? kra.sl_score ?? 0,
        comment: prev[kra.id]?.comment ?? kra.sl_comment ?? '',
        ...patch,
      },
    }))
  }

  const submitReview = async () => {
    if (!appraisal || !user) return
    setSubmitting(true)
    await submitMut.mutateAsync({ appraisalId: appraisal.id, updates: { kras: draftKras } })
    await advanceMut.mutateAsync({
      appraisalId: appraisal.id,
      actor: { userId: user.id, name: user.name, role: user.role },
    })
    setSubmitting(false)
    navigate({ to: '/dashboard' })
  }

  const confirmReturn = async (reason: string) => {
    if (!appraisal || !user) return
    setSubmitting(true)
    if (Object.keys(scores).length > 0) {
      await submitMut.mutateAsync({ appraisalId: appraisal.id, updates: { kras: draftKras } })
    }
    await returnMut.mutateAsync({
      appraisalId: appraisal.id,
      reason,
      actor: { userId: user.id, name: user.name, role: 'sl' },
    })
    setSubmitting(false)
    setReturnOpen(false)
    navigate({ to: '/dashboard' })
  }

  if (isLoading) {
    return (
      <PageShell breadcrumb="SL Review">
        <EmptyState title="Loading review queue..." />
      </PageShell>
    )
  }

  if (!appraisal) {
    return (
      <PageShell breadcrumb="SL Review">
        <EmptyState title="Appraisal not found." />
      </PageShell>
    )
  }

  return (
    <PageShell breadcrumb="SL Review">
        <PageHeader
          category="Team Reviews"
          title="Squad Leader Review"
          description={`${appraisal.cycleName} · Employee ID ${appraisal.userId} · review each KRA before routing to HoD`}
          actions={<StatusBadge status={appraisal.status} size="md" />}
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
            <SectionCard>
              <div className="mb-4 flex items-center gap-3">
                  <Avatar initials={`U${appraisal.userId}`} size="lg" tone="brand" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Member appraisal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Employee ID {appraisal.userId}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Review progress</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{completed.length}/{draftKras.length} KRAs</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(completed.length / Math.max(draftKras.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="KRA review list">
              <div className="space-y-1.5">
                {draftKras.map((kra, index) => {
                  const selected = active?.id === kra.id
                  const done = (kra.sl_score ?? 0) > 0
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
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done ? 'bg-success-500 text-white' : 'border border-dashed border-gray-300 text-gray-400 dark:border-gray-700'}`}>
                        {done ? Icon.check : index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{kra.title}</span>
                        <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Self {kra.self_score}/5 · Weight {kra.weight}%</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </SectionCard>

            <SectionCard title="Submit checklist">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${allScored ? 'bg-success-500 text-white' : 'border border-gray-300 text-transparent dark:border-gray-700'}`}>{Icon.check}</span>
                  <span className={allScored ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}>All KRAs scored by SL</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${canSubmit ? 'bg-success-500 text-white' : 'border border-gray-300 text-transparent dark:border-gray-700'}`}>{Icon.check}</span>
                  <span className={canSubmit ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}>Status is SL Review</span>
                </li>
              </ul>
            </SectionCard>

            <SectionCard title="History">
              <AuditTimeline entries={appraisal.audit_log} />
            </SectionCard>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            {active ? (
              <SectionCard
                title={active.title}
                description={`Target: ${active.target} · Weight ${active.weight}%`}
                action={<Badge tone="neutral">KRA {draftKras.findIndex(kra => kra.id === active.id) + 1}</Badge>}
              >
                <div className="space-y-6">
                  {!canSubmit && (
                    <div className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
                      This appraisal is currently <strong>{appraisal.status.replace(/_/g, ' ')}</strong>; SL scoring is locked.
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Employee self assessment</p>
                        <ScoreDot value={active.self_score} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{active.self_comment}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                      <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">Evidence submitted</p>
                      <EvidenceList items={active.evidence} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your SL score</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{active.sl_score ? SCORE_LABELS[active.sl_score] : 'Choose a score'}</p>
                    </div>
                    <ScorePicker value={active.sl_score ?? 0} disabled={!canSubmit} onChange={score => patchScore(active, { score })} />
                  </div>

                  <FormField label="Reviewer comment">
                    <Textarea
                      rows={5}
                      disabled={!canSubmit}
                      value={active.sl_comment ?? ''}
                      onChange={event => patchScore(active, { comment: event.target.value })}
                      placeholder="Add context for HoD: validation notes, delivery quality, blockers, or coaching feedback."
                    />
                  </FormField>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                    <Button type="button" variant="secondary" onClick={() => navigate({ to: '/dashboard' })}>
                      Back to Dashboard
                    </Button>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={!canSubmit || submitting}
                        onClick={() => setReturnOpen(true)}
                      >
                        Return to Employee
                      </Button>
                      <Button
                        type="button"
                        onClick={submitReview}
                        disabled={!canSubmit || !allScored || submitting}
                        icon={Icon.send}
                      >
                        {submitting ? 'Submitting...' : 'Approve to HoD'}
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
        targetStageLabel="Employee"
        submitting={submitting}
        onClose={() => setReturnOpen(false)}
        onConfirm={confirmReturn}
      />
    </PageShell>
  )
}

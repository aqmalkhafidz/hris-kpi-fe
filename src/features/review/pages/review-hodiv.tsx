import { useMemo, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import {
  useAppraisalById,
  useAdvanceAppraisal,
  useReturnAppraisal,
  useSubmitAppraisal,
} from '@features/appraisal/hooks/use-appraisal'
import { useAuth } from '../../../auth/auth-context'
import { PageShell } from '@shared/layouts/page-shell'
import { Icon } from '@shared/layouts/icon'
import { Button } from '@shared/ui/button'
import { EmptyState } from '@shared/ui/empty-state'
import { FormField, Textarea } from '@shared/ui/form-field'
import { PageHeader } from '@shared/ui/page-header'
import { ScorePicker } from '@shared/domain/score-picker'
import { SectionCard } from '@shared/ui/section-card'
import { StatusBadge } from '@shared/ui/status-badge'
import { AuditTimeline } from '@shared/domain/audit-timeline'
import { ReturnModal } from '../components/return-modal'
import { ScoreComparison } from '@shared/domain/score-comparison'
import { BellCurve } from '../components/bell-curve'
import { getAppraisalsForReviewer, type Kra } from '@features/appraisal/data/mock-appraisals'

const SCORE_LABELS: Record<number, string> = { 1: 'Far Below', 2: 'Below', 3: 'Meet', 4: 'Exceed', 5: 'Far Exceed' }

interface ReviewDraft {
  score: number
  comment: string
}

export function HodivReviewPage() {
  const { appraisalId } = useParams({ strict: false }) as { appraisalId: string }
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: appraisal, isLoading } = useAppraisalById(appraisalId)
  const submitMut = useSubmitAppraisal()
  const advanceMut = useAdvanceAppraisal()
  const returnMut = useReturnAppraisal()

  const [scores, setScores] = useState<Record<string, ReviewDraft>>({})
  const [submitting, setSubmitting] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)

  const draftKras = useMemo(() => {
    if (!appraisal) return []
    return appraisal.kras.map(kra => ({
      ...kra,
      hodiv_score: scores[kra.id]?.score ?? kra.hodiv_score,
      hodiv_comment: scores[kra.id]?.comment ?? kra.hodiv_comment ?? '',
    }))
  }, [appraisal, scores])

  const distribution = useMemo(() => {
    if (!user) return [
      { label: '1', count: 0 }, { label: '2', count: 0 }, { label: '3', count: 0 }, { label: '4', count: 0 }, { label: '5', count: 0 },
    ]
    const queue = getAppraisalsForReviewer(user.id, 'hodiv')
    const buckets = [0, 0, 0, 0, 0]
    for (const a of queue) {
      for (const k of a.kras) {
        const score = k.hodiv_score ?? k.hod_score ?? k.sl_score ?? 0
        if (score >= 1 && score <= 5) buckets[score - 1]++
      }
    }
    return [
      { label: '1', count: buckets[0] },
      { label: '2', count: buckets[1] },
      { label: '3', count: buckets[2] },
      { label: '4', count: buckets[3] },
      { label: '5', count: buckets[4] },
    ]
  }, [user, appraisal])

  const canSubmit = appraisal?.status === 'hodiv_review'
  const completed = draftKras.filter(kra => (kra.hodiv_score ?? 0) > 0)
  const allScored = draftKras.length > 0 && completed.length === draftKras.length

  const patchScore = (kra: Kra, patch: Partial<ReviewDraft>) => {
    setScores(prev => ({
      ...prev,
      [kra.id]: {
        score: prev[kra.id]?.score ?? kra.hodiv_score ?? 0,
        comment: prev[kra.id]?.comment ?? kra.hodiv_comment ?? '',
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
      userRole: 'staff',
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
      actor: { userId: user.id, name: user.name, role: 'hodiv' },
    })
    setSubmitting(false)
    setReturnOpen(false)
    navigate({ to: '/dashboard' })
  }

  if (isLoading) {
    return (
      <PageShell breadcrumb="HoDiv Review">
        <div className="px-6 py-8"><EmptyState title="Loading review queue..." /></div>
      </PageShell>
    )
  }

  if (!appraisal) {
    return (
      <PageShell breadcrumb="HoDiv Review">
        <div className="px-6 py-8"><EmptyState title="Appraisal not found." /></div>
      </PageShell>
    )
  }

  return (
    <PageShell breadcrumb="HoDiv Review">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <PageHeader
          category="Division Sign-off"
          title="Head of Division Review"
          description={`${appraisal.cycleName} · Final calibration before employee acknowledgement`}
          actions={<StatusBadge status={appraisal.status} size="md" />}
        />

        {!canSubmit && (
          <div className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
            This appraisal is currently <strong>{appraisal.status.replace(/_/g, ' ')}</strong>; HoDiv scoring is locked.
          </div>
        )}

        {canSubmit && (
          <div className="rounded-xl border border-success-100 bg-success-50 px-4 py-3 text-sm text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-300">
            Finalising will route this appraisal to the employee for <strong>acknowledgement</strong>.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title="Division score distribution"
            description="Live distribution across appraisals you own"
            className="lg:col-span-2"
          >
            <BellCurve buckets={distribution} />
          </SectionCard>
          <SectionCard title="History">
            <AuditTimeline entries={appraisal.audit_log} />
          </SectionCard>
        </div>

        {draftKras.map((kra, idx) => (
          <SectionCard
            key={kra.id}
            title={`KRA ${idx + 1} · ${kra.title}`}
            description={`Target: ${kra.target} · Weight ${kra.weight}%`}
          >
            <div className="space-y-5">
              <ScoreComparison kra={kra} roles={['self', 'sl', 'hod', 'hodiv']} />

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Self</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.self_comment}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">SL</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.sl_comment || '— not yet provided'}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">HoD</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.hod_comment || '— not yet provided'}</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your HoDiv score</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{kra.hodiv_score ? SCORE_LABELS[kra.hodiv_score] : 'Choose a score'}</p>
                </div>
                <ScorePicker
                  value={kra.hodiv_score ?? 0}
                  disabled={!canSubmit}
                  onChange={score => patchScore(kra, { score })}
                />
              </div>

              <FormField label="HoDiv comment">
                <Textarea
                  rows={3}
                  disabled={!canSubmit}
                  value={kra.hodiv_comment ?? ''}
                  onChange={e => patchScore(kra, { comment: e.target.value })}
                  placeholder="Final sign-off rationale or division-level calibration notes for the employee."
                />
              </FormField>
            </div>
          </SectionCard>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3">
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
              Return to HoD
            </Button>
            <Button
              type="button"
              onClick={submitReview}
              disabled={!canSubmit || !allScored || submitting}
              icon={Icon.send}
            >
              {submitting ? 'Finalising...' : 'Finalise & route to employee'}
            </Button>
          </div>
        </div>
      </div>

      <ReturnModal
        open={returnOpen}
        targetStageLabel="HoD"
        submitting={submitting}
        onClose={() => setReturnOpen(false)}
        onConfirm={confirmReturn}
      />
    </PageShell>
  )
}

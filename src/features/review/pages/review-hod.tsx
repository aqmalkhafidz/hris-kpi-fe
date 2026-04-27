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

export function HodReviewPage() {
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
      hod_score: scores[kra.id]?.score ?? kra.hod_score,
      hod_comment: scores[kra.id]?.comment ?? kra.hod_comment ?? '',
    }))
  }, [appraisal, scores])

  const distribution = useMemo(() => {
    if (!user) return [
      { label: '1', count: 0 }, { label: '2', count: 0 }, { label: '3', count: 0 }, { label: '4', count: 0 }, { label: '5', count: 0 },
    ]
    const queue = getAppraisalsForReviewer(user.id, 'hod')
    const buckets = [0, 0, 0, 0, 0]
    for (const a of queue) {
      for (const k of a.kras) {
        const score = k.hod_score ?? k.sl_score ?? 0
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

  const canSubmit = appraisal?.status === 'hod_review'
  const completed = draftKras.filter(kra => (kra.hod_score ?? 0) > 0)
  const allScored = draftKras.length > 0 && completed.length === draftKras.length

  const patchScore = (kra: Kra, patch: Partial<ReviewDraft>) => {
    setScores(prev => ({
      ...prev,
      [kra.id]: {
        score: prev[kra.id]?.score ?? kra.hod_score ?? 0,
        comment: prev[kra.id]?.comment ?? kra.hod_comment ?? '',
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
      actor: { userId: user.id, name: user.name, role: 'hodept' },
    })
    setSubmitting(false)
    setReturnOpen(false)
    navigate({ to: '/dashboard' })
  }

  if (isLoading) {
    return (
      <PageShell breadcrumb="HoD Review">
        <div className="px-6 py-8"><EmptyState title="Loading review queue..." /></div>
      </PageShell>
    )
  }

  if (!appraisal) {
    return (
      <PageShell breadcrumb="HoD Review">
        <div className="px-6 py-8"><EmptyState title="Appraisal not found." /></div>
      </PageShell>
    )
  }

  return (
    <PageShell breadcrumb="HoD Review">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <PageHeader
          category="Department Calibration"
          title="Head of Department Review"
          description={`${appraisal.cycleName} · Calibrate against department distribution before routing to HoDiv`}
          actions={<StatusBadge status={appraisal.status} size="md" />}
        />

        {!canSubmit && (
          <div className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
            This appraisal is currently <strong>{appraisal.status.replace(/_/g, ' ')}</strong>; HoD scoring is locked.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            title="Department score distribution"
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
              <ScoreComparison kra={kra} roles={['self', 'sl', 'hod']} />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Self comment</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.self_comment}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">SL comment</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.sl_comment || '— not yet provided'}</p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your HoD score</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{kra.hod_score ? SCORE_LABELS[kra.hod_score] : 'Choose a score'}</p>
                </div>
                <ScorePicker
                  value={kra.hod_score ?? 0}
                  disabled={!canSubmit}
                  onChange={score => patchScore(kra, { score })}
                />
              </div>

              <FormField label="HoD comment">
                <Textarea
                  rows={3}
                  disabled={!canSubmit}
                  value={kra.hod_comment ?? ''}
                  onChange={e => patchScore(kra, { comment: e.target.value })}
                  placeholder="Calibration notes for HoDiv: alignment with peers, outlier rationale, coaching themes."
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
              Return to SL
            </Button>
            <Button
              type="button"
              onClick={submitReview}
              disabled={!canSubmit || !allScored || submitting}
              icon={Icon.send}
            >
              {submitting ? 'Submitting...' : 'Approve to HoDiv'}
            </Button>
          </div>
        </div>
      </div>

      <ReturnModal
        open={returnOpen}
        targetStageLabel="SL"
        submitting={submitting}
        onClose={() => setReturnOpen(false)}
        onConfirm={confirmReturn}
      />
    </PageShell>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useAppraisalById, useAcknowledgeAppraisal } from '../hooks/use-appraisal'
import { useAuth } from '@features/auth/context/auth-context'
import { PageShell } from '@shared/layouts/page-shell'
import { Icon } from '@shared/layouts/icon'
import { Button } from '@shared/ui/button'
import { EmptyState } from '@shared/ui/empty-state'
import { PageHeader } from '@shared/ui/page-header'
import { SectionCard } from '@shared/ui/section-card'
import { ScoreComparison } from '@shared/domain/score-comparison'
import { AuditTimeline } from '@shared/domain/audit-timeline'
import { EvidenceList } from '@shared/domain/evidence-list'
import { StatusBadge } from '@shared/ui/status-badge'

export function AcknowledgePage() {
  const { appraisalId } = useParams({ strict: false }) as { appraisalId: string }
  const numericAppraisalId = Number(appraisalId)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: appraisal, isLoading } = useAppraisalById(numericAppraisalId)
  const ackMut = useAcknowledgeAppraisal()
  const [submitting, setSubmitting] = useState(false)

  if (isLoading) {
    return (
      <PageShell breadcrumb="Acknowledge">
        <EmptyState title="Loading appraisal..." />
      </PageShell>
    )
  }

  if (!appraisal) {
    return (
      <PageShell breadcrumb="Acknowledge">
        <EmptyState title="Appraisal not found." />
      </PageShell>
    )
  }

  const ownsAppraisal = user?.id === appraisal.userId
  const canAcknowledge = appraisal.status === 'acknowledge' && ownsAppraisal

  const handleAcknowledge = async () => {
    if (!user) return
    setSubmitting(true)
    await ackMut.mutateAsync({
      appraisalId: appraisal.id,
      actor: { userId: user.id, name: user.name, role: user.role },
    })
    setSubmitting(false)
    navigate({ to: '/dashboard' })
  }

  const finalScore = appraisal.kras.reduce((sum, kra) => {
    const score = kra.hodiv_score ?? kra.hod_score ?? kra.sl_score ?? kra.self_score
    return sum + score * (kra.weight / 100)
  }, 0)

  return (
    <PageShell breadcrumb="Acknowledge" maxWidth="5xl">
        <PageHeader
          category="Final Sign-off"
          title="Acknowledge your appraisal"
          description={`${appraisal.cycleName} · Review your final scores and acknowledge to close the cycle.`}
          actions={<StatusBadge status={appraisal.status} size="md" />}
        />

        {!ownsAppraisal && (
          <div className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-500/20 dark:bg-warning-500/10 dark:text-warning-300">
            You can only acknowledge your own appraisal.
          </div>
        )}

        {appraisal.status === 'completed' && (
          <div className="rounded-xl border border-success-100 bg-success-50 px-4 py-3 text-sm text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-300">
            Already acknowledged{appraisal.acknowledged_at ? ` on ${new Date(appraisal.acknowledged_at).toLocaleDateString()}` : ''}.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Weighted final score" className="lg:col-span-2">
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold text-brand-700 dark:text-brand-300">{finalScore.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">/ 5.00</p>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Weighted average across {appraisal.kras.length} KRAs using HoDiv (or last-available) scores.
            </p>
          </SectionCard>
          <SectionCard title="History">
            <AuditTimeline entries={appraisal.audit_log} />
          </SectionCard>
        </div>

        {appraisal.kras.map((kra, idx) => (
          <SectionCard
            key={kra.id}
            title={`KRA ${idx + 1} · ${kra.title}`}
            description={`Target: ${kra.target} · Weight ${kra.weight}%`}
          >
            <div className="space-y-4">
              <ScoreComparison kra={kra} roles={['self', 'sl', 'hod', 'hodiv']} />

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Self comment</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.self_comment}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">SL comment</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.sl_comment || '—'}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">HoD comment</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.hod_comment || '—'}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">HoDiv comment</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{kra.hodiv_comment || '—'}</p>
                </div>
              </div>

              {kra.evidence.length > 0 && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Evidence</p>
                  <EvidenceList items={kra.evidence} />
                </div>
              )}
            </div>
          </SectionCard>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate({ to: '/dashboard' })}>
            Back to Dashboard
          </Button>
          <Button
            type="button"
            disabled={!canAcknowledge || submitting}
            onClick={handleAcknowledge}
            icon={Icon.check}
          >
            {submitting ? 'Acknowledging...' : 'I acknowledge this appraisal'}
          </Button>
        </div>
    </PageShell>
  )
}

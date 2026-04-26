import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../auth/auth-context'
import { useMyAppraisals } from '../hooks/use-appraisal'
import { useReviewQueue } from '../hooks/use-reviews'
import { Avatar } from '../components/shell/avatar'
import { Badge } from '../components/shell/badge'
import { Icon } from '../components/shell/icon'
import { PageShell } from '../components/shell/page-shell'
import { ApprovalStepper } from '../components/ui/stepper'
import { Button } from '../components/ui/button'
import { EmptyState } from '../components/ui/empty-state'
import { EvidenceList } from '../components/ui/evidence-list'
import { PageHeader } from '../components/ui/page-header'
import { SectionCard } from '../components/ui/section-card'
import { ScoreDot } from '../components/ui/score-dot'
import { StatCard } from '../components/ui/stat-card'
import { StatusBadge } from '../components/ui/status-badge'
import { Appraisal } from '../data/mock-appraisals'

function weightedScore(appraisal: Appraisal) {
  return appraisal.kras.reduce((sum, kra) => sum + (kra.self_score * kra.weight / 100), 0)
}

function roleReviewPath(role: 'sl' | 'hod' | 'hodiv', id: string) {
  return `/review/${role}/${id}` as any
}

const activity = [
  { who: 'Citra Dewi', initials: 'CD', action: 'left a note on', target: 'Indonesia payment rails', time: '2h ago', tone: 'success' as const },
  { who: 'You', initials: 'AP', action: 'attached evidence to', target: 'OIDC migration', time: 'Yesterday', tone: 'brand' as const },
  { who: 'HR Console', initials: 'HR', action: 'reminded you about', target: 'cycle deadline', time: 'Mar 20', tone: 'warning' as const },
]

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: appraisals, isLoading } = useMyAppraisals(user?.id ?? '')
  const { data: slQueue } = useReviewQueue(user?.id ?? '', 'sl')
  const { data: hodQueue } = useReviewQueue(user?.id ?? '', 'hod')
  const { data: hodivQueue } = useReviewQueue(user?.id ?? '', 'hodiv')

  const appraisal = appraisals?.[0]
  const reviews = [
    ...(slQueue ?? []).filter(item => item.status === 'sl_review').map(item => ({ ...item, reviewRole: 'sl' as const })),
    ...(hodQueue ?? []).filter(item => item.status === 'hod_review').map(item => ({ ...item, reviewRole: 'hod' as const })),
    ...(hodivQueue ?? []).filter(item => item.status === 'hodiv_review').map(item => ({ ...item, reviewRole: 'hodiv' as const })),
  ]
  const canReview = user?.role === 'sl' || user?.role === 'hodept' || user?.role === 'hodiv'
  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <PageShell breadcrumb="Dashboard">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <PageHeader
          category="My Appraisals"
          title={`Hello, ${firstName}`}
          description={`${user?.position ?? ''} · ${user?.squad ?? user?.dept ?? ''} · Q1 2026 cycle workspace`}
          actions={<Avatar initials={user?.initials ?? ''} size="lg" tone="brand" />}
        />

        {isLoading ? (
          <EmptyState title="Loading appraisal..." />
        ) : !appraisal ? (
          <EmptyState title="No active appraisal cycle found." description="HR has not opened a cycle for this account yet." />
        ) : (
          <>
            <SectionCard
              title={appraisal.cycleName}
              description={`Template snapshot · ${appraisal.cycleShort} · current routing status`}
              action={<StatusBadge status={appraisal.status} size="md" />}
            >
              <ApprovalStepper status={appraisal.status} />
            </SectionCard>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Self score"
                value={weightedScore(appraisal).toFixed(2)}
                footer="/ 5.00 weighted average"
                icon={Icon.star}
                tone="brand"
              />
              <StatCard
                label="KRAs"
                value={appraisal.kras.length}
                footer={`${appraisal.kras.filter(kra => kra.self_score > 0).length}/${appraisal.kras.length} scored`}
                icon={Icon.goals}
                tone="info"
              />
              <StatCard
                label="Evidence attached"
                value={appraisal.kras.reduce((sum, kra) => sum + kra.evidence.length, 0)}
                footer="Across all KRAs"
                icon={Icon.paper}
                tone="success"
              />
              <StatCard
                label="Days to cycle end"
                value="4"
                footer="Apr 30, 2026 deadline"
                icon={Icon.clock}
                tone={appraisal.status === 'draft' ? 'warning' : 'neutral'}
              />
            </div>

            {appraisal.status === 'draft' && (
              <section className="rounded-2xl border border-warning-100 bg-warning-50 p-5 dark:border-warning-500/20 dark:bg-warning-500/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-500 text-white">{Icon.warn}</div>
                    <div>
                      <p className="text-sm font-semibold text-warning-700 dark:text-warning-300">Action required · Submit self-appraisal before Apr 30, 2026</p>
                      <p className="mt-1 text-sm text-warning-700/80 dark:text-warning-300/80">Review your KRA scores, add evidence, then submit into the approval chain.</p>
                    </div>
                  </div>
                  <Link to="/self-appraisal">
                    <Button variant="secondary" icon={Icon.chev}>Continue</Button>
                  </Link>
                </div>
              </section>
            )}

            {appraisal.status === 'acknowledge' && (
              <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-500/30 dark:bg-blue-500/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">{Icon.check}</div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Final scores ready · Acknowledge to close the cycle</p>
                      <p className="mt-1 text-sm text-blue-700/80 dark:text-blue-300/80">HoDiv has signed off your appraisal. Review the final scores and acknowledge.</p>
                    </div>
                  </div>
                  <Link to="/acknowledge/$appraisalId" params={{ appraisalId: appraisal.id }}>
                    <Button icon={Icon.chev}>Review &amp; acknowledge</Button>
                  </Link>
                </div>
              </section>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
              <SectionCard
                title={`My KRAs · ${appraisal.cycleShort}`}
                description={`Weight total ${appraisal.kras.reduce((sum, kra) => sum + kra.weight, 0)}%`}
                action={<Link to="/self-appraisal"><Button size="sm" variant="secondary">{appraisal.status === 'draft' ? 'Edit' : 'View'}</Button></Link>}
              >
                <div className="-m-5 divide-y divide-gray-100 dark:divide-gray-800">
                  {appraisal.kras.map(kra => (
                    <div key={kra.id} className="px-5 py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                          {kra.self_score || '-'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{kra.title}</p>
                            <Badge tone="neutral">{kra.weight}%</Badge>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{kra.self_comment || kra.description}</p>
                          {kra.evidence.length > 0 && <div className="mt-3"><EvidenceList items={kra.evidence} /></div>}
                        </div>
                        <ScoreDot value={kra.self_score} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div className="space-y-6">
                <SectionCard title="Cycle summary" description="Q1 2026 performance review">
                  <dl className="space-y-3">
                    {[
                      ['Window', 'Jan 1 - Mar 31, 2026'],
                      ['Submit by', 'Apr 30, 2026'],
                      ['Review chain', 'SL → HoD → HoDiv'],
                      ['Current status', appraisal.status.replace(/_/g, ' ')],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                        <dt className="text-xs font-medium uppercase text-gray-400">{label}</dt>
                        <dd className="text-right text-sm font-medium text-gray-700 dark:text-gray-200">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </SectionCard>

                <SectionCard title="Recent activity">
                  <div className="space-y-4">
                    {activity.map(item => (
                      <div key={`${item.who}-${item.target}`} className="flex gap-3">
                        <Avatar initials={item.initials} size="sm" tone={item.tone} />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-200"><span className="font-semibold">{item.who}</span> {item.action} <span className="font-medium">{item.target}</span></p>
                          <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          </>
        )}

        {canReview && (
          <SectionCard
            title="Team Reviews"
            description={`${user?.role === 'sl' ? 'Squad Leader' : user?.role === 'hodept' ? 'Head of Department' : 'Head of Division'} review queue`}
            action={<Badge tone={reviews.length ? 'warning' : 'neutral'}>{reviews.length} pending</Badge>}
          >
            {reviews.length === 0 ? (
              <EmptyState title="No pending reviews." description="Submitted appraisals will appear here when they reach your review step." />
            ) : (
              <div className="-m-5 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-5 text-left">Appraisal</th>
                      <th className="px-5 text-left">Status</th>
                      <th className="px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {reviews.map(review => (
                      <tr key={`${review.id}-${review.reviewRole}`}>
                        <td className="px-5">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{review.cycleName}</p>
                          <p className="text-xs text-gray-500">Employee ID {review.userId}</p>
                        </td>
                        <td className="px-5"><StatusBadge status={review.status} /></td>
                        <td className="px-5 text-right">
                          <Button size="sm" onClick={() => navigate({ to: roleReviewPath(review.reviewRole, review.id) })}>Review</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}
      </div>
    </PageShell>
  )
}

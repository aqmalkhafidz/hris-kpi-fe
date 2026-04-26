import { UserRole } from '../auth/mock-users'

export type AppraisalStatus =
  | 'draft'
  | 'sl_review'
  | 'hod_review'
  | 'hodiv_review'
  | 'acknowledge'
  | 'completed'

export type ReviewerRole = 'sl' | 'hod' | 'hodiv'

export type AuditAction =
  | 'submit'
  | 'approve'
  | 'return'
  | 'acknowledge'
  | 'score_change'
  | 'comment'

export interface Evidence {
  kind: 'url' | 'file'
  name: string
  date: string
  description?: string
  url?: string
}

export interface Kra {
  id: string
  title: string
  description: string
  target: string
  weight: number
  self_score: number
  self_comment: string
  evidence: Evidence[]
  sl_score?: number
  sl_comment?: string
  hod_score?: number
  hod_comment?: string
  hodiv_score?: number
  hodiv_comment?: string
}

export interface AuditEntry {
  timestamp: string
  actor_user_id: string
  actor_name: string
  actor_role: UserRole
  action: AuditAction
  from_status?: AppraisalStatus
  to_status?: AppraisalStatus
  reason?: string
  kra_id?: string
}

export interface Appraisal {
  id: string
  userId: string
  cycleName: string
  cycleShort: string
  status: AppraisalStatus
  reflection: string
  kras: Kra[]
  reviewers: {
    sl: { userId: string; name: string; initials: string }
    hod: { userId: string; name: string; initials: string }
    hodiv: { userId: string; name: string; initials: string }
  }
  audit_log: AuditEntry[]
  submittedAt?: string
  acknowledged_at?: string
}

const baseKras: Kra[] = [
  {
    id: 'k1',
    title: 'Reduce checkout P95 latency',
    description: 'Bring P95 of /checkout below 220ms across top 3 markets.',
    target: 'P95 < 220ms',
    weight: 25,
    self_score: 4,
    self_comment: 'Hit 248ms after cart refactor — 20% drop. Awaiting payment-rails work to fully close the gap.',
    evidence: [
      { kind: 'url', name: 'Grafana dashboard · checkout P95', date: 'Mar 10' },
      { kind: 'file', name: 'rfc-2026-checkout-rewrite.pdf', date: 'Feb 22' },
    ],
  },
  {
    id: 'k2',
    title: 'Migrate auth to OIDC provider',
    description: 'Cut over remaining services from legacy session-cookie auth.',
    target: '100% service rollout',
    weight: 20,
    self_score: 5,
    self_comment: '10 of 10 services migrated. Zero auth incidents in canary; full rollout completed Mar 4.',
    evidence: [
      { kind: 'url', name: 'Rollout tracker · OIDC', date: 'Mar 4' },
      { kind: 'file', name: 'oidc-postmortem.md', date: 'Mar 5' },
    ],
  },
  {
    id: 'k3',
    title: 'Ship Indonesia payment rails (DANA + GoPay)',
    description: 'GA launch of two e-wallet rails.',
    target: 'GA · DANA + GoPay',
    weight: 20,
    self_score: 3,
    self_comment: 'DANA in beta, GoPay UAT pending vendor signoff. Slipped 3 weeks; mitigation plan in place.',
    evidence: [{ kind: 'url', name: 'JIRA epic · PAY-204', date: 'Mar 12' }],
  },
  {
    id: 'k4',
    title: 'Reduce on-call alerts by 30%',
    description: 'Tune noisy SLOs and replace cron-driven alerts with anomaly detection.',
    target: '≥ 30% reduction',
    weight: 15,
    self_score: 4,
    self_comment: 'Reached 28% reduction. Two noisy alerts remain; tickets queued for Q2.',
    evidence: [
      { kind: 'url', name: 'Alert quality report · Mar', date: 'Mar 8' },
      { kind: 'file', name: 'slo-tuning-notes.md', date: 'Feb 28' },
    ],
  },
  {
    id: 'k5',
    title: 'Mentor 2 junior engineers',
    description: 'Weekly 1:1 cadence + design-review shadowing.',
    target: '2 IC2 promotion-ready',
    weight: 10,
    self_score: 4,
    self_comment: '1 mentee promo-ready (committee Apr 5). Second on track for Q2.',
    evidence: [{ kind: 'file', name: 'mentorship-log-q1.pdf', date: 'Mar 14' }],
  },
  {
    id: 'k6',
    title: 'Deliver quarterly architecture review',
    description: 'Own the Q1 arch review doc and present to division.',
    target: 'Review published + presented',
    weight: 10,
    self_score: 5,
    self_comment: 'Delivered Mar 18. 3 initiatives prioritized from review.',
    evidence: [{ kind: 'url', name: 'Architecture review doc', date: 'Mar 18' }],
  },
]

const baseReviewers = {
  sl: { userId: 'u2', name: 'Budi Santoso', initials: 'BS' },
  hod: { userId: 'u3', name: 'Citra Dewi', initials: 'CD' },
  hodiv: { userId: 'u4', name: 'Deni Wahyudi', initials: 'DW' },
}

function cloneKras(prefix: string): Kra[] {
  return baseKras.map(kra => ({
    ...kra,
    id: `${prefix}-${kra.id}`,
    evidence: kra.evidence.map(item => ({ ...item })),
  }))
}

export const MOCK_APPRAISALS: Appraisal[] = [
  {
    id: 'a1',
    userId: 'u1',
    cycleName: 'Q1 2026 Appraisal',
    cycleShort: 'Q1 · 2026',
    status: 'draft',
    reflection: 'Good quarter overall. Focused on latency and auth migration. One KRA slipped due to vendor delay.',
    reviewers: baseReviewers,
    kras: cloneKras('a1'),
    audit_log: [],
  },
  {
    id: 'a2',
    userId: 'u2',
    cycleName: 'Q1 2026 Appraisal',
    cycleShort: 'Q1 · 2026',
    status: 'draft',
    reflection: 'Leading Cart & Checkout while keeping platform reliability steady. Strong cycle on OIDC enablement and mentoring.',
    reviewers: baseReviewers,
    kras: cloneKras('a2'),
    audit_log: [],
  },
  {
    id: 'a3',
    userId: 'u6',
    cycleName: 'Q1 2026 Appraisal',
    cycleShort: 'Q1 · 2026',
    status: 'sl_review',
    reflection: 'Submitted appraisal from a team member awaiting Squad Leader review.',
    submittedAt: 'Mar 24',
    reviewers: baseReviewers,
    kras: cloneKras('a3'),
    audit_log: [
      {
        timestamp: '2026-03-24T09:00:00.000Z',
        actor_user_id: 'u6',
        actor_name: 'Eka Putri',
        actor_role: 'staff',
        action: 'submit',
        from_status: 'draft',
        to_status: 'sl_review',
      },
    ],
  },
]

export function getAppraisalsByUserId(userId: string) {
  return MOCK_APPRAISALS.filter(a => a.userId === userId)
}

export function getAppraisalsForReviewer(reviewerUserId: string, role: ReviewerRole) {
  return MOCK_APPRAISALS.filter(a => a.reviewers[role]?.userId === reviewerUserId)
}

export function getAppraisalById(id: string) {
  return MOCK_APPRAISALS.find(a => a.id === id)
}

const forwardOrder: AppraisalStatus[] = [
  'draft',
  'sl_review',
  'hod_review',
  'hodiv_review',
  'acknowledge',
  'completed',
]

export function advanceStatus(appraisal: Appraisal): AppraisalStatus {
  const idx = forwardOrder.indexOf(appraisal.status)
  return forwardOrder[Math.min(idx + 1, forwardOrder.length - 1)]
}

export function advanceStatusFor(appraisal: Appraisal, userRole: UserRole): AppraisalStatus {
  if (userRole === 'sl' && appraisal.status === 'draft') return 'hod_review'
  return advanceStatus(appraisal)
}

const returnTargetByActor: Partial<Record<UserRole, AppraisalStatus>> = {
  sl: 'draft',
  hodept: 'sl_review',
  hodiv: 'hod_review',
}

export function returnTargetFor(actorRole: UserRole): AppraisalStatus | null {
  return returnTargetByActor[actorRole] ?? null
}

export function appendAudit(
  appraisal: Appraisal,
  entry: Omit<AuditEntry, 'timestamp'> & { timestamp?: string },
): Appraisal {
  const log = appraisal.audit_log ?? []
  const { timestamp, ...rest } = entry
  return {
    ...appraisal,
    audit_log: [...log, { timestamp: timestamp ?? new Date().toISOString(), ...rest }],
  }
}

export function lastReturnEntry(appraisal: Appraisal): AuditEntry | undefined {
  const log = appraisal.audit_log ?? []
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].action === 'return') return log[i]
  }
  return undefined
}

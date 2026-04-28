import type { UserRole } from '@features/auth/types';

export type AppraisalStatus =
  | 'draft'
  | 'sl_review'
  | 'hod_review'
  | 'hodiv_review'
  | 'acknowledge'
  | 'completed';

export type ReviewerRole = 'sl' | 'hod' | 'hodiv';

export type AuditAction =
  | 'submit'
  | 'approve'
  | 'return'
  | 'acknowledge'
  | 'score_change'
  | 'comment';

export interface Evidence {
  kind: 'url' | 'file';
  name: string;
  date: string;
  description?: string;
  url?: string;
}

export interface Kra {
  id: number;
  title: string;
  description: string;
  target: string;
  weight: number;
  self_score: number;
  self_comment: string;
  evidence: Evidence[];
  sl_score?: number;
  sl_comment?: string;
  hod_score?: number;
  hod_comment?: string;
  hodiv_score?: number;
  hodiv_comment?: string;
}

export interface AuditEntry {
  timestamp: string;
  actor_user_id: number;
  actor_name: string;
  actor_role: UserRole;
  action: AuditAction;
  from_status?: AppraisalStatus;
  to_status?: AppraisalStatus;
  reason?: string;
  kra_id?: number;
}

export interface Appraisal {
  id: number;
  userId: number;
  cycleName: string;
  cycleShort: string;
  status: AppraisalStatus;
  reflection: string;
  kras: Kra[];
  reviewers: {
    sl: { userId: number; name: string; initials: string };
    hod: { userId: number; name: string; initials: string };
    hodiv: { userId: number; name: string; initials: string };
  };
  audit_log: AuditEntry[];
  submittedAt?: string;
  acknowledged_at?: string;
}

const forwardOrder: AppraisalStatus[] = [
  'draft',
  'sl_review',
  'hod_review',
  'hodiv_review',
  'acknowledge',
  'completed',
];

export function advanceStatus(appraisal: Appraisal): AppraisalStatus {
  const idx = forwardOrder.indexOf(appraisal.status);
  return forwardOrder[Math.min(idx + 1, forwardOrder.length - 1)];
}

export function advanceStatusFor(
  appraisal: Appraisal,
  userRole: UserRole
): AppraisalStatus {
  if (userRole === 'sl' && appraisal.status === 'draft') return 'hod_review';
  return advanceStatus(appraisal);
}

const returnTargetByActor: Partial<Record<UserRole, AppraisalStatus>> = {
  sl: 'draft',
  hodept: 'sl_review',
  hodiv: 'hod_review',
};

export function returnTargetFor(actorRole: UserRole): AppraisalStatus | null {
  return returnTargetByActor[actorRole] ?? null;
}

export function appendAudit(
  appraisal: Appraisal,
  entry: Omit<AuditEntry, 'timestamp'> & { timestamp?: string }
): Appraisal {
  const log = appraisal.audit_log ?? [];
  const { timestamp, ...rest } = entry;
  return {
    ...appraisal,
    audit_log: [
      ...log,
      { timestamp: timestamp ?? new Date().toISOString(), ...rest },
    ],
  };
}

export function lastReturnEntry(appraisal: Appraisal): AuditEntry | undefined {
  const log = appraisal.audit_log ?? [];
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].action === 'return') return log[i];
  }
  return undefined;
}

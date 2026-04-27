import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAppraisalsByUserId,
  getAppraisalById,
  advanceStatusFor,
  returnTargetFor,
  appendAudit,
  MOCK_APPRAISALS,
  type Appraisal,
  type AppraisalStatus,
} from '../data/mock-appraisals'
import { UserRole } from '../../../auth/mock-users'

const delay = <T>(val: T, ms = 300) => new Promise<T>(res => setTimeout(() => res(val), ms))

export function useMyAppraisals(userId: string) {
  return useQuery({
    queryKey: ['appraisals', userId],
    queryFn: () => delay(getAppraisalsByUserId(userId)),
    enabled: !!userId,
  })
}

export function useAppraisalById(id: string) {
  return useQuery({
    queryKey: ['appraisal', id],
    queryFn: () => delay(getAppraisalById(id) ?? null),
    enabled: !!id,
  })
}

function persist(updated: Appraisal) {
  const idx = MOCK_APPRAISALS.findIndex(a => a.id === updated.id)
  if (idx === -1) throw new Error('Appraisal not found')
  MOCK_APPRAISALS[idx] = updated
  return updated
}

export function useSubmitAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ appraisalId, updates }: { appraisalId: string; updates: Partial<Appraisal> }) => {
      const idx = MOCK_APPRAISALS.findIndex(a => a.id === appraisalId)
      if (idx === -1) throw new Error('Appraisal not found')
      const updated = { ...MOCK_APPRAISALS[idx], ...updates }
      MOCK_APPRAISALS[idx] = updated
      return delay(updated)
    },
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['appraisals', data.userId] })
      qc.invalidateQueries({ queryKey: ['appraisal', data.id] })
      qc.invalidateQueries({ queryKey: ['review-queue'] })
    },
  })
}

interface Actor {
  userId: string
  name: string
  role: UserRole
}

interface AdvanceArgs {
  appraisalId: string
  userRole?: UserRole
  actor: Actor
}

export function useAdvanceAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ appraisalId, userRole = 'staff', actor }: AdvanceArgs) => {
      const current = getAppraisalById(appraisalId)
      if (!current) throw new Error('Not found')
      const fromStatus = current.status
      const toStatus = advanceStatusFor(current, userRole)
      const action = fromStatus === 'draft' ? 'submit' : 'approve'
      const next = appendAudit({ ...current, status: toStatus }, {
        actor_user_id: actor.userId,
        actor_name: actor.name,
        actor_role: actor.role,
        action,
        from_status: fromStatus,
        to_status: toStatus,
      })
      persist(next)
      return delay(next)
    },
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['appraisals', data.userId] })
      qc.invalidateQueries({ queryKey: ['appraisal', data.id] })
      qc.invalidateQueries({ queryKey: ['review-queue'] })
    },
  })
}

interface ReturnArgs {
  appraisalId: string
  reason: string
  actor: Actor
}

export function useReturnAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ appraisalId, reason, actor }: ReturnArgs) => {
      const current = getAppraisalById(appraisalId)
      if (!current) throw new Error('Not found')
      const target: AppraisalStatus | null = returnTargetFor(actor.role)
      if (!target) throw new Error('Role cannot return appraisal')
      const fromStatus = current.status
      const next = appendAudit({ ...current, status: target }, {
        actor_user_id: actor.userId,
        actor_name: actor.name,
        actor_role: actor.role,
        action: 'return',
        from_status: fromStatus,
        to_status: target,
        reason,
      })
      persist(next)
      return delay(next)
    },
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['appraisals', data.userId] })
      qc.invalidateQueries({ queryKey: ['appraisal', data.id] })
      qc.invalidateQueries({ queryKey: ['review-queue'] })
    },
  })
}

interface AcknowledgeArgs {
  appraisalId: string
  actor: Actor
}

export function useAcknowledgeAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ appraisalId, actor }: AcknowledgeArgs) => {
      const current = getAppraisalById(appraisalId)
      if (!current) throw new Error('Not found')
      if (current.status !== 'acknowledge') throw new Error('Not pending acknowledge')
      const next = appendAudit(
        { ...current, status: 'completed' as AppraisalStatus, acknowledged_at: new Date().toISOString() },
        {
          actor_user_id: actor.userId,
          actor_name: actor.name,
          actor_role: actor.role,
          action: 'acknowledge',
          from_status: 'acknowledge',
          to_status: 'completed',
        },
      )
      persist(next)
      return delay(next)
    },
    onSuccess: data => {
      qc.invalidateQueries({ queryKey: ['appraisals', data.userId] })
      qc.invalidateQueries({ queryKey: ['appraisal', data.id] })
      qc.invalidateQueries({ queryKey: ['review-queue'] })
    },
  })
}

import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import {
  acknowledgeAppraisal,
  advanceAppraisal,
  getAppraisalById,
  getAppraisalsByUserId,
  returnAppraisal,
  updateAppraisal,
  type ActorInfo,
} from '../data/mock-appraisals'
import type { Appraisal } from '@shared/lib/types/appraisal'

const SIMULATED_LATENCY_MS = 300
const delay = <T>(value: T, ms = SIMULATED_LATENCY_MS) =>
  new Promise<T>(resolve => setTimeout(() => resolve(value), ms))

const appraisalKeys = {
  all:     ['appraisals'] as const,
  byUser:  (userId: string) => ['appraisals', userId] as const,
  byId:    (id: string)     => ['appraisal', id] as const,
  reviewQueue: ['review-queue'] as const,
}

function invalidateAppraisal(qc: QueryClient, appraisal: Appraisal) {
  qc.invalidateQueries({ queryKey: appraisalKeys.byUser(appraisal.userId) })
  qc.invalidateQueries({ queryKey: appraisalKeys.byId(appraisal.id) })
  qc.invalidateQueries({ queryKey: appraisalKeys.reviewQueue })
}

export function useMyAppraisals(userId: string) {
  return useQuery({
    queryKey: appraisalKeys.byUser(userId),
    queryFn: () => delay(getAppraisalsByUserId(userId)),
    enabled: !!userId,
  })
}

export function useAppraisalById(id: string) {
  return useQuery({
    queryKey: appraisalKeys.byId(id),
    queryFn: () => delay(getAppraisalById(id) ?? null),
    enabled: !!id,
  })
}

export function useSubmitAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ appraisalId, updates }: { appraisalId: string; updates: Partial<Appraisal> }) =>
      delay(updateAppraisal(appraisalId, updates)),
    onSuccess: data => invalidateAppraisal(qc, data),
  })
}

export function useAdvanceAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ appraisalId, actor }: { appraisalId: string; actor: ActorInfo }) =>
      delay(advanceAppraisal(appraisalId, actor)),
    onSuccess: data => invalidateAppraisal(qc, data),
  })
}

export function useReturnAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ appraisalId, reason, actor }: { appraisalId: string; reason: string; actor: ActorInfo }) =>
      delay(returnAppraisal(appraisalId, reason, actor)),
    onSuccess: data => invalidateAppraisal(qc, data),
  })
}

export function useAcknowledgeAppraisal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ appraisalId, actor }: { appraisalId: string; actor: ActorInfo }) =>
      delay(acknowledgeAppraisal(appraisalId, actor)),
    onSuccess: data => invalidateAppraisal(qc, data),
  })
}

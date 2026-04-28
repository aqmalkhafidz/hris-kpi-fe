import { api } from '@shared/api/client'
import type { Appraisal } from '@shared/lib/types/appraisal'

export interface ActorInfo {
  userId: number
  name: string
  role: 'staff' | 'sl' | 'hodept' | 'hodiv' | 'hr'
}

export const appraisalApi = {
  byUser: (userId: number) => api<Appraisal[]>(`/appraisals/user/${userId}`),
  history: (userIds: number[]) => api<Appraisal[]>(`/appraisals/history?userIds=${encodeURIComponent(userIds.join(','))}`),
  byId: (id: number) => api<Appraisal | null>(`/appraisals/${id}`),
  update: (id: number, updates: Partial<Appraisal>) => api<Appraisal>(`/appraisals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  advance: (id: number) => api<Appraisal>(`/appraisals/${id}/advance`, { method: 'POST' }),
  return: (id: number, reason: string) => api<Appraisal>(`/appraisals/${id}/return`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  acknowledge: (id: number) => api<Appraisal>(`/appraisals/${id}/acknowledge`, { method: 'POST' }),
}

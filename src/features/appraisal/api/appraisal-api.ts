import { api } from '@shared/api/client';
import type { Appraisal } from '@shared/lib/types/appraisal';

export interface ActorInfo {
  userId: number;
  name: string;
  role: 'staff' | 'sl' | 'hodept' | 'hodiv' | 'hr';
}

export interface HistoryOwner {
  id: number;
  name: string;
  initials: string;
  position?: string;
}

export interface HistoryResponse {
  items: Appraisal[];
  owners: Record<number, HistoryOwner>;
  scopeLabel: string;
}

export const appraisalApi = {
  byUser: (userId: number) => api<Appraisal[]>(`/appraisals/user/${userId}`),
  history: () => api<HistoryResponse>('/appraisals/history'),
  byId: (id: number) => api<Appraisal | null>(`/appraisals/${id}`),
  update: (id: number, updates: Partial<Appraisal>) =>
    api<Appraisal>(`/appraisals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  advance: (id: number) =>
    api<Appraisal>(`/appraisals/${id}/advance`, { method: 'POST' }),
  return: (id: number, reason: string) =>
    api<Appraisal>(`/appraisals/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  acknowledge: (id: number) =>
    api<Appraisal>(`/appraisals/${id}/acknowledge`, { method: 'POST' }),
};

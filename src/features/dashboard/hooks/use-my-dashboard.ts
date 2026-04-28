import { api } from '@shared/api/client';
import { useQuery } from '@tanstack/react-query';

export interface PerfHistory {
  quarters: string[];
  self: number[];
  reviewer: (number | null)[];
  calibrated: (number | null)[];
}

export interface MyActivity {
  avatar: string;
  who: string;
  what: string;
  target: string;
  when: string;
  tone: 'success' | 'brand' | 'warning' | 'gray';
}

export function usePerfHistory(userId: number | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'me', 'perf-history', userId] as const,
    queryFn: () =>
      api<PerfHistory>(`/dashboard/me/perf-history?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useMyActivity(userId: number | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'me', 'activity', userId] as const,
    queryFn: () => api<MyActivity[]>(`/dashboard/me/activity?userId=${userId}`),
    enabled: !!userId,
  });
}

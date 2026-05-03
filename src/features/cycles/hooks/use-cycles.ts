import { api } from '@shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Cycle, DistEmployee, DistTemplate } from '../types';

export const cyclesKeys = {
  all: ['cycles'] as const,
  distribution: (id: number) => ['cycles', id, 'distribution'] as const,
};

export function useCycles() {
  return useQuery({
    queryKey: cyclesKeys.all,
    queryFn: () => api<Cycle[]>('/cycles'),
  });
}

import { toast } from 'sonner';

export function useUpsertCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      form,
      id,
    }: {
      form: Omit<Cycle, 'id'> | Cycle;
      id?: number;
    }) =>
      api<Cycle>(id ? `/cycles/${id}` : '/cycles', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cyclesKeys.all });
      toast.success('Cycle berhasil disimpan');
    },
    onError: () => toast.error('Gagal menyimpan cycle'),
  });
}

export function useDeleteCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api<{ ok: boolean }>(`/cycles/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cyclesKeys.all });
      toast.success('Cycle berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus cycle'),
  });
}

export type DistStatus =
  | 'matched'
  | 'skipped_already'
  | 'skipped_no_template'
  | 'skipped_no_reviewer'
  | 'skipped_not_staff';

export interface DistRow {
  employee: DistEmployee;
  status: DistStatus;
  template: DistTemplate | null;
  reason: string | null;
}

export function useCycleDistribution(cycleId: number | null) {
  return useQuery({
    queryKey:
      typeof cycleId === 'number'
        ? cyclesKeys.distribution(cycleId)
        : cyclesKeys.all,
    queryFn: () => api<DistRow[]>(`/cycles/${cycleId}/distribution`),
    enabled: typeof cycleId === 'number',
  });
}

export function useDistributeCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cycleId: number) =>
      api<{ created: number; skipped: number; rows: DistRow[] }>(
        `/cycles/${cycleId}/distribute`,
        { method: 'POST' }
      ),
    onSuccess: (_data, cycleId) => {
      qc.invalidateQueries({ queryKey: cyclesKeys.all });
      qc.invalidateQueries({ queryKey: cyclesKeys.distribution(cycleId) });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/api/client'
import type { Cycle, DistEmployee, DistTemplate } from '../types'

const key = ['cycles'] as const

export function useCycles() {
  return useQuery({ queryKey: key, queryFn: () => api<Cycle[]>('/cycles') })
}

export function useUpsertCycle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ form, id }: { form: Omit<Cycle, 'id'> | Cycle; id?: number }) => api<Cycle>(id ? `/cycles/${id}` : '/cycles', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(form),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })
}

export function useDeleteCycle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api<{ ok: boolean }>(`/cycles/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })
}

export type DistStatus = 'matched' | 'skipped_already' | 'skipped_no_template' | 'skipped_no_reviewer'

export interface DistRow {
  employee: DistEmployee
  status: DistStatus
  template: DistTemplate | null
  reason: string | null
}

export function useCycleDistribution(cycleId: number | null) {
  return useQuery({
    queryKey: ['cycles', cycleId, 'distribution'],
    queryFn: () => api<DistRow[]>(`/cycles/${cycleId}/distribution`),
    enabled: typeof cycleId === 'number',
  })
}

export function useDistributeCycle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (cycleId: number) => api<{ created: number; skipped: number; rows: DistRow[] }>(`/cycles/${cycleId}/distribute`, { method: 'POST' }),
    onSuccess: (_data, cycleId) => {
      qc.invalidateQueries({ queryKey: key })
      qc.invalidateQueries({ queryKey: ['cycles', cycleId, 'distribution'] })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@shared/api/client'

export interface CompletedAppraisal {
  id: number
  cycleId: number
  employee: string
  nip: string
  dept: string
  division: string
  position: string
  finalScore: number
  calibratedScore: number | null
  finalGrade: string | null
  isCalibrated: boolean
  completedAt: string
}

export interface CalibrationInput {
  calibratedScore: number | null
  finalGrade: string | null
}

const reportsKey = (cycleId: number) => ['reports', 'completed', cycleId] as const

export function useCompletedAppraisals(cycleId: number | null) {
  return useQuery({
    queryKey: reportsKey(cycleId ?? 0),
    queryFn: () => api<CompletedAppraisal[]>(`/reports/completed?cycleId=${cycleId}`),
    enabled: typeof cycleId === 'number' && cycleId > 0,
  })
}

export function useSaveCalibration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CalibrationInput }) =>
      api<CompletedAppraisal | null>(`/reports/calibration/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess: data => {
      if (!data) return
      qc.invalidateQueries({ queryKey: reportsKey(data.cycleId) })
    },
  })
}

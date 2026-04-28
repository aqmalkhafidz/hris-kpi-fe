import { api } from '@shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface CompletedAppraisal {
  id: number;
  cycleId: number;
  employee: string;
  nip: string;
  dept: string;
  division: string;
  position: string;
  finalScore: number;
  calibratedScore: number | null;
  finalGrade: string | null;
  isCalibrated: boolean;
  completedAt: string;
}

export interface CalibrationInput {
  calibratedScore: number | null;
  finalGrade: string | null;
}

export const reportsKeys = {
  byCycle: (cycleId: number) => ['reports', 'completed', cycleId] as const,
};

export function useCompletedAppraisals(cycleId: number | null) {
  return useQuery({
    queryKey:
      typeof cycleId === 'number' && cycleId > 0
        ? reportsKeys.byCycle(cycleId)
        : (['reports'] as const),
    queryFn: () =>
      api<CompletedAppraisal[]>(`/reports/completed?cycleId=${cycleId}`),
    enabled: typeof cycleId === 'number' && cycleId > 0,
  });
}

export function useSaveCalibration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CalibrationInput }) =>
      api<CompletedAppraisal | null>(`/reports/calibration/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      if (!data) return;
      qc.invalidateQueries({ queryKey: reportsKeys.byCycle(data.cycleId) });
      toast.success('Kalibrasi berhasil disimpan');
    },
    onError: () => toast.error('Gagal menyimpan kalibrasi'),
  });
}

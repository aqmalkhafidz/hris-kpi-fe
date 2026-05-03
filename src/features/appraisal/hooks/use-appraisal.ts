import type { Appraisal } from '@shared/lib/types/appraisal';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { appraisalApi } from '../api/appraisal-api';

const appraisalKeys = {
  all: ['appraisals'] as const,
  byUser: (userId: number) => ['appraisals', userId] as const,
  byId: (id: number) => ['appraisal', id] as const,
  scopedHistory: () => ['appraisals', 'scoped-history'] as const,
  reviewQueue: ['review-queue'] as const,
};

function invalidateAppraisal(qc: QueryClient, appraisal: Appraisal) {
  qc.invalidateQueries({ queryKey: appraisalKeys.byUser(appraisal.userId) });
  qc.invalidateQueries({ queryKey: appraisalKeys.byId(appraisal.id) });
  qc.invalidateQueries({ queryKey: appraisalKeys.reviewQueue });
}

export function useMyAppraisals(userId: number) {
  return useQuery({
    queryKey: appraisalKeys.byUser(userId),
    queryFn: () => appraisalApi.byUser(userId),
    enabled: !!userId,
  });
}

export function useScopedHistory() {
  return useQuery({
    queryKey: appraisalKeys.scopedHistory(),
    queryFn: () => appraisalApi.history(),
  });
}

export function useAppraisalById(id: number) {
  return useQuery({
    queryKey: appraisalKeys.byId(id),
    queryFn: () => appraisalApi.byId(id),
    enabled: !!id,
  });
}

export function useSubmitAppraisal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      appraisalId,
      updates,
    }: {
      appraisalId: number;
      updates: Partial<Appraisal>;
    }) => appraisalApi.update(appraisalId, updates),
    onSuccess: (data) => {
      invalidateAppraisal(qc, data);
      toast.success('Data berhasil disimpan');
    },
    onError: () => toast.error('Gagal menyimpan data'),
  });
}

export function useAdvanceAppraisal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appraisalId }: { appraisalId: number }) =>
      appraisalApi.advance(appraisalId),
    onSuccess: (data) => {
      invalidateAppraisal(qc, data);
      toast.success('Appraisal berhasil diteruskan');
    },
    onError: () => toast.error('Gagal meneruskan appraisal'),
  });
}

export function useReturnAppraisal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      appraisalId,
      reason,
    }: {
      appraisalId: number;
      reason: string;
    }) => appraisalApi.return(appraisalId, reason),
    onSuccess: (data) => {
      invalidateAppraisal(qc, data);
      toast.success('Appraisal berhasil dikembalikan');
    },
    onError: () => toast.error('Gagal mengembalikan appraisal'),
  });
}

export function useAcknowledgeAppraisal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appraisalId }: { appraisalId: number }) =>
      appraisalApi.acknowledge(appraisalId),
    onSuccess: (data) => {
      invalidateAppraisal(qc, data);
      toast.success('Appraisal berhasil diakui');
    },
    onError: () => toast.error('Gagal mengakui appraisal'),
  });
}

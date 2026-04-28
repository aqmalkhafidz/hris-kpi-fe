import { api } from '@shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { KraItem, KraTemplateV2 } from '../types';

export const kraKeys = {
  all: ['kra-templates'] as const,
  detail: (id: number) => ['kra-templates', id] as const,
};

export function useKraTemplates() {
  return useQuery({
    queryKey: kraKeys.all,
    queryFn: () => api<KraTemplateV2[]>('/kra-templates'),
  });
}

export function useUpsertKraTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      template,
      id,
    }: {
      template: Omit<KraTemplateV2, 'id'>;
      id?: number;
    }) =>
      api<KraTemplateV2>(id ? `/kra-templates/${id}` : '/kra-templates', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(template),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: kraKeys.all }),
  });
}

export function useUpdateKraItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      items,
    }: {
      templateId: number;
      items: KraItem[];
    }) =>
      api<KraTemplateV2>(`/kra-templates/${templateId}/items`, {
        method: 'PUT',
        body: JSON.stringify(items),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: kraKeys.all }),
  });
}

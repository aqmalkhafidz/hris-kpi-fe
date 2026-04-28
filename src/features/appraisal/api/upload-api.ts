import { api } from '@shared/api/client';
import type { Evidence } from '@shared/lib/types/appraisal';

export function uploadEvidenceFile(file: File) {
  const form = new FormData();
  form.set('file', file);
  return api<Evidence>('/uploads', { method: 'POST', body: form });
}

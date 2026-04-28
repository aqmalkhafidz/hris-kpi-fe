import { api } from '@shared/api/client';
import type { Appraisal } from '@shared/lib/types/appraisal';

export function getReviewQueue(
  reviewerUserId: number,
  role: 'sl' | 'hod' | 'hodiv'
) {
  return api<Appraisal[]>(
    `/reviews/queue?reviewerUserId=${encodeURIComponent(reviewerUserId)}&role=${role}`
  );
}

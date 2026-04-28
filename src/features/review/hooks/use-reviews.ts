import { useQuery } from '@tanstack/react-query';
import { getReviewQueue } from '../api/review-api';

export const reviewKeys = {
  queue: (reviewerUserId: number, role: 'sl' | 'hod' | 'hodiv') =>
    ['review-queue', reviewerUserId, role] as const,
};

export function useReviewQueue(
  reviewerUserId: number | null | undefined,
  role: 'sl' | 'hod' | 'hodiv'
) {
  return useQuery({
    queryKey:
      typeof reviewerUserId === 'number'
        ? reviewKeys.queue(reviewerUserId, role)
        : (['review-queue'] as const),
    queryFn: () => getReviewQueue(reviewerUserId as number, role),
    enabled: typeof reviewerUserId === 'number',
  });
}

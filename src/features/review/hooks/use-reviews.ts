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
  const id = typeof reviewerUserId === 'number' ? reviewerUserId : null;
  return useQuery({
    queryKey:
      id !== null ? reviewKeys.queue(id, role) : (['review-queue'] as const),
    queryFn: () => {
      if (id === null) throw new Error('reviewerUserId required');
      return getReviewQueue(id, role);
    },
    enabled: id !== null,
  });
}

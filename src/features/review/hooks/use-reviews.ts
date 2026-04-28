import { useQuery } from '@tanstack/react-query'
import { getReviewQueue } from '../api/review-api'

export function useReviewQueue(reviewerUserId: number | null | undefined, role: 'sl' | 'hod' | 'hodiv') {
  return useQuery({
    queryKey: ['review-queue', reviewerUserId, role],
    queryFn: () => getReviewQueue(reviewerUserId as number, role),
    enabled: typeof reviewerUserId === 'number',
  })
}

import { useQuery } from '@tanstack/react-query'
import { getAppraisalsForReviewer } from '../data/mock-appraisals'

const delay = <T>(val: T, ms = 300) => new Promise<T>(res => setTimeout(() => res(val), ms))

export function useReviewQueue(reviewerUserId: string, role: 'sl' | 'hod' | 'hodiv') {
  return useQuery({
    queryKey: ['review-queue', reviewerUserId, role],
    queryFn: () => delay(getAppraisalsForReviewer(reviewerUserId, role)),
    enabled: !!reviewerUserId,
  })
}

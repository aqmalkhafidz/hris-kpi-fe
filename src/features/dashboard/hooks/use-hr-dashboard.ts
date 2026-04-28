import { useQuery } from '@tanstack/react-query'
import { api } from '@shared/api/client'

export interface HrDashboardCycle {
  id: number
  name: string
  startDate: string
  endDate: string
  selfDeadline: string | null
}

export interface HrDashboardPipeline {
  invited: number
  draftStarted: number
  selfSubmitted: number
  slApproved: number
  hodApproved: number
  hodivApproved: number
  completed: number
}

export interface HrDashboardDivision {
  name: string
  total: number
  completed: number
  inReview: number
  draft: number
  notStarted: number
  avg: number
}

export interface HrDashboardScoreBucket {
  label: string
  count: number
}

export interface HrDashboardRecentSubmission {
  who: string
  team: string
  to: string
  when: string
  initials: string
}

export interface HrDashboardAttention {
  title: string
  subtitle: string
  tone: 'error' | 'warning' | 'brand'
}

export interface HrDashboardStats {
  activeEmployees: number
  selfDone: number
  awaitingReview: number
  overdue: number
}

export interface HrDashboardPayload {
  cycle: HrDashboardCycle | null
  pipeline: HrDashboardPipeline
  divisions: HrDashboardDivision[]
  scoreBuckets: HrDashboardScoreBucket[]
  recentSubmissions: HrDashboardRecentSubmission[]
  attention: HrDashboardAttention[]
  stats: HrDashboardStats
}

export function useHrDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'hr'] as const,
    queryFn: () => api<HrDashboardPayload>('/dashboard/hr'),
  })
}

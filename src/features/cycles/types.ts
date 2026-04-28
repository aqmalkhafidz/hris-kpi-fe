export type CycleStatus = 'active' | 'draft' | 'closed'

export interface Cycle {
  id: number
  name: string
  startDate: string
  endDate: string
  selfDeadline: string | null
  status: CycleStatus
  description: string
  distributedAt: string | null
  totalAppraisals: number
  completed: number
  inReview: number
  draft: number
}

export interface DistTemplate {
  id: number
  code: string
  division?: string
  position?: string
  name: string
  dept?: string
}

export interface DistEmployee {
  id: number
  nip: string
  name: string
  dept: string
  division: string
  position: string
  sl: string | null
  hod: string | null
  hodiv: string | null
}

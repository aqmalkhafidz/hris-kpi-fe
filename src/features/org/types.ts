export interface Employee {
  id: number
  name: string
  initials: string
  email: string
  nip: string
  position: string
  dept: string
  div: string
  division: string
  manager: string
  squad: string | null
  grade: string
  status: 'active' | 'inactive' | 'probation' | 'onboarding'
  joined: string
}

export interface Department {
  id: number
  name: string
  division: string
  divId: number
  headId: number
  hod: string
  positions: number
  headcount: number
}

export interface Division {
  id: number
  name: string
  head: string
  headId: number
  headcount: number
  departments: string[]
}

export interface Position {
  id: number
  code: string
  title: string
  level: string
  dept: string
  template: string
  headcount: number
}

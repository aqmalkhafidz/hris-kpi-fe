export type CycleStatus = 'active' | 'draft' | 'closed'

export interface Cycle {
  id: string
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
  id: string
  code: string
  division: string
  position: string
  name: string
}

export interface DistEmployee {
  id: string
  nip: string
  name: string
  dept: string
  division: string
  position: string
  sl: string | null
  hod: string | null
  hodiv: string | null
}

export const CYCLES: Cycle[] = [
  {
    id: 'cyc1', name: 'Q1 2026 Appraisal',
    startDate: '2026-01-01', endDate: '2026-03-31',
    selfDeadline: '2026-03-24', status: 'active',
    description: 'Performance review Q1 2026 · semua divisi',
    distributedAt: '2026-01-08', totalAppraisals: 248,
    completed: 28, inReview: 124, draft: 96,
  },
  {
    id: 'cyc2', name: 'Q4 2025 Appraisal',
    startDate: '2025-10-01', endDate: '2025-12-31',
    selfDeadline: '2025-12-22', status: 'closed',
    description: 'Year-end review · ditutup 12 Jan 2026',
    distributedAt: '2025-10-06', totalAppraisals: 231,
    completed: 231, inReview: 0, draft: 0,
  },
  {
    id: 'cyc3', name: 'Mid-Year 2026 (H1)',
    startDate: '2026-04-01', endDate: '2026-06-30',
    selfDeadline: '2026-06-22', status: 'draft',
    description: 'Mid-year check-in · belum didistribusikan',
    distributedAt: null, totalAppraisals: 0,
    completed: 0, inReview: 0, draft: 0,
  },
  {
    id: 'cyc4', name: 'Probation Reviews · Mar 2026',
    startDate: '2026-03-01', endDate: '2026-03-31',
    selfDeadline: '2026-03-25', status: 'active',
    description: 'Karyawan probasi · 7 orang dalam scope',
    distributedAt: '2026-03-02', totalAppraisals: 7,
    completed: 2, inReview: 4, draft: 1,
  },
]

export const DIST_TEMPLATES: DistTemplate[] = [
  { id: 'tpl1', code: 'ENG-SE-V3', division: 'Technology', position: 'Software Engineer',        name: 'Engineering · SWE · v3' },
  { id: 'tpl2', code: 'ENG-SR-V2', division: 'Technology', position: 'Senior Software Engineer', name: 'Engineering · Senior SWE · v2' },
  { id: 'tpl3', code: 'PRD-PM-V3', division: 'Technology', position: 'Product Manager',          name: 'Product · PM · v3' },
  { id: 'tpl4', code: 'DES-PD-V2', division: 'Technology', position: 'Product Designer',         name: 'Design · Product Designer · v2' },
  { id: 'tpl5', code: 'MKT-GM-V1', division: 'Business',   position: 'Growth Marketer',          name: 'Marketing · Growth · v1' },
  { id: 'tpl6', code: 'FIN-AC-V1', division: 'Corporate',  position: 'Accountant',               name: 'Finance · Accountant · v1' },
]

export const DIST_EMPLOYEES: DistEmployee[] = [
  { id: 'u1',  nip: 'EMP-2021-0341', name: 'Andi Pratama',   dept: 'Engineering', division: 'Technology', position: 'Software Engineer',        sl: 'Budi Santoso', hod: 'Citra Dewi',    hodiv: 'Deni Wahyudi' },
  { id: 'u2',  nip: 'EMP-2020-0218', name: 'Budi Santoso',   dept: 'Engineering', division: 'Technology', position: 'Senior Software Engineer', sl: null,           hod: 'Citra Dewi',    hodiv: 'Deni Wahyudi' },
  { id: 'u3',  nip: 'EMP-2018-0042', name: 'Citra Dewi',     dept: 'Engineering', division: 'Technology', position: 'Engineering Manager',      sl: null,           hod: null,            hodiv: 'Deni Wahyudi' },
  { id: 'u5',  nip: 'EMP-2019-0188', name: 'Eka Rahayu',     dept: 'People (HR)', division: 'Corporate',  position: 'HR Manager',               sl: null,           hod: null,            hodiv: null },
  { id: 'e6',  nip: 'EMP-2022-0420', name: 'Fani Lestari',   dept: 'Engineering', division: 'Technology', position: 'Software Engineer',        sl: 'Budi Santoso', hod: 'Citra Dewi',    hodiv: 'Deni Wahyudi' },
  { id: 'e7',  nip: 'EMP-2023-0815', name: 'Gilang Nugraha', dept: 'Engineering', division: 'Technology', position: 'Software Engineer',        sl: 'Budi Santoso', hod: 'Citra Dewi',    hodiv: 'Deni Wahyudi' },
  { id: 'e8',  nip: 'EMP-2022-0512', name: 'Hana Wijaya',    dept: 'Design',      division: 'Technology', position: 'Product Designer',         sl: 'Naomi Salim',  hod: 'Naomi Salim',   hodiv: 'Deni Wahyudi' },
  { id: 'e9',  nip: 'EMP-2023-0701', name: 'Irfan Maulana',  dept: 'Marketing',   division: 'Business',   position: 'Growth Marketer',          sl: 'Tania K.',     hod: 'Tania K.',      hodiv: 'Indah R.' },
  { id: 'e10', nip: 'EMP-2019-0305', name: 'Jasmine Putri',  dept: 'Product',     division: 'Technology', position: 'Product Manager',          sl: null,           hod: 'Jasmine Putri', hodiv: 'Deni Wahyudi' },
  { id: 'e11', nip: 'EMP-2024-0903', name: 'Kirana Andini',  dept: 'Finance',     division: 'Corporate',  position: 'Accountant',               sl: 'Maya S.',      hod: 'Maya S.',       hodiv: 'Eka Rahayu' },
  { id: 'e12', nip: 'EMP-2025-1102', name: 'Levi Pranata',   dept: 'Engineering', division: 'Technology', position: 'Software Engineer',        sl: 'Citra Dewi',   hod: 'Citra Dewi',    hodiv: 'Deni Wahyudi' },
]

export const INITIAL_DISTRIBUTED: Record<string, string[]> = {
  cyc1: ['u1', 'u2', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12'],
  cyc2: ['u1', 'u2', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12'],
  cyc3: [],
  cyc4: ['e11'],
}

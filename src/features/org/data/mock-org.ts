export interface Employee {
  id: string
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
  id: string
  name: string
  division: string
  divId: string
  headId: string
  hod: string
  positions: number
  headcount: number
}

export interface Division {
  id: string
  name: string
  head: string
  headId: string
  headcount: number
  departments: string[]
}

export interface Position {
  id: string
  code: string
  title: string
  level: string
  dept: string
  template: string
  headcount: number
}

export const DIVISIONS: Division[] = [
  { id: 'div1', name: 'Technology', head: 'Deni Wahyudi', headId: 'u4', headcount: 134, departments: ['Engineering', 'Product', 'Design', 'QA'] },
  { id: 'div2', name: 'Business',   head: 'Indah R.',     headId: 'b1', headcount: 68,  departments: ['Marketing', 'Sales', 'Customer Care'] },
  { id: 'div3', name: 'Operations', head: 'Yusuf P.',     headId: 'o1', headcount: 47,  departments: ['Logistics', 'Procurement'] },
  { id: 'div4', name: 'Corporate',  head: 'Eka Rahayu',   headId: 'u5', headcount: 26,  departments: ['Finance', 'People (HR)', 'Legal'] },
]

export const DEPARTMENTS: Department[] = [
  { id: 'dept1', name: 'Engineering',   division: 'Technology', divId: 'div1', headId: 'u3',  hod: 'Citra Dewi',   positions: 6, headcount: 84 },
  { id: 'dept2', name: 'Product',       division: 'Technology', divId: 'div1', headId: 'e10', hod: 'Jasmine Putri',positions: 4, headcount: 32 },
  { id: 'dept3', name: 'Design',        division: 'Technology', divId: 'div1', headId: 'd1',  hod: 'Naomi Salim',  positions: 3, headcount: 18 },
  { id: 'dept4', name: 'Marketing',     division: 'Business',   divId: 'div2', headId: 'm1',  hod: 'Tania K.',     positions: 5, headcount: 21 },
  { id: 'dept5', name: 'Sales',         division: 'Business',   divId: 'div2', headId: 's1',  hod: 'Rangga P.',    positions: 5, headcount: 27 },
  { id: 'dept6', name: 'Customer Care', division: 'Business',   divId: 'div2', headId: 'c1',  hod: 'Aulia H.',     positions: 3, headcount: 20 },
  { id: 'dept7', name: 'Finance',       division: 'Corporate',  divId: 'div4', headId: 'f1',  hod: 'Maya S.',      positions: 4, headcount: 14 },
  { id: 'dept8', name: 'People (HR)',   division: 'Corporate',  divId: 'div4', headId: 'u5',  hod: 'Eka Rahayu',   positions: 3, headcount: 12 },
]

export const POSITIONS: Position[] = [
  { id: 'p1', code: 'ENG-SE-1', title: 'Software Engineer',        level: 'IC2', dept: 'Engineering', template: 'Engineering · Software Engineer · v3', headcount: 34 },
  { id: 'p2', code: 'ENG-SR-1', title: 'Senior Software Engineer', level: 'IC3', dept: 'Engineering', template: 'Engineering · Senior SWE · v2',        headcount: 18 },
  { id: 'p3', code: 'ENG-EM-1', title: 'Engineering Manager',      level: 'M2',  dept: 'Engineering', template: 'Engineering · Eng Manager · v2',       headcount: 6  },
  { id: 'p4', code: 'PRD-PM-1', title: 'Product Manager',          level: 'M1',  dept: 'Product',     template: 'Product · PM · v3',                    headcount: 9  },
  { id: 'p5', code: 'DES-PD-1', title: 'Product Designer',         level: 'IC2', dept: 'Design',      template: 'Design · Product Designer · v2',      headcount: 11 },
  { id: 'p6', code: 'MKT-GM-1', title: 'Growth Marketer',          level: 'IC2', dept: 'Marketing',   template: 'Marketing · Growth · v1',              headcount: 8  },
  { id: 'p7', code: 'FIN-AC-1', title: 'Accountant',               level: 'IC2', dept: 'Finance',     template: 'Finance · Accountant · v1',            headcount: 6  },
]

export const EMPLOYEES: Employee[] = [
  { id: 'u1',  nip: 'EMP-2021-0341', name: 'Andi Pratama',   initials: 'AP', email: 'andi@performa.id',    position: 'Software Engineer',        dept: 'Engineering', div: 'Technology', division: 'Technology', manager: 'Budi Santoso', squad: 'Cart & Checkout', grade: 'IC2', status: 'active',     joined: 'Aug 2021' },
  { id: 'u2',  nip: 'EMP-2020-0218', name: 'Budi Santoso',   initials: 'BS', email: 'budi@performa.id',    position: 'Senior Software Engineer', dept: 'Engineering', div: 'Technology', division: 'Technology', manager: 'Citra Dewi',   squad: 'Cart & Checkout', grade: 'IC3', status: 'active',     joined: 'Jan 2020' },
  { id: 'u3',  nip: 'EMP-2018-0042', name: 'Citra Dewi',     initials: 'CD', email: 'citra@performa.id',   position: 'Engineering Manager',      dept: 'Engineering', div: 'Technology', division: 'Technology', manager: 'Deni Wahyudi', squad: null,              grade: 'M2',  status: 'active',     joined: 'May 2018' },
  { id: 'u4',  nip: 'EMP-2017-0010', name: 'Deni Wahyudi',   initials: 'DW', email: 'deni@performa.id',    position: 'Head of Division',         dept: 'Technology',  div: 'Technology', division: 'Technology', manager: '',             squad: null,              grade: 'M3',  status: 'active',     joined: 'Mar 2017' },
  { id: 'u5',  nip: 'EMP-2019-0188', name: 'Eka Rahayu',     initials: 'ER', email: 'eka@performa.id',     position: 'HR Manager',               dept: 'People (HR)', div: 'Corporate',  division: 'Corporate',  manager: '',             squad: null,              grade: 'M2',  status: 'active',     joined: 'Jul 2019' },
  { id: 'e6',  nip: 'EMP-2022-0420', name: 'Fani Lestari',   initials: 'FL', email: 'fani@performa.id',    position: 'Software Engineer',        dept: 'Engineering', div: 'Technology', division: 'Technology', manager: 'Budi Santoso', squad: 'Cart & Checkout', grade: 'IC1', status: 'active',     joined: 'Jun 2022' },
  { id: 'e7',  nip: 'EMP-2023-0815', name: 'Gilang Nugraha', initials: 'GN', email: 'gilang@performa.id',  position: 'Software Engineer',        dept: 'Engineering', div: 'Technology', division: 'Technology', manager: 'Budi Santoso', squad: 'Platform',        grade: 'IC2', status: 'active',     joined: 'Sep 2023' },
  { id: 'e8',  nip: 'EMP-2022-0512', name: 'Hana Wijaya',    initials: 'HW', email: 'hana@performa.id',    position: 'Product Designer',         dept: 'Design',      div: 'Technology', division: 'Technology', manager: 'Naomi Salim',  squad: null,              grade: 'IC1', status: 'active',     joined: 'Mar 2022' },
  { id: 'e9',  nip: 'EMP-2023-0701', name: 'Irfan Maulana',  initials: 'IM', email: 'irfan@performa.id',   position: 'Growth Marketer',          dept: 'Marketing',   div: 'Business',   division: 'Business',   manager: 'Tania K.',     squad: null,              grade: 'IC2', status: 'active',     joined: 'Feb 2023' },
  { id: 'e10', nip: 'EMP-2019-0305', name: 'Jasmine Putri',  initials: 'JP', email: 'jasmine@performa.id', position: 'Product Manager',          dept: 'Product',     div: 'Technology', division: 'Technology', manager: 'Deni Wahyudi', squad: null,              grade: 'M1',  status: 'active',     joined: 'Nov 2019' },
  { id: 'e11', nip: 'EMP-2024-0903', name: 'Kirana Andini',  initials: 'KA', email: 'kirana@performa.id',  position: 'Accountant',               dept: 'Finance',     div: 'Corporate',  division: 'Corporate',  manager: 'Maya S.',      squad: null,              grade: 'IC2', status: 'probation',  joined: 'Nov 2024' },
  { id: 'e12', nip: 'EMP-2025-1102', name: 'Levi Pranata',   initials: 'LP', email: 'levi@performa.id',    position: 'Software Engineer',        dept: 'Engineering', div: 'Technology', division: 'Technology', manager: 'Citra Dewi',   squad: 'Infra',           grade: 'IC1', status: 'onboarding', joined: 'Jan 2026' },
]

function genId(prefix: string) {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function initialsOf(name: string): string {
  return name.split(' ').map(part => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export function upsertDivision(form: Omit<Division, 'id'>, id?: string): Division[] {
  if (id) {
    const idx = DIVISIONS.findIndex(d => d.id === id)
    if (idx !== -1) DIVISIONS[idx] = { ...DIVISIONS[idx], ...form, id }
  } else {
    DIVISIONS.push({ ...form, id: genId('div') })
  }
  return [...DIVISIONS]
}

export function deleteDivision(id: string): Division[] {
  const idx = DIVISIONS.findIndex(d => d.id === id)
  if (idx !== -1) DIVISIONS.splice(idx, 1)
  return [...DIVISIONS]
}

export function upsertDepartment(form: Omit<Department, 'id'>, id?: string): Department[] {
  if (id) {
    const idx = DEPARTMENTS.findIndex(d => d.id === id)
    if (idx !== -1) DEPARTMENTS[idx] = { ...DEPARTMENTS[idx], ...form, id }
  } else {
    DEPARTMENTS.push({ ...form, id: genId('dept') })
  }
  return [...DEPARTMENTS]
}

export function deleteDepartment(id: string): Department[] {
  const idx = DEPARTMENTS.findIndex(d => d.id === id)
  if (idx !== -1) DEPARTMENTS.splice(idx, 1)
  return [...DEPARTMENTS]
}

export function upsertPosition(form: Omit<Position, 'id'>, id?: string): Position[] {
  if (id) {
    const idx = POSITIONS.findIndex(p => p.id === id)
    if (idx !== -1) POSITIONS[idx] = { ...POSITIONS[idx], ...form, id }
  } else {
    POSITIONS.push({ ...form, id: genId('pos') })
  }
  return [...POSITIONS]
}

export function deletePosition(id: string): Position[] {
  const idx = POSITIONS.findIndex(p => p.id === id)
  if (idx !== -1) POSITIONS.splice(idx, 1)
  return [...POSITIONS]
}

export function upsertEmployee(form: Omit<Employee, 'id' | 'initials'>, id?: string): Employee[] {
  if (id) {
    const idx = EMPLOYEES.findIndex(e => e.id === id)
    if (idx !== -1) EMPLOYEES[idx] = { ...EMPLOYEES[idx], ...form, id, initials: initialsOf(form.name) }
  } else {
    EMPLOYEES.push({ ...form, id: genId('emp'), initials: initialsOf(form.name) })
  }
  return [...EMPLOYEES]
}

export function deleteEmployee(id: string): Employee[] {
  const idx = EMPLOYEES.findIndex(e => e.id === id)
  if (idx !== -1) EMPLOYEES.splice(idx, 1)
  return [...EMPLOYEES]
}

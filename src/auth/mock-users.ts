export type UserRole = 'staff' | 'sl' | 'hodept' | 'hodiv' | 'hr'

export interface MockUser {
  id: string
  name: string
  initials: string
  email: string
  role: UserRole
  dept: string
  div?: string
  squad: string | null
  position: string
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    name: 'Andi Pratama',
    initials: 'AP',
    email: 'andi@performa.id',
    role: 'staff',
    dept: 'Engineering',
    div: 'Technology',
    squad: 'Cart & Checkout',
    position: 'Software Engineer · IC2',
  },
  {
    id: 'u2',
    name: 'Budi Santoso',
    initials: 'BS',
    email: 'budi@performa.id',
    role: 'sl',
    dept: 'Engineering',
    div: 'Technology',
    squad: 'Cart & Checkout',
    position: 'Squad Leader · IC3',
  },
  {
    id: 'u3',
    name: 'Citra Dewi',
    initials: 'CD',
    email: 'citra@performa.id',
    role: 'hodept',
    dept: 'Engineering',
    div: 'Technology',
    squad: null,
    position: 'Head of Department',
  },
  {
    id: 'u4',
    name: 'Deni Wahyudi',
    initials: 'DW',
    email: 'deni@performa.id',
    role: 'hodiv',
    dept: 'Technology',
    div: 'Technology',
    squad: null,
    position: 'Head of Division',
  },
  {
    id: 'u5',
    name: 'Eka Rahayu',
    initials: 'ER',
    email: 'eka@performa.id',
    role: 'hr',
    dept: 'HR',
    div: 'Corporate',
    squad: null,
    position: 'HR Manager',
  },
]

export const ROLE_LABELS: Record<UserRole, string> = {
  staff:  'Employee',
  sl:     'Squad Leader',
  hodept: 'Head of Department',
  hodiv:  'Head of Division',
  hr:     'HR Manager',
}

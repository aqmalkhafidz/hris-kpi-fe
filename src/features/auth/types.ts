export type UserRole = 'staff' | 'sl' | 'hodept' | 'hodiv' | 'hr'

export interface AppUser {
  id: number
  name: string
  initials: string
  email: string
  role: UserRole
  dept: string
  div?: string | null
  squad: string | null
  position: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  staff:  'Employee',
  sl:     'Squad Leader',
  hodept: 'Head of Department',
  hodiv:  'Head of Division',
  hr:     'HR Manager',
}

export interface HistoryScope {
  userIds: number[]
  label: string
}

export function getHistoryScope(user: AppUser, users: AppUser[]): HistoryScope {
  switch (user.role) {
    case 'staff':
      return { userIds: [user.id], label: 'Your appraisal history' }
    case 'sl':
      return { userIds: users.filter(u => u.squad && u.squad === user.squad).map(u => u.id), label: `Squad history · ${user.squad ?? '—'}` }
    case 'hodept':
      return { userIds: users.filter(u => u.dept === user.dept).map(u => u.id), label: `Department history · ${user.dept}` }
    case 'hodiv':
      return { userIds: users.filter(u => u.div && u.div === user.div).map(u => u.id), label: `Division history · ${user.div ?? '—'}` }
    case 'hr':
      return { userIds: users.map(u => u.id), label: 'All employees · HR view' }
  }
}

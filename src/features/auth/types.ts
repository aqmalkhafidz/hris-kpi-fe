export type UserRole = 'staff' | 'sl' | 'hodept' | 'hodiv' | 'hr';

export interface AppUser {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  nip: string | null;
  dept: string | null;
  div: string | null;
  squad: string | null;
  position: string | null;
  avatarUrl: string | null;
  phone: string | null;
  emergencyName: string | null;
  emergencyPhone: string | null;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  staff: 'Employee',
  sl: 'Squad Leader',
  hodept: 'Head of Department',
  hodiv: 'Head of Division',
  hr: 'HR Manager',
};

import { api, clearAuthSession } from '@shared/api/client';
import type { AppUser } from '../types';

export async function loginWithPassword(email: string, password: string) {
  const result = await api<{ user: AppUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return result.user;
}

export async function fetchMe() {
  return api<{ user: AppUser }>('/auth/me').then((result) => result.user);
}

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string
) {
  return api<{ ok: boolean }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function uploadAvatarApi(file: File) {
  const form = new FormData();
  form.append('file', file);
  return api<{ avatarUrl: string }>('/auth/avatar', {
    method: 'POST',
    body: form,
  });
}

export interface ContactPatch {
  phone?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
}

export async function updateContactApi(patch: ContactPatch) {
  return api<{
    phone: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
  }>('/auth/me/contact', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function logoutApi() {
  await api<{ ok: boolean }>('/auth/logout', { method: 'POST' }).catch(() => ({
    ok: true,
  }));
  clearAuthSession();
}

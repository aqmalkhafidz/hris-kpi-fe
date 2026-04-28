import { api, clearToken, setToken } from '@shared/api/client';
import type { AppUser } from '../types';

export async function loginWithPassword(email: string, password: string) {
  const result = await api<{ token: string; user: AppUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(result.token);
  return result.user;
}

export async function fetchMe() {
  return api<{ user: AppUser }>('/auth/me').then((result) => result.user);
}

export async function fetchDemoUsers() {
  return api<AppUser[]>('/auth/demo-users');
}

export async function logoutApi() {
  clearToken();
  return api<{ ok: boolean }>('/auth/logout', { method: 'POST' }).catch(() => ({
    ok: true,
  }));
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'hris_auth_token';
const AUTH_CLEARED_EVENT = 'hris-auth-cleared';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAuthSession() {
  clearToken();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CLEARED_EVENT));
  }
}

export function onAuthCleared(listener: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(AUTH_CLEARED_EVENT, listener);
  return () => window.removeEventListener(AUTH_CLEARED_EVENT, listener);
}

export function resolveApiUrl(path: string) {
  return path.startsWith('http') ? path : `${API_URL}${path}`;
}

function buildHeaders(init: RequestInit) {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(resolveApiUrl(path), {
    ...init,
    headers: buildHeaders(init),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(response.status, body?.error ?? 'Request failed');
  return body as T;
}

export async function apiBlob(
  path: string,
  init: RequestInit = {}
): Promise<Blob> {
  const response = await fetch(resolveApiUrl(path), {
    ...init,
    headers: buildHeaders(init),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.error ?? 'Request failed');
  }
  return response.blob();
}

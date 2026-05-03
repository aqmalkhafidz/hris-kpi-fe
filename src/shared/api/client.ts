const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const AUTH_CLEARED_EVENT = 'hris-auth-cleared';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function clearAuthSession() {
  csrfToken = null;
  csrfTokenRequest = null;
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

function isUnsafeMethod(method: string | undefined) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    (method ?? 'GET').toUpperCase()
  );
}

async function fetchCsrfToken() {
  if (csrfToken) return csrfToken;
  csrfTokenRequest ??= fetch(resolveApiUrl('/auth/csrf'), {
    credentials: 'include',
  })
    .then(async (response) => {
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new ApiError(response.status, body?.error ?? 'Request failed');
      }
      if (!body?.csrfToken) throw new ApiError(500, 'Missing CSRF token');
      csrfToken = String(body.csrfToken);
      return csrfToken as string;
    })
    .finally(() => {
      csrfTokenRequest = null;
    });
  return csrfTokenRequest;
}

async function buildHeaders(init: RequestInit) {
  const headers = new Headers(init.headers);
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  )
    headers.set('Content-Type', 'application/json');
  if (isUnsafeMethod(init.method)) {
    headers.set(CSRF_HEADER_NAME, await fetchCsrfToken());
  }
  return headers;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(resolveApiUrl(path), {
    ...init,
    credentials: 'include',
    headers: await buildHeaders(init),
  });
  const body = await response.json().catch(() => null);
  if (
    response.status === 403 &&
    body?.error === 'Invalid CSRF token' &&
    isUnsafeMethod(init.method)
  ) {
    csrfToken = null;
    const retry = await fetch(resolveApiUrl(path), {
      ...init,
      credentials: 'include',
      headers: await buildHeaders(init),
    });
    const retryBody = await retry.json().catch(() => null);
    if (!retry.ok)
      throw new ApiError(retry.status, retryBody?.error ?? 'Request failed');
    return retryBody as T;
  }
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
    credentials: 'include',
    headers: await buildHeaders(init),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.error ?? 'Request failed');
  }
  return response.blob();
}

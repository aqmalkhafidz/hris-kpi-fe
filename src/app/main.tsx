import { AuthProvider, useAuth } from '@features/auth/context/auth-context';
import { ApiError, clearAuthSession, getToken } from '@shared/api/client';
import { applyTheme, getInitialTheme } from '@shared/lib/theme';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { router } from './router';
import '../styles/friendly.css';

applyTheme(getInitialTheme());

function handleUnauthorized(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 401 || !getToken())
    return;
  clearAuthSession();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleUnauthorized,
  }),
  mutationCache: new MutationCache({
    onError: handleUnauthorized,
  }),
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function InnerApp() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-[#0b0e14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

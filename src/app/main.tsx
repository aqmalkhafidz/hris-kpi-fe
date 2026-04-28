import { AuthProvider, useAuth } from '@features/auth/context/auth-context';
import { applyTheme, getInitialTheme } from '@shared/lib/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { router } from './router';
import '../styles/friendly.css';

applyTheme(getInitialTheme());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function InnerApp() {
  const auth = useAuth();
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

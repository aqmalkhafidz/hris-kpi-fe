import { ApiError, onAuthCleared } from '@shared/api/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { fetchMe, loginWithPassword, logoutApi } from '../api/auth-api';
import type { AppUser } from '../types';

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      onAuthCleared(() => {
        queryClient.cancelQueries({ queryKey: ['me'] });
        queryClient.setQueryData(['me'], null);
      }),
    [queryClient]
  );

  const { data: user = null, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () =>
      fetchMe().catch((error) => {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }),
    retry: false,
  });

  const login = async (email: string, password: string) => {
    await loginWithPassword(email, password);
    const fullProfile = await fetchMe();
    queryClient.setQueryData(['me'], fullProfile);
    return fullProfile;
  };

  const logout = async () => {
    await logoutApi();
    queryClient.setQueryData(['me'], null);
  };

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { clearAuthSession, getToken, onAuthCleared } from '@shared/api/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { fetchMe, loginWithPassword, logoutApi } from '../api/auth-api';
import type { AppUser } from '../types';

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasToken, setHasToken] = useState(() => !!getToken());
  const queryClient = useQueryClient();

  useEffect(
    () =>
      onAuthCleared(() => {
        setHasToken(false);
        queryClient.removeQueries({ queryKey: ['me'] });
      }),
    [queryClient]
  );

  const { data: user = null, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () =>
      fetchMe().catch(() => {
        clearAuthSession();
        return null;
      }),
    enabled: hasToken,
    retry: false,
  });

  const login = async (email: string, password: string) => {
    await loginWithPassword(email, password);
    setHasToken(true);
    const fullProfile = await fetchMe();
    queryClient.setQueryData(['me'], fullProfile);
    return fullProfile;
  };

  const logout = () => {
    logoutApi();
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ['me'] });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading: hasToken && isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

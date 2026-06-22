import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { authService, getBackendMode, supabase, type AuthUser, type ServiceResult } from '../services';

type AuthStatus = 'loading' | 'authenticated' | 'guest';

type AuthContextValue = {
  status: AuthStatus;
  backendMode: ReturnType<typeof getBackendMode>;
  user: AuthUser | null;
  isAuthenticated: boolean;
  register: (email: string, password: string) => Promise<ServiceResult<AuthUser>>;
  login: (email: string, password: string) => Promise<ServiceResult<AuthUser>>;
  forgotPassword: (email: string) => Promise<ServiceResult<boolean>>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<ServiceResult<boolean>>;
  logout: () => Promise<ServiceResult<boolean>>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const backendMode = getBackendMode();

  async function refreshSession() {
    setStatus('loading');
    const currentUser = await authService.getCurrentUser();

    setUser(currentUser);
    setStatus(currentUser ? 'authenticated' : 'guest');
  }

  async function register(email: string, password: string) {
    const result = await authService.register(email, password);

    if (result.data) {
      setUser(result.data);
      setStatus('authenticated');
    }

    return result;
  }

  async function login(email: string, password: string) {
    const result = await authService.login(email, password);

    if (result.data) {
      setUser(result.data);
      setStatus('authenticated');
    }

    return result;
  }

  async function forgotPassword(email: string) {
    return authService.forgotPassword(email);
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    return authService.changePassword(currentPassword, newPassword);
  }

  async function logout() {
    const result = await authService.logout();

    if (!result.error) {
      setUser(null);
      setStatus('guest');
    }

    return result;
  }

  useEffect(() => {
    void refreshSession();

    if (!supabase) {
      return undefined;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;

      setUser(nextUser);
      setStatus(nextUser ? 'authenticated' : 'guest');
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      backendMode,
      user,
      isAuthenticated: status === 'authenticated',
      register,
      login,
      forgotPassword,
      changePassword,
      logout,
      refreshSession
    }),
    [backendMode, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

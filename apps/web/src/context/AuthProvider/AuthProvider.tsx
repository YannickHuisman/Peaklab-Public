import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { exportMock } from '@helpers/exportMock';
import type { User } from '@supabase/auth-js';

import type { UserProfile } from '@package/api';
import { AuthContext } from '@package/api';

const IS_OFFLINE = import.meta.env.VITE_OFFLINE === 'true';

const OFFLINE_USER = { id: 'offline', app_metadata: { role: 'admin' } } as unknown as User;
const OFFLINE_PROFILE = {
  email: 'offline@local',
  first_name: 'Offline',
  last_name: 'User',
} as unknown as UserProfile;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hasFetchedSession = useRef(false);

  useEffect(() => {
    if (IS_OFFLINE) {
      setUser(OFFLINE_USER);
      setProfile(OFFLINE_PROFILE);
      setIsAuthenticated(true);
      setLoading(false);
      hasFetchedSession.current = true;
      exportMock('auth.session', { user: OFFLINE_USER });
      exportMock('auth.profile', { profile: OFFLINE_PROFILE });

      return;
    }

    if (hasFetchedSession.current) return;
    hasFetchedSession.current = true;

    (async () => {
      try {
        const meRes = await authenticatedFetch('/api/auth/me');

        if (meRes.status === 401) {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);

          return;
        }

        const meData = await meRes.json();

        setUser(meData.user);
        setProfile(meData.profile ?? null);
        setIsAuthenticated(true);
        exportMock('auth.session', { user: meData.user });
        exportMock('auth.profile', { profile: meData.profile });
      } catch {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stableSetUser = useCallback((u: User | null) => setUser(u), []);
  const stableSetProfile = useCallback((p: UserProfile | null) => setProfile(p), []);
  const stableSetIsAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
    if (!value) hasFetchedSession.current = false;
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (IS_OFFLINE) return;
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      hasFetchedSession.current = false;
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser: stableSetUser,
      profile,
      setProfile: stableSetProfile,
      loading,
      isAuthenticated,
      setIsAuthenticated: stableSetIsAuthenticated,
    }),
    [
      user,
      profile,
      loading,
      isAuthenticated,
      stableSetUser,
      stableSetProfile,
      stableSetIsAuthenticated,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

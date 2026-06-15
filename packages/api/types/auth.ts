import type { User } from '@supabase/auth-js';

import type { UserProfile } from '@package/types';

export type { UserProfile, UserRole } from '@package/types';

export interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

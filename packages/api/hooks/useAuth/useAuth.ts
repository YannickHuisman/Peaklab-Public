import { useContext } from 'react';

import { apiUrl } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import { setAuthToken } from '../../tokenStore';
import type { UserProfile } from '../../types/auth';
import { authenticatedFetch } from '../../utils/authenticatedFetch';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, profile, setProfile, loading, isAuthenticated, setIsAuthenticated } =
    context;

  const fetchProfile = async () => {
    const response = await authenticatedFetch('/api/auth/profile');

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || 'Profile retrieval failed');
    }

    const data: { profile: UserProfile } = await response.json();

    setProfile(data.profile);
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();

    if (data.accessToken) setAuthToken(data.accessToken);
    setUser(data.user);
    setIsAuthenticated(true);
    await fetchProfile();
  };

  const signOut = async () => {
    const response = await authenticatedFetch('/api/auth/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || 'Logout failed');
    }

    setAuthToken(null);
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const register = async (email: string, password: string) => {
    const response = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || 'Registration failed');
    }

    return await response.json();
  };

  const role = user?.app_metadata?.role;
  const isAdmin = role === 'admin' || role === 'super_admin';

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    register,
    setProfile,
    isAdmin,
  };
};

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppLayout } from '@components/styled/AppLayout';

import { useAuth } from '@package/api';

interface ProtectedRouteProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function ProtectedRoute({ children, showNavbar = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AppLayout showNavbar={showNavbar}>{children}</AppLayout>;
}

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppLayout } from '@components/styled/AppLayout';

import { useAuth } from '@package/api';

import { SubscriptionGate } from '../SubscriptionGate';

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

  return (
    <SubscriptionGate>
      <AppLayout showNavbar={showNavbar}>{children}</AppLayout>
    </SubscriptionGate>
  );
}

import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@package/api';

import { ProtectedRoute } from '../ProtectedRoute';

export function ProtectedAdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProtectedRoute showNavbar={false}>
      <Outlet />
    </ProtectedRoute>
  );
}

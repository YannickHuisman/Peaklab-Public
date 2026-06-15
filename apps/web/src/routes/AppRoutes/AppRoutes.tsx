import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { AuthLayout } from '@pages/Auth/AuthLayout';
import { Login } from '@pages/Auth/Login';
import { Register } from '@pages/Auth/Register';

import { KeepAliveTabs } from '../KeepAliveTabs';
import { ProtectedAdminRoute } from '../ProtectedAdminRoute';
import { ProtectedRoute } from '../ProtectedRoute';

// Full-screen pages (no tab navbar)
const Profile = lazy(() => import('@pages/Profile').then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import('@pages/Settings').then((m) => ({ default: m.Settings })));

// Admin pages
const Admin = lazy(() => import('@pages/Admin').then((m) => ({ default: m.Admin })));
const BiomarkerConfig = lazy(() =>
  import('@pages/Admin/BiomarkerConfig').then((m) => ({ default: m.BiomarkerConfig }))
);
const UserManagement = lazy(() =>
  import('@pages/Admin/UserManagement').then((m) => ({ default: m.UserManagement }))
);
const PartnerManagement = lazy(() =>
  import('@pages/Admin/PartnerManagement').then((m) => ({ default: m.PartnerManagement }))
);
const UploadManagement = lazy(() =>
  import('@pages/Admin/UploadManagement').then((m) => ({ default: m.UploadManagement }))
);
const ApplicationManagement = lazy(() =>
  import('@pages/Admin/ApplicationManagement').then((m) => ({
    default: m.ApplicationManagement,
  }))
);
const LabManagement = lazy(() =>
  import('@pages/Admin/LabManagement').then((m) => ({ default: m.LabManagement }))
);

// Misc pages
const PartnerIntake = lazy(() =>
  import('@pages/PartnerIntake').then((m) => ({ default: m.PartnerIntake }))
);
const Onboarding = lazy(() => import('@pages/Onboarding').then((m) => ({ default: m.Onboarding })));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth — no layout, no auth required */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Full-screen pages — no tab navbar, back-button navigation */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute showNavbar={false}>
            <PageSuspense>
              <Profile />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute showNavbar={false}>
            <PageSuspense>
              <Settings />
            </PageSuspense>
          </ProtectedRoute>
        }
      />

      {/* Admin — no tab navbar (ProtectedAdminRoute sets showNavbar=false) */}
      <Route path="/admin" element={<ProtectedAdminRoute />}>
        <Route
          index
          element={
            <PageSuspense>
              <Admin />
            </PageSuspense>
          }
        />
        <Route
          path="biomarker-config"
          element={
            <PageSuspense>
              <BiomarkerConfig />
            </PageSuspense>
          }
        />
        <Route
          path="users"
          element={
            <PageSuspense>
              <UserManagement />
            </PageSuspense>
          }
        />
        <Route
          path="partners"
          element={
            <PageSuspense>
              <PartnerManagement />
            </PageSuspense>
          }
        />
        <Route
          path="applications"
          element={
            <PageSuspense>
              <ApplicationManagement />
            </PageSuspense>
          }
        />
        <Route
          path="uploads"
          element={
            <PageSuspense>
              <UploadManagement />
            </PageSuspense>
          }
        />
        <Route
          path="labs"
          element={
            <PageSuspense>
              <LabManagement />
            </PageSuspense>
          }
        />
      </Route>

      {/* Misc full-screen pages */}
      <Route
        path="/partner-intake"
        element={
          <PageSuspense>
            <PartnerIntake />
          </PageSuspense>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Onboarding />
            </PageSuspense>
          </ProtectedRoute>
        }
      />

      {/* Tab layout — handles /, /biomarkers/*, /performance, /community, /partners/*
          Tab pages are kept alive (mounted) after first visit so state is preserved
          when navigating to a detail page and back. */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <KeepAliveTabs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

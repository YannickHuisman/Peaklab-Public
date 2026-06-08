import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { AuthLayout } from '@pages/Auth/AuthLayout';
import { Login } from '@pages/Auth/Login';
import { Register } from '@pages/Auth/Register';
import { Home } from '@pages/Home';

import { ProtectedAdminRoute } from '../ProtectedAdminRoute';
import { ProtectedRoute } from '../ProtectedRoute';

// Lazy-loaded pages for code splitting
const Biomarkers = lazy(() => import('@pages/Biomarkers').then((m) => ({ default: m.Biomarkers })));
const BiomarkerDetail = lazy(() =>
  import('@pages/BiomarkerDetail').then((m) => ({ default: m.BiomarkerDetail }))
);
const Performance = lazy(() =>
  import('@pages/Performance').then((m) => ({ default: m.Performance }))
);
const Community = lazy(() => import('@pages/Community').then((m) => ({ default: m.Community })));
const DeepResearch = lazy(() =>
  import('@pages/DeepResearch').then((m) => ({ default: m.DeepResearch }))
);
const Partners = lazy(() => import('@pages/Partners').then((m) => ({ default: m.Partners })));
const Profile = lazy(() => import('@pages/Profile').then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import('@pages/Settings').then((m) => ({ default: m.Settings })));
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
const BloodResultUploads = lazy(() =>
  import('@pages/BloodResultUploads').then((m) => ({ default: m.BloodResultUploads }))
);
const PartnerIntake = lazy(() =>
  import('@pages/PartnerIntake').then((m) => ({ default: m.PartnerIntake }))
);

function PageSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biomarkers"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Biomarkers />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/biomarkers/:id"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <BiomarkerDetail />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deep-research"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <DeepResearch />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Performance />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Profile />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Settings />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Community />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/partners"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <Partners />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/uploads"
        element={
          <ProtectedRoute>
            <PageSuspense>
              <BloodResultUploads />
            </PageSuspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner-intake"
        element={
          <PageSuspense>
            <PartnerIntake />
          </PageSuspense>
        }
      />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

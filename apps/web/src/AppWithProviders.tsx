import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';

import { useAuth } from '@package/api';
import { theme } from '@package/ui';

import { AppDataProvider } from './context/AppDataProvider';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import { ModalProvider } from './context/ModalProvider';
import { SettingsProvider } from './context/SettingsProvider';
import { ToastProvider } from './context/ToastProvider';
import { ScrollManager } from './helpers/ScrollManager';
import { AppRoutes } from './routes/AppRoutes';

export function AppWithProviders() {
  return (
    <AuthProvider>
      <RootProviders />
    </AuthProvider>
  );
}

function RootProviders() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <BrowserRouter>
      <ScrollManager />
      <ThemeProvider theme={theme}>
        <SettingsProvider>
          <DataProvider>
            <AppDataProvider>
              <ToastProvider>
                <ModalProvider>
                  <AppRoutes />
                </ModalProvider>
              </ToastProvider>
            </AppDataProvider>
          </DataProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

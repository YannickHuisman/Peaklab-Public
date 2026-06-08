import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';

import { useAuth } from '@package/api';
import { theme } from '@package/ui';

import { AppDataProvider } from './context/AppDataProvider';
import { AuthProvider } from './context/AuthProvider';
import { DataProvider } from './context/DataProvider';
import { ModalProvider } from './context/ModalProvider';
import { SettingsProvider } from './context/SettingsProvider';
import { ScrollToTop } from './helpers/ScrollToTop';
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
      <ScrollToTop />
      <ThemeProvider theme={theme}>
        <SettingsProvider>
          <DataProvider>
            <AppDataProvider>
              <ModalProvider>
                <AppRoutes />
              </ModalProvider>
            </AppDataProvider>
          </DataProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

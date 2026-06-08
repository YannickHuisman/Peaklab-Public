import { type ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { Navbar, StyledMobileNavbarSpacer } from '@components/Navbar';

import { useAppData, useAuth, useData } from '@package/api';

import { useDeviceBreakpoints } from '../../../hooks/useDeviceBreakpoints';
import { EnforcedPageWidth, StyledLayoutContainer } from '../layout';
import { StyledMainContent } from './styles';

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function AppLayout({ children, showNavbar = true }: AppLayoutProps) {
  const { loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();
  const { loading: appDataLoading } = useAppData();
  const { isMobile, isTablet } = useDeviceBreakpoints();
  const location = useLocation();

  const showMobileNav = isMobile || isTablet;
  const isDashboard = location.pathname === '/';

  const isLoading = useMemo(
    () => authLoading || dataLoading || appDataLoading,
    [authLoading, dataLoading, appDataLoading]
  );

  const useHeroBackground = isDashboard && showMobileNav && isLoading;

  return (
    <StyledLayoutContainer $heroBackground={useHeroBackground}>
      {showNavbar && <Navbar />}
      <EnforcedPageWidth style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <StyledMainContent>{isLoading ? <Loader /> : children}</StyledMainContent>
        {showNavbar && showMobileNav && <StyledMobileNavbarSpacer />}
      </EnforcedPageWidth>
    </StyledLayoutContainer>
  );
}

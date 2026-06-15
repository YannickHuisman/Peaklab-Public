import { type ReactNode, useMemo } from 'react';

import { Loader } from '@components/Loader';
import { Navbar, StyledMobileNavbarSpacer } from '@components/Navbar';

import { useAppData, useAuth, useData } from '@package/api';

import { useDeviceBreakpoints } from '../../../hooks/useDeviceBreakpoints';
import { EnforcedPageWidth, StyledLayoutContainer } from '../layout';
import { StyledMainContent, StyledSkipLink } from './styles';

interface AppLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function AppLayout({ children, showNavbar = true }: AppLayoutProps) {
  const { loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();
  const { loading: appDataLoading } = useAppData();
  const { isMobile, isTablet } = useDeviceBreakpoints();

  const showMobileNav = isMobile || isTablet;

  const isLoading = useMemo(
    () => authLoading || dataLoading || appDataLoading,
    [authLoading, dataLoading, appDataLoading]
  );

  return (
    <StyledLayoutContainer>
      <StyledSkipLink href="#main-content">Naar hoofdinhoud</StyledSkipLink>
      {showNavbar && <Navbar />}
      <EnforcedPageWidth style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <StyledMainContent id="main-content" tabIndex={-1} $showNavbar={showNavbar}>
          {isLoading && <Loader />}
          {!isLoading && children}
        </StyledMainContent>
        {showNavbar && showMobileNav && <StyledMobileNavbarSpacer />}
      </EnforcedPageWidth>
    </StyledLayoutContainer>
  );
}

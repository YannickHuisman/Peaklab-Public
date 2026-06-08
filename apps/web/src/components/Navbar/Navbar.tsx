import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { DropdownMenuItem } from '@components/DropdownMenu';
import { DropdownMenu } from '@components/DropdownMenu';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import { useAuth } from '@package/api';
import { theme } from '@package/ui';

import { useDeviceBreakpoints } from '../../hooks/useDeviceBreakpoints';
import { NAV_ITEMS } from './constants';
import { MobileNavbar } from './MobileNavbar';
import { NotificationDropdown } from './NotificationDropdown';
import {
  StyledDesktopNav,
  StyledLogo,
  StyledMobileNavbarSpacer,
  StyledNavbarContainer,
  StyledNavbarInner,
  StyledNavLink,
  StyledNavPills,
} from './styles';

const SCROLL_THRESHOLD = 80;

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();
  const { isMobile, isTablet } = useDeviceBreakpoints();
  const { t } = useTranslation();

  const showMobileNav = isMobile || isTablet;
  const isDashboard = location.pathname === '/';
  const heroMode = isDashboard && showMobileNav;

  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD);

  useEffect(() => {
    if (!heroMode) return;

    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [heroMode]);

  const profileItems: DropdownMenuItem[] = useMemo(
    () => [
      {
        label: t('Profiel'),
        icon: <Icons.User size={20} color={theme.colors.text.primary} />,
        onClick: () => navigate('/profile'),
      },
      {
        label: t('Instellingen'),
        icon: <Icons.Settings size={20} color={theme.colors.text.primary} />,
        onClick: () => navigate('/settings'),
      },
      ...(isAdmin
        ? [
            {
              label: t('Admin Panel'),
              icon: <Icons.Shield size={20} color={theme.colors.text.primary} />,
              onClick: () => navigate('/admin'),
            },
          ]
        : []),
      {
        label: t('Uitloggen'),
        icon: <Icons.LogOut size={20} color={theme.colors.text.primary} />,
        onClick: () => signOut(),
        danger: true,
      },
    ],
    [signOut, isAdmin, navigate, t]
  );

  const isHeroActive = heroMode && !scrolled;

  const textColor = isHeroActive ? theme.colors.text.inverse : theme.colors.text.primary;

  const profileTrigger = useMemo(() => <Icons.User color={textColor} />, [textColor]);

  return (
    <>
      <StyledNavbarContainer $heroMode={isHeroActive}>
        <StyledNavbarInner $isMobile={showMobileNav}>
          <FlexRow $align="center">
            <StyledLogo
              src="/icoon-logo-zwart-transparant.svg"
              alt="PeakLab Logo"
              $heroMode={isHeroActive}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <FlexRow onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <Heading $size="medium" $weight={800} $color={textColor}>
                PEAK
              </Heading>
              <Heading $size="medium" $weight={500} $color={textColor}>
                LAB
              </Heading>
            </FlexRow>
          </FlexRow>

          <StyledDesktopNav $hidden={showMobileNav}>
            <StyledNavPills>
              {NAV_ITEMS.map((item) => (
                <StyledNavLink key={item.to} to={item.to} end={item.end}>
                  {t(item.label)}
                </StyledNavLink>
              ))}
            </StyledNavPills>
          </StyledDesktopNav>

          <FlexRow $align="center" $justify="flex-end" $gap="sm">
            <NotificationDropdown iconColor={textColor} isAdmin={isAdmin} />
            <DropdownMenu trigger={profileTrigger} items={profileItems} align="right" />
          </FlexRow>
        </StyledNavbarInner>
      </StyledNavbarContainer>

      {showMobileNav && <MobileNavbar heroMode={isHeroActive} />}
    </>
  );
}

// Export spacer component for use in page layouts to prevent content from being hidden behind mobile navbar
export { StyledMobileNavbarSpacer };

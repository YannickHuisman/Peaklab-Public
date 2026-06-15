import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { DropdownMenuItem } from '@components/DropdownMenu';
import { DropdownMenu } from '@components/DropdownMenu';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { FlexRow } from '@components/styled/layout';
import { formatDate } from '@helpers/formatDate';
import { useTranslation } from '@helpers/i18n';

import { useAuth, useData } from '@package/api';
import { theme } from '@package/ui';

import { useDeviceBreakpoints } from '../../hooks/useDeviceBreakpoints';
import { useTabHistory } from '../../hooks/useTabHistory';
import { MobileNavbar } from './components/MobileNavbar';
import { NotificationDropdown } from './components/NotificationDropdown';
import { NAV_ITEMS } from './constants';
import {
  StyledBrandButton,
  StyledDesktopNav,
  StyledLogo,
  StyledNavbarContainer,
  StyledNavbarInner,
  StyledNavLink,
  StyledNavPills,
  StyledNextAppointmentChip,
} from './styles';
import { prefetchNavRoute } from './utils';

export function Navbar() {
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  const { nextAppointment } = useData();
  const { isMobile, isTablet } = useDeviceBreakpoints();
  const { t } = useTranslation();
  const { getTabTarget, navigateTab } = useTabHistory();

  const showMobileNav = isMobile || isTablet;

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

  const profileTrigger = useMemo(() => <Icons.User color={theme.colors.ink} />, []);

  return (
    <>
      <StyledNavbarContainer>
        <StyledNavbarInner $isMobile={showMobileNav}>
          <StyledBrandButton
            type="button"
            onClick={() => navigate('/')}
            aria-label={t('Naar startpagina')}
          >
            <StyledLogo src="/icoon-logo-zwart-transparant.svg" alt="" aria-hidden="true" />
            <FlexRow>
              <Heading $size="medium" $weight={800} $color={theme.colors.ink}>
                PEAK
              </Heading>
              <Heading $size="medium" $weight={500} $color={theme.colors.ink}>
                LAB
              </Heading>
            </FlexRow>
          </StyledBrandButton>

          <StyledDesktopNav $hidden={showMobileNav} aria-label={t('Hoofdnavigatie')}>
            <StyledNavPills>
              {NAV_ITEMS.map((item) => {
                const isActive = item.end
                  ? window.location.pathname === item.to
                  : window.location.pathname.startsWith(item.to);

                return (
                  <StyledNavLink
                    key={item.to}
                    to={getTabTarget(item.to, isActive)}
                    end={item.end}
                    replace
                    onClick={(e) => navigateTab(e, item.to, isActive)}
                    onPointerEnter={() => prefetchNavRoute(item.to)}
                  >
                    {t(item.label)}
                  </StyledNavLink>
                );
              })}
            </StyledNavPills>
          </StyledDesktopNav>

          <FlexRow $align="center" $justify="flex-end" $gap="sm">
            {nextAppointment && (
              <StyledNextAppointmentChip
                aria-label={`${t('Volgende afspraak')}: ${formatDate(nextAppointment.scheduled_at, { preset: 'shortDate' })}`}
              >
                <Icons.Calendar size={14} color={theme.colors.ink} aria-hidden="true" />
                <span>{formatDate(nextAppointment.scheduled_at, { preset: 'shortDate' })}</span>
              </StyledNextAppointmentChip>
            )}
            <NotificationDropdown iconColor={theme.colors.ink} isAdmin={isAdmin} />
            <DropdownMenu
              trigger={profileTrigger}
              items={profileItems}
              align="right"
              ariaLabel={t('Profielmenu')}
            />
          </FlexRow>
        </StyledNavbarInner>
      </StyledNavbarContainer>

      {showMobileNav && <MobileNavbar heroMode={false} />}
    </>
  );
}

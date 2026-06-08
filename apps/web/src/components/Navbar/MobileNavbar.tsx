import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useTranslation } from '@helpers/i18n';

import { theme } from '@package/ui';

import { NAV_ITEMS } from './constants';
import { StyledMobileNavbarContainer, StyledMobileNavItem, StyledMobileNavLabel } from './styles';

interface MobileNavbarProps {
  heroMode?: boolean;
}

export function MobileNavbar({ heroMode = false }: MobileNavbarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const getIconColor = useCallback(
    (active: boolean) => {
      if (active) {
        return heroMode ? theme.colors.primary : theme.colors.accent.hero.main;
      }

      return heroMode ? theme.colors.whiteAlpha.visible : theme.colors.text.muted;
    },
    [heroMode]
  );

  return (
    <StyledMobileNavbarContainer $heroMode={heroMode}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.to, item.end);
        const Icon = item.icon;
        const iconColor = getIconColor(active);

        return (
          <StyledMobileNavItem key={item.to} to={item.to} $active={active}>
            <Icon size={22} color={iconColor} />
            <StyledMobileNavLabel $active={active} $heroMode={heroMode}>
              {t(item.label)}
            </StyledMobileNavLabel>
          </StyledMobileNavItem>
        );
      })}
    </StyledMobileNavbarContainer>
  );
}

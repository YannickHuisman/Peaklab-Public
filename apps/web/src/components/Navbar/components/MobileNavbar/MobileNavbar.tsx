import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useTranslation } from '@helpers/i18n';
import { useTabHistory } from '@hooks/useTabHistory';

import { NAV_ITEMS } from '../../constants';
import { prefetchNavRoute, prefetchNavRoutesOnIdle } from '../../utils';
import {
  StyledMobileNavbarContainer,
  StyledMobileNavIndicator,
  StyledMobileNavItem,
} from './styles';

interface MobileNavbarProps {
  heroMode?: boolean;
}

export function MobileNavbar({ heroMode = false }: MobileNavbarProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { getTabTarget, navigateTab } = useTabHistory();

  // Warm the lazy nav chunks once idle so the first tab tap is instant.
  useEffect(() => {
    prefetchNavRoutesOnIdle();
  }, []);

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const activeIndex = NAV_ITEMS.findIndex((item) => isActive(item.to, item.end));

  return (
    <StyledMobileNavbarContainer $heroMode={heroMode} aria-label={t('Hoofdnavigatie')}>
      <StyledMobileNavIndicator $index={activeIndex} $count={NAV_ITEMS.length} aria-hidden="true" />
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.to, item.end);
        const Icon = item.icon;

        return (
          <StyledMobileNavItem
            key={item.to}
            to={getTabTarget(item.to, active)}
            replace
            $active={active}
            onClick={(e) => navigateTab(e, item.to, active)}
            onTouchStart={() => prefetchNavRoute(item.to)}
            aria-label={t(item.label)}
          >
            <Icon
              size={26}
              color="currentColor"
              strokeWidth={active ? 2.4 : 1.9}
              aria-hidden="true"
            />
          </StyledMobileNavItem>
        );
      })}
    </StyledMobileNavbarContainer>
  );
}

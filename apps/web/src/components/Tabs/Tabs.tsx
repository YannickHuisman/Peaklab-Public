import React, { useEffect } from 'react';

import { moveRovingFocus } from '@helpers/moveRovingFocus';
import { useDirectionalScroll } from '@hooks/useDirectionalScroll';

import { StyledTab, StyledTabLabel, StyledTabsRow, StyledTabsWrapper } from './styles';

export type TabItem<T extends string | number> = {
  id: T;
  label: React.ReactNode;
};

interface TabsProps<T extends string | number> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  className?: string;
  fullWidth?: boolean;
  /** Accessible name for the tablist (e.g. "Biomarker secties"). */
  ariaLabel?: string;
}

export function Tabs<T extends string | number>({
  tabs,
  activeTab,
  onChange,
  className,
  fullWidth = false,
  ariaLabel,
}: TabsProps<T>) {
  const {
    containerRef,
    itemRefs: tabRefs,
    scrollToIndex,
  } = useDirectionalScroll<HTMLButtonElement>();

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);

    if (activeIndex >= 0) scrollToIndex(activeIndex);
  }, [activeTab, tabs, scrollToIndex]);

  // Manual activation: arrow keys move focus only (shared roving-focus helper).
  // Activation happens on click / Enter / Space via the button's onClick, so
  // merely navigating with the arrows doesn't fire onChange (which for some
  // consumers has side effects like resetting filters).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    moveRovingFocus(tabRefs.current, e, { orientation: 'horizontal' });
  };

  return (
    <StyledTabsWrapper className={className}>
      <StyledTabsRow
        ref={containerRef}
        $fullWidth={fullWidth}
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <StyledTab
              key={String(tab.id)}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              $active={isActive}
              $fullWidth={fullWidth}
              onClick={() => onChange(tab.id)}
              onKeyDown={handleKeyDown}
            >
              <StyledTabLabel $active={isActive}>{tab.label}</StyledTabLabel>
            </StyledTab>
          );
        })}
      </StyledTabsRow>
    </StyledTabsWrapper>
  );
}

import React, { useEffect } from 'react';

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
}

export function Tabs<T extends string | number>({
  tabs,
  activeTab,
  onChange,
  className,
  fullWidth = false,
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

  return (
    <StyledTabsWrapper className={className}>
      <StyledTabsRow ref={containerRef} $fullWidth={fullWidth}>
        {tabs.map((tab, index) => (
          <StyledTab
            key={String(tab.id)}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            $active={activeTab === tab.id}
            $fullWidth={fullWidth}
            onClick={() => onChange(tab.id)}
          >
            <StyledTabLabel $active={activeTab === tab.id}>{tab.label}</StyledTabLabel>
          </StyledTab>
        ))}
      </StyledTabsRow>
    </StyledTabsWrapper>
  );
}

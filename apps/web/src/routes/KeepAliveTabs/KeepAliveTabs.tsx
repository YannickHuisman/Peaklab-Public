import { lazy, type ReactNode, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { Home } from '@pages/Home';
import styled from 'styled-components';

const Biomarkers = lazy(() => import('@pages/Biomarkers').then((m) => ({ default: m.Biomarkers })));
const Performance = lazy(() =>
  import('@pages/Performance').then((m) => ({ default: m.Performance }))
);
const Community = lazy(() => import('@pages/Community').then((m) => ({ default: m.Community })));
const Partners = lazy(() => import('@pages/Partners').then((m) => ({ default: m.Partners })));

const BiomarkerDetail = lazy(() =>
  import('@pages/BiomarkerDetail').then((m) => ({ default: m.BiomarkerDetail }))
);
const DeepResearch = lazy(() =>
  import('@pages/DeepResearch').then((m) => ({ default: m.DeepResearch }))
);
const BloodResultUploads = lazy(() =>
  import('@pages/BloodResultUploads').then((m) => ({ default: m.BloodResultUploads }))
);
const PartnerDetail = lazy(() =>
  import('@pages/PartnerDetail').then((m) => ({ default: m.PartnerDetail }))
);

const TAB_ROOTS = ['/', '/biomarkers', '/performance', '/community', '/partners'] as const;

type TabRoot = (typeof TAB_ROOTS)[number];

function isTabRoot(pathname: string): pathname is TabRoot {
  return (TAB_ROOTS as readonly string[]).includes(pathname);
}

function getActiveTab(pathname: string): TabRoot | '' {
  if (pathname === '/') return '/';

  return (
    ((TAB_ROOTS as readonly string[]).find(
      (tab) => tab !== '/' && pathname.startsWith(tab)
    ) as TabRoot) ?? ''
  );
}

// Instead of display: none (which destroys scroll states of overflow containers like the pills slider),
// we use visibility: hidden + position: absolute so inner child elements retain their exact scrollLeft/scrollTop values.
const StyledTabWrapper = styled.div<{ $active: boolean }>`
  ${({ $active }) =>
    $active
      ? `display: contents;`
      : `
          position: fixed !important;
          top: 0;
          left: -9999px !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          overflow: hidden !important;
        `}
`;

interface TabPageProps {
  active: boolean;
  children: ReactNode;
}

function TabPage({ active, children }: TabPageProps) {
  const [activated, setActivated] = useState(active);

  if (active && !activated) {
    setActivated(true);
  }

  if (!activated) return null;

  return <StyledTabWrapper $active={active}>{children}</StyledTabWrapper>;
}

function PageSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export function KeepAliveTabs() {
  const { pathname } = useLocation();
  const atTabRoot = isTabRoot(pathname);
  const activeTab = getActiveTab(pathname);

  // Disable iOS swipe-to-go-back gesture on root tabs,
  // but re-enable it for detail pages so native back swiping works natively there.
  useEffect(() => {
    document.body.style.overscrollBehaviorX = atTabRoot ? 'none' : 'auto';
    document.documentElement.style.overscrollBehaviorX = atTabRoot ? 'none' : 'auto';

    let blockSwipe: ((e: TouchEvent) => void) | undefined;

    if (atTabRoot) {
      blockSwipe = (e: TouchEvent) => {
        const target = e.target as Element | null;

        if (
          target?.closest?.(
            'button, a, input, textarea, select, [role="button"], [role="menuitem"]'
          )
        ) {
          return;
        }

        // Increase the blocked edge boundary to 45px to fiercely intercept iOS swipe logic
        if (e.touches[0].clientX < 45) {
          e.preventDefault();
        }
      };

      // non-passive, capture-phase listener is strictly required to intercept before WebKit runs the native animation.
      document.addEventListener('touchstart', blockSwipe, { passive: false, capture: true });
    }

    return () => {
      if (blockSwipe) {
        document.removeEventListener('touchstart', blockSwipe, { capture: true });
      }
      document.body.style.overscrollBehaviorX = 'auto';
      document.documentElement.style.overscrollBehaviorX = 'auto';
    };
  }, [atTabRoot]);

  return (
    <>
      <TabPage active={atTabRoot && activeTab === '/'}>
        <Home />
      </TabPage>

      <TabPage active={atTabRoot && activeTab === '/biomarkers'}>
        <PageSuspense>
          <Biomarkers />
        </PageSuspense>
      </TabPage>

      <TabPage active={atTabRoot && activeTab === '/performance'}>
        <PageSuspense>
          <Performance />
        </PageSuspense>
      </TabPage>

      <TabPage active={atTabRoot && activeTab === '/community'}>
        <PageSuspense>
          <Community />
        </PageSuspense>
      </TabPage>

      <TabPage active={atTabRoot && activeTab === '/partners'}>
        <PageSuspense>
          <Partners />
        </PageSuspense>
      </TabPage>

      {!atTabRoot && (
        <Routes>
          <Route
            path="biomarkers/deep-research"
            element={
              <PageSuspense>
                <DeepResearch />
              </PageSuspense>
            }
          />
          <Route
            path="biomarkers/uploads"
            element={
              <PageSuspense>
                <BloodResultUploads />
              </PageSuspense>
            }
          />
          <Route
            path="biomarkers/:id"
            element={
              <PageSuspense>
                <BiomarkerDetail />
              </PageSuspense>
            }
          />
          <Route
            path="partners/:id"
            element={
              <PageSuspense>
                <PartnerDetail />
              </PageSuspense>
            }
          />
        </Routes>
      )}
    </>
  );
}

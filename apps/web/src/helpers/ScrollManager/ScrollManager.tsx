import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TAB_ROOTS = ['/', '/biomarkers', '/performance', '/community', '/partners'];

function getTabRoot(pathname: string): string {
  if (pathname === '/') return '/';

  return TAB_ROOTS.find((tab) => tab !== '/' && pathname.startsWith(tab)) ?? pathname;
}

export function ScrollManager() {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const savedScrollRef = useRef<Record<string, number>>({});
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Globally block the iOS "forward" swipe gesture (triggering from the right-edge)
    const blockForwardSwipe = (e: TouchEvent) => {
      const target = e.target as Element | null;

      if (
        target?.closest?.('button, a, input, textarea, select, [role="button"], [role="menuitem"]')
      ) {
        return;
      }

      if (e.touches[0].clientX > window.innerWidth - 45) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', blockForwardSwipe, { passive: false, capture: true });

    return () => document.removeEventListener('touchstart', blockForwardSwipe, { capture: true });
  }, []);

  useLayoutEffect(() => {
    const prev = prevPathnameRef.current;
    const prevTab = getTabRoot(prev);
    const currentTab = getTabRoot(pathname);
    const prevWasTabRoot = TAB_ROOTS.includes(prev);
    const currentIsTabRoot = TAB_ROOTS.includes(pathname);

    if (prevWasTabRoot) {
      // Use Math.max with 0 to prevent saving iOS negative bounce.
      // We must not use "if (top > 0)", otherwise scrolling exactly to the
      // top (0) won't overwrite a previously saved deeper scroll position!
      savedScrollRef.current[prevTab] = Math.max(0, lastScrollY.current, window.scrollY);
    }

    const applyScroll = () => {
      const targetScroll = currentIsTabRoot ? (savedScrollRef.current[currentTab] ?? 0) : 0;
      let attempts = 15;

      // Sync scroll attempt to prevent top-first flash when content is already rendered
      // Note: 'auto' means instant jump within the standard API (unlike 'smooth').
      window.scrollTo({ top: targetScroll, left: 0, behavior: 'auto' });

      const checkScroll = () => {
        window.scrollTo({ top: targetScroll, left: 0, behavior: 'auto' });
        attempts--;

        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const notReached = targetScroll > 0 && window.scrollY < Math.min(targetScroll, maxScroll);

        // Keep forcing scroll to 0 for a few frames after a detail page mounts to beat Suspense
        const forceTick = !currentIsTabRoot && attempts > 5;

        if ((notReached || forceTick) && attempts > 0) {
          requestAnimationFrame(checkScroll);
        }
      };

      requestAnimationFrame(checkScroll);
    };

    applyScroll();

    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}

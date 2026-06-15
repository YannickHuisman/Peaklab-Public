import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

// Module-level cache so it survives remounts
const tabHistories: Record<string, string> = {
  '/': '/',
  '/biomarkers': '/biomarkers',
  '/performance': '/performance',
  '/community': '/community',
  '/partners': '/partners',
};

// Outside state manager to bypass React cascading effect warnings
let listeners: (() => void)[] = [];

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function useTabHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to external changes
    const forceUpdate = () => setTick((t) => t + 1);

    listeners.push(forceUpdate);

    return () => {
      listeners = listeners.filter((l) => l !== forceUpdate);
    };
  }, []);

  useEffect(() => {
    const root =
      Object.keys(tabHistories).find(
        (path) => path !== '/' && location.pathname.startsWith(path)
      ) ?? '/';

    // Store the exact last visited path + search params for this tab
    if (tabHistories[root] !== location.pathname + location.search) {
      tabHistories[root] = location.pathname + location.search;
      notifyListeners();
    }
  }, [location.pathname, location.search]);

  const getTabTarget = useCallback((targetRoot: string, isActive: boolean) => {
    // If the tab is already active globally, the link should explicitly point to
    // the root to allow "popping" back to the main list.
    if (isActive) return targetRoot;

    // Otherwise, point to the last known state of that tab
    return tabHistories[targetRoot] || targetRoot;
  }, []);

  const navigateTab = useCallback(
    (e: React.MouseEvent | React.TouchEvent, targetRoot: string, isActive: boolean) => {
      e.preventDefault();

      if (isActive) {
        navigate(targetRoot, { replace: true });

        return;
      }

      const target = tabHistories[targetRoot] || targetRoot;

      // Check if it is a true subset path (e.g. /biomarkers/123) rather than just query params
      const isDeepLink = target.startsWith(targetRoot === '/' ? 'nevermatch' : targetRoot + '/');

      if (isDeepLink) {
        // flushSync forces React to synchronously render the tab root (list page) before
        // pushState is called for the deep link. iOS WebKit captures a DOM snapshot at
        // the moment of pushState for its swipe-back animation — without flushSync the
        // snapshot would show the previous tab's page instead of the correct list page.
        // The DOM update happens before the browser paints, so the user never sees the
        // intermediate list state.
        flushSync(() => {
          navigate(targetRoot, { replace: true });
        });

        navigate(target, { replace: false });
      } else {
        navigate(target, { replace: true });
      }
    },
    [navigate]
  );

  return { getTabTarget, navigateTab };
}

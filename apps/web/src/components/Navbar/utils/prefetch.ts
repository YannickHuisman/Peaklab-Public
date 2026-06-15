import { NAV_ITEMS } from '../constants';

// Track which routes we've already warmed so repeated hover/touch events don't
// re-trigger the dynamic import.
const prefetched = new Set<string>();

export function prefetchNavRoute(to: string) {
  if (prefetched.has(to)) return;

  const item = NAV_ITEMS.find((navItem) => navItem.to === to);

  if (!item?.prefetch) return;

  prefetched.add(to);
  // Swallow errors — a failed prefetch must never surface; the real navigation
  // will retry the import and handle failures via Suspense/error boundaries.
  void item.prefetch().catch(() => prefetched.delete(to));
}

// Warm every lazy nav chunk once the browser is idle after first paint, so the
// first tab tap is instant on mobile (where chunk fetch + parse is the lag).
export function prefetchNavRoutesOnIdle() {
  const run = () => NAV_ITEMS.forEach((item) => prefetchNavRoute(item.to));

  if (typeof window === 'undefined') return;

  const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;

  if (idle) {
    idle(run, { timeout: 2000 });
  } else {
    window.setTimeout(run, 1200);
  }
}

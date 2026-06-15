import { Icons } from '@components/Icons';

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Icons.LayoutDashboard;
  end?: boolean;
  /**
   * Warms the route's lazy chunk so navigation feels instant on mobile.
   * Must point at the same dynamic import used in AppRoutes. Omit for eager
   * routes (e.g. Dashboard/Home).
   */
  prefetch?: () => Promise<unknown>;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: Icons.LayoutDashboard, end: true },
  {
    to: '/biomarkers',
    label: 'Biomarkers',
    icon: Icons.Activity,
    prefetch: () => import('@pages/Biomarkers'),
  },
  {
    to: '/performance',
    label: 'Performance',
    icon: Icons.TrendingUp,
    prefetch: () => import('@pages/Performance'),
  },
  {
    to: '/community',
    label: 'Community',
    icon: Icons.Users,
    prefetch: () => import('@pages/Community'),
  },
  {
    to: '/partners',
    label: 'Partners',
    icon: Icons.Handshake,
    prefetch: () => import('@pages/Partners'),
  },
];

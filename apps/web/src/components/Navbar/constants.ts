import { Icons } from '@components/Icons';

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Icons.LayoutDashboard;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: Icons.LayoutDashboard, end: true },
  { to: '/biomarkers', label: 'Biomarkers', icon: Icons.Activity },
  { to: '/performance', label: 'Performance', icon: Icons.TrendingUp },
  { to: '/community', label: 'Community', icon: Icons.Users },
  { to: '/partners', label: 'Partners', icon: Icons.Handshake },
];

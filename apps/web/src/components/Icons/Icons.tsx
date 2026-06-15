import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Ban,
  BarChart2,
  Battery,
  Bell,
  BicepsFlexed,
  Bone,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Clock,
  CreditCard,
  Crown,
  Dna,
  Dumbbell,
  Edit,
  ExternalLink,
  Eye,
  Flame,
  Footprints,
  Globe,
  Goal,
  Hand,
  Handshake,
  Heart,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Minus,
  Moon,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Shield,
  Snowflake,
  Sparkles,
  Target,
  Trash,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';

// Icon size mapping
const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof sizeMap;

export interface IconProps extends Omit<LucideProps, 'size' | 'color'> {
  size?: IconSize | number;
  color?: string;
}

// Helper function to create icon components with default props
const createIcon = (Icon: LucideIcon) => {
  return ({ size = 'md', color, ...props }: IconProps) => {
    const iconSize = typeof size === 'number' ? size : sizeMap[size];

    return <Icon size={iconSize} color={color || 'currentColor'} strokeWidth={1.5} {...props} />;
  };
};

// Export all icons with default props
export const Icons = {
  Activity: createIcon(Activity),
  AlertCircle: createIcon(AlertCircle),
  ArrowDown: createIcon(ArrowDown),
  ArrowLeft: createIcon(ArrowLeft),
  ArrowRight: createIcon(ArrowRight),
  ArrowUp: createIcon(ArrowUp),
  Ban: createIcon(Ban),
  BarChart2: createIcon(BarChart2),
  Battery: createIcon(Battery),
  Bell: createIcon(Bell),
  BicepsFlexed: createIcon(BicepsFlexed),
  Bone: createIcon(Bone),
  Brain: createIcon(Brain),
  Calendar: createIcon(Calendar),
  Check: createIcon(Check),
  ChevronDown: createIcon(ChevronDown),
  ChevronRight: createIcon(ChevronRight),
  ChevronUp: createIcon(ChevronUp),
  Clipboard: createIcon(Clipboard),
  RefreshCw: createIcon(RefreshCw),
  Clock: createIcon(Clock),
  CreditCard: createIcon(CreditCard),
  Crown: createIcon(Crown),
  Dna: createIcon(Dna),
  Dumbbell: createIcon(Dumbbell),
  Edit: createIcon(Edit),
  ExternalLink: createIcon(ExternalLink),
  Eye: createIcon(Eye),
  Flame: createIcon(Flame),
  Footprints: createIcon(Footprints),
  Globe: createIcon(Globe),
  Goal: createIcon(Goal),
  Hand: createIcon(Hand),
  Handshake: createIcon(Handshake),
  Heart: createIcon(Heart),
  Info: createIcon(Info),
  LayoutDashboard: createIcon(LayoutDashboard),
  Lock: createIcon(Lock),
  LogOut: createIcon(LogOut),
  Mail: createIcon(Mail),
  Minus: createIcon(Minus),
  Moon: createIcon(Moon),
  Plus: createIcon(Plus),
  Save: createIcon(Save),
  Search: createIcon(Search),
  Send: createIcon(Send),
  Settings: createIcon(Settings),
  Shield: createIcon(Shield),
  Snowflake: createIcon(Snowflake),
  Sparkles: createIcon(Sparkles),
  Target: createIcon(Target),
  Trash: createIcon(Trash),
  TrendingUp: createIcon(TrendingUp),
  User: createIcon(User),
  Users: createIcon(Users),
  X: createIcon(X),
  Zap: createIcon(Zap),
} as const;

export type IconName = keyof typeof Icons;

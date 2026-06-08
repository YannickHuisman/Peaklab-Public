export const colors = {
  // Brand / primary — Lime Green
  primary: '#90ea0b',
  primarySoft: '#f0ffd4', // very light lime background
  primaryMuted: '#e8f50b', // light hover variant

  // Top navigation bar
  navbar: {
    bg: 'var(--color-navbar-bg, #FFFFFF)', // bar background
    textActive: 'var(--color-text-primary, #1f2937)', // active tab text
    icon: 'var(--color-text-muted, #9CA3AF)', // icons
    iconActive: 'var(--color-text-primary, #1f2937)', // active icon
    pillBg: 'var(--color-neutral-200, #F3F4F6)', // background for nav pills
    pillBgActive: 'var(--color-neutral-800, #1f2937)',
    pillText: 'var(--color-text-secondary, #4a5568)',
    pillTextActive: '#FFFFFF',
  },

  // Neutral palette (light-first, from background → text)
  neutral: {
    50: 'var(--color-neutral-50, #FFFFFF)', // pure white
    100: 'var(--color-neutral-100, #f8f9fa)', // page background
    200: 'var(--color-neutral-200, #F3F4F6)', // main scroll area
    300: 'var(--color-neutral-300, #E5E7EB)', // card borders / separators
    400: 'var(--color-neutral-400, #d1d5db)', // Med. Gray
    500: '#9CA3AF',
    600: '#6b7280', // Dark Gray
    700: '#4a5568', // Slate Gray
    800: 'var(--color-neutral-800, #1f2937)', // Near Black
    900: '#030712',
  },

  // Accent palettes for category cards / highlights
  accent: {
    orange: {
      soft: '#FFF3EE',
      softDark: '#FCBD9A',
      main: '#e8622b', // Warm Orange
      strong: '#c44d1e',
    },
    green: {
      soft: '#ECFDF3',
      softDark: '#D1FAE5',
      main: '#22C55E',
      strong: '#14532d',
    },
    magenta: {
      soft: '#FEF2F8',
      softDark: '#FCE7F3',
      main: '#EC4899',
      strong: '#DB2777',
    },
    teal: {
      soft: '#e6faf9',
      softDark: '#b3ece9',
      main: '#1a9b8e', // Success Teal
      strong: '#147a6e',
    },
    blue: {
      soft: '#EFF6FF',
      softDark: '#DBEAFE',
      main: '#4c5aa0', // Indigo
      strong: '#1e3a5f', // Deep Blue
    },
    hero: {
      soft: '#1f2937', // bottom — Near Black
      softDark: '#111827',
      main: '#14202e', // top — very dark navy
      strong: '#243045', // slight blue highlight
    },
  },

  // Semantic colors
  success: {
    soft: '#e6faf9',
    main: '#1a9b8e', // Success Teal
    strong: '#147a6e',
  },

  error: {
    soft: '#fef2f2',
    main: '#fecaca',
    strong: '#d94339', // Alert Red
  },

  warning: {
    soft: '#FFF3EE',
    main: '#e8622b', // Warm Orange
    strong: '#c44d1e',
  },

  info: {
    soft: '#EFF6FF',
    main: '#4c5aa0', // Indigo
    strong: '#1e3a5f', // Deep Blue
  },

  // Background colors
  background: {
    app: 'var(--color-bg-app, #F5F5F7)',
    default: 'var(--color-bg-default, #f8f9fa)',
    raised: 'var(--color-bg-raised, #FFFFFF)',
    subtle: 'var(--color-bg-subtle, #EDEDF0)',
  },

  // Borders
  border: {
    subtle: 'var(--color-border-subtle, #E5E7EB)',
    strong: 'var(--color-border-strong, #d1d5db)',
    focus: '#90ea0b',
  },

  // Text colors
  text: {
    primary: 'var(--color-text-primary, #1f2937)', // Near Black
    secondary: 'var(--color-text-secondary, #4a5568)', // Slate Gray
    muted: 'var(--color-text-muted, #9CA3AF)',
    disabled: '#d1d5db',
    inverse: '#FFFFFF',
  },

  // White-alpha overlays (for dark / hero surfaces)
  whiteAlpha: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    muted: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.12)',
    visible: 'rgba(255, 255, 255, 0.7)',
  },
} as const;

export const gradients = {
  hero: `linear-gradient(180deg, ${colors.accent.hero.main}, ${colors.accent.hero.soft})`,
} as const;

// Helper to get nested color value by path (e.g., "accent.green.main")
// export function getColor(path: string): string {
//   const keys = path.split('.');
//   let value: any = colors;
//   for (const key of keys) {
//     value = value?.[key];
//     if (value === undefined) return '';
//   }
//   return typeof value === 'string' ? value : '';
// }

// Type for all valid color paths
// export type ColorKey = string;

export const spacing = {
  xxs: '0.125rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  auto: 'auto',
} as const;

export type SpacingKey = keyof typeof spacing;

export const typography = {
  fontFamily: {
    primary:
      '"Satoshi", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    monospace:
      '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.8125rem', // 13px
    base: '0.9375rem', // 15px
    lg: '1.0625rem', // 17px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '4rem', // 64px
  },

  // fontWeight: {
  //   light: 300,
  //   normal: 400,
  //   medium: 500,
  //   semibold: 600,
  //   bold: 700,
  // },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const borderRadius = {
  none: '0px',
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
  base: '0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03)',
  md: '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.03), 0 8px 32px rgba(0, 0, 0, 0.06)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.04), 0 16px 48px rgba(0, 0, 0, 0.08)',
} as const;

export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

export const transitions = {
  // Duration
  duration: {
    instant: '50ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  // Easing functions
  // easing: {
  //   linear: 'linear',
  //   easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  //   easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  //   easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  //   spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // },
  // Common transition combinations
  // default: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  // fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  // slow: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
  // color: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  // transform: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  // opacity: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const theme = {
  colors,
  gradients,
  spacing,
  typography,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
} as const;

export type Theme = typeof theme;

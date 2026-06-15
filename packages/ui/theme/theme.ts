export const colors = {
  // PeakLab "Instrument" Design System (Direction A — Satoshi)
  // App background & surfaces
  bg: '#F1F3F6',
  surface: '#FFFFFF',
  panel: '#0C1722', // dark hero panels

  // Ink palette (text)
  ink: '#0C1722',
  ink70: '#3D4753',
  ink60: '#5A6573',
  ink40: '#8A929E',
  ink25: '#C2C8CF',

  // Lines & dividers
  line: '#E4E7EA',
  lineSoft: '#EDEFF1',

  // Status colors
  performance: '#1F8A4C', // green
  normaal: '#3E6C8E', // slate
  buiten: '#C0453B', // red

  // Status tints (pill backgrounds)
  tintPerf: '#EAF4EE',
  tintNormaal: '#EAF0F5',
  tintBuiten: '#F8EAE8',

  // Deep Research domain colors
  optimaal: '#1F8A4C',
  letop: '#BE8A12',
  tintLet: '#F7F0DE',

  // Backward compatibility with old theme structure
  primary: '#1F8A4C',
  primarySoft: '#EAF4EE',
  primaryMuted: '#EAF4EE',

  navbar: {
    bg: '#FFFFFF',
    textActive: '#0C1722',
    icon: '#8A929E',
    iconActive: '#0C1722',
    pillBg: '#EDEFF1',
    pillBgActive: '#0C1722',
    pillText: '#5A6573',
    pillTextActive: '#FFFFFF',
  },

  neutral: {
    50: '#FFFFFF',
    100: '#F1F3F6',
    200: '#EDEFF1',
    300: '#E4E7EA',
    400: '#C2C8CF',
    500: '#8A929E',
    600: '#5A6573',
    700: '#3D4753',
    800: '#0C1722',
    900: '#0C1722',
  },

  accent: {
    orange: {
      soft: '#F8EAE8',
      softDark: '#F8EAE8',
      main: '#C0453B',
      strong: '#C0453B',
    },
    green: {
      soft: '#EAF4EE',
      softDark: '#EAF4EE',
      main: '#1F8A4C',
      strong: '#1F8A4C',
    },
    blue: {
      soft: '#EAF0F5',
      softDark: '#EAF0F5',
      main: '#3E6C8E',
      strong: '#3E6C8E',
    },
    yellow: {
      soft: '#F7F0DE',
      softDark: '#F7F0DE',
      main: '#BE8A12',
      strong: '#BE8A12',
    },
    // Backward compatibility for existing codebase
    teal: {
      soft: '#EAF4EE',
      softDark: '#EAF4EE',
      main: '#1F8A4C',
      strong: '#1F8A4C',
    },
    magenta: {
      soft: '#EAF0F5',
      softDark: '#EAF0F5',
      main: '#3E6C8E',
      strong: '#3E6C8E',
    },
    hero: {
      soft: '#0B1620',
      softDark: '#0B1620',
      main: '#15273A',
      strong: '#15273A',
    },
  },

  success: {
    soft: '#EAF4EE',
    main: '#1F8A4C',
    strong: '#1F8A4C',
  },

  error: {
    soft: '#F8EAE8',
    main: '#C0453B',
    strong: '#C0453B',
  },

  warning: {
    soft: '#F7F0DE',
    main: '#BE8A12',
    strong: '#BE8A12',
  },

  info: {
    soft: '#EAF0F5',
    main: '#3E6C8E',
    strong: '#3E6C8E',
  },

  background: {
    app: '#F1F3F6',
    default: '#F1F3F6',
    raised: '#FFFFFF',
    subtle: '#EDEFF1',
  },

  border: {
    subtle: '#E4E7EA',
    strong: '#C2C8CF',
    focus: '#0C1722',
  },

  text: {
    primary: '#0C1722',
    secondary: '#3D4753',
    muted: '#8A929E',
    disabled: '#C2C8CF',
    inverse: '#FFFFFF',
  },

  whiteAlpha: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    muted: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.12)',
    visible: 'rgba(255, 255, 255, 0.7)',
  },
} as const;

export const gradients = {
  hero: 'linear-gradient(155deg, #15273A, #0B1620)',
  panel: 'linear-gradient(155deg, #15273A, #0B1620)',
} as const;

export const spacing = {
  0: '0px',
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
    primary: "'Satoshi', system-ui, -apple-system, sans-serif",
    monospace: "'JetBrains Mono', ui-monospace, monospace",
  },

  fontSize: {
    xs: '0.6875rem', // 11px (10.5px rounded)
    sm: '0.8125rem', // 13px
    base: '0.8438rem', // 13.5px
    lg: '0.9063rem', // 14.5px
    xl: '1rem', // 16px
    '2xl': '1.75rem', // 28px
    '3xl': '1.875rem', // 30px
    '4xl': '2.125rem', // 34px
    '5xl': '3.25rem', // 52px
    '6xl': '4rem', // 64px
  },

  lineHeight: {
    tight: 1,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const borderRadius = {
  none: '0px',
  sm: '9px', // icon buttons
  md: '11px', // buttons/inputs
  lg: '18px', // cards
  xl: '20px',
  full: '99px', // pills
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(15,23,42,.05), 0 1px 1px rgba(15,23,42,.04)',
  base: '0 1px 2px rgba(15,23,42,.04), 0 4px 14px rgba(15,23,42,.05)',
  md: '0 1px 2px rgba(15,23,42,.04), 0 4px 14px rgba(15,23,42,.05)',
  lg: '0 2px 6px rgba(15,23,42,.05), 0 14px 36px rgba(15,23,42,.09)',
  xl: '0 2px 6px rgba(15,23,42,.05), 0 14px 36px rgba(15,23,42,.09)',
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

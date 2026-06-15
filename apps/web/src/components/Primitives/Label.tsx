import React from 'react';

import { theme } from '@package/ui';

interface LabelProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Label - Mono caps text for small labels, stat values, status pills
 * JetBrains Mono, 10.5px, 500 weight, uppercase, letter-spacing 0.12em
 */
export function Label({ children, color = theme.colors.ink40, style }: LabelProps) {
  return (
    <div
      style={{
        fontFamily: theme.typography.fontFamily.monospace,
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

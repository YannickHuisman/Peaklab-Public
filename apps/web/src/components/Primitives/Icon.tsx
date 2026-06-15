import React from 'react';

import { theme } from '@package/ui';

interface IconProps {
  d: string; // SVG path data
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/**
 * Icon - Stroke line-icon helper component
 * Renders SVG icons from path data (from design system)
 */
export function Icon({
  d,
  size = 18,
  color = theme.colors.ink,
  strokeWidth = 1.6,
  style,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

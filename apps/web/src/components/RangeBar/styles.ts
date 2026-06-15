import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledBar = styled.div`
  position: relative;
  height: 24px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.subtle};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
`;

export const StyledSegment = styled.div.attrs<{
  $kind: 'out-of-range' | 'normal' | 'performance';
  $left: number;
  $width: number;
}>((props) => ({
  style: {
    left: `${props.$left}%`,
    width: `${props.$width}%`,
  },
}))`
  position: absolute;
  top: 0;
  bottom: 0;
  background: ${({ $kind }) => {
    if ($kind === 'performance') return theme.colors.success.soft;
    if ($kind === 'normal') return theme.colors.info.soft;

    return theme.colors.error.soft;
  }};
`;

export const StyledMarkerWrap = styled.div.attrs<{ $left: number }>((props) => ({
  style: { left: `${props.$left}%` },
}))`
  position: absolute;
  top: 0;
  height: 100%;
  width: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transform: translate(-50%, 0);
`;

export const StyledMarkerStem = styled.div`
  width: 4px;
  flex-grow: 1;
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.text.primary};
`;

export const StyledTicksRow = styled.div`
  position: relative;
  height: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xs};
`;

export const StyledTick = styled.div.attrs<{ $left: string; $transform: string }>((props) => ({
  style: { left: props.$left, transform: props.$transform },
}))`
  position: absolute;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
`;

export const StyledDot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.4em;
  height: 0.4em;
  border-radius: ${theme.borderRadius.full};
  background: currentColor;
  margin-right: ${theme.spacing.xs};
  vertical-align: middle;
`;

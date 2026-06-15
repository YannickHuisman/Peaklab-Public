import type { ReactNode } from 'react';

import { Icons } from '@components/Icons';

import { theme } from '@package/ui';

import { StyledTooltipContent, StyledTooltipIcon, StyledTooltipWrapper } from './styles';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  /** Positioning offset – defaults to left-aligned */
  align?: 'left' | 'center' | 'right';
}

/** Inline info icon with a hover tooltip. Wrap a label string or place next to one. */
export function Tooltip({ content, children, align = 'left' }: TooltipProps) {
  return (
    <StyledTooltipWrapper>
      {children}
      <StyledTooltipIcon aria-label={content} tabIndex={0}>
        <Icons.Info size="xs" color={theme.colors.text.muted} />
        <StyledTooltipContent $align={align} role="tooltip">
          {content}
        </StyledTooltipContent>
      </StyledTooltipIcon>
    </StyledTooltipWrapper>
  );
}

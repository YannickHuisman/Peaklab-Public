import { StyledCard } from '@components/styled/StyledCard';
import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledSectionCard = styled(StyledCard)<{ $color: string }>`
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${(props) => props.$color} 0%,
      ${(props) => props.$color}dd 100%
    );
  }
`;

export const StyledArrowIcon = styled.div<{ $hoverColor?: string }>`
  width: 100%;
  color: ${theme.colors.neutral[400]};
  transition: all ${theme.transitions.duration.slow} ease;
  width: fit-content;

  ${StyledSectionCard}:hover & {
    color: ${(props) => props.$hoverColor || theme.colors.accent.blue.main};
    transform: translateX(${theme.spacing.sm});
  }
`;

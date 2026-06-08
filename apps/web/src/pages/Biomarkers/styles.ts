import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledPillsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: ${theme.spacing.xs};

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.md}px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

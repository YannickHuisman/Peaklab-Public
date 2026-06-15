import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledPillsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin-inline: -${theme.spacing.md};
  padding-inline: ${theme.spacing.md};
  padding-block: ${theme.spacing['2xl']};
  margin-block: -${theme.spacing['2xl']};

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.md}px) {
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

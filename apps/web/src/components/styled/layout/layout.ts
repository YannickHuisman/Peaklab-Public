import { type LayoutProps, layoutStyles } from '@helpers/layoutUtils';
import styled from 'styled-components';

export interface ExtendedLayoutProps extends LayoutProps {
  $gridMinWidth?: string;
  $gridColumns?: string;
  $columnsCount?: number;
  $dividers?: boolean;
}

export const FlexRow = styled.div<LayoutProps>`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${layoutStyles}

  ${({ $equalChildren }) =>
    $equalChildren &&
    `
    > * {
      flex: 1 1 0;
    }
  `}
`;

export const FlexColumn = styled.div<LayoutProps>`
  display: flex;
  flex-direction: column;
  ${layoutStyles}
`;

export const Grid = styled.div<ExtendedLayoutProps>`
  ${layoutStyles}
  display: grid;
  grid-template-columns: ${({ $gridColumns, $gridMinWidth = '250px' }) =>
    $gridColumns || `repeat(auto-fill, minmax(${$gridMinWidth}, 1fr))`};

  ${({ $dividers, $columnsCount, theme }) =>
    $dividers &&
    `
    > * {
      border-left: 1px solid ${theme.colors.neutral[200]};
      padding: ${theme.spacing.md};
    }

    ${
      $columnsCount
        ? `
    > *:nth-child(${$columnsCount}n + 1) {
      border-left: none;
    }
    `
        : `
    > *:first-child {
      border-left: none;
    }
    `
    }
  `}
`;

export const EnforcedPageWidth = styled.div<LayoutProps>`
  ${layoutStyles}

  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
`;

export const StyledLayoutContainer = styled.div<{ $heroBackground?: boolean }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.app};

  ${({ $heroBackground, theme }) =>
    $heroBackground &&
    `
    background: ${theme.gradients.hero};
  `}
`;

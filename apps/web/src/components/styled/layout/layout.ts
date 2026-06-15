import { type LayoutProps, layoutStyles } from '@helpers/layoutUtils';
import styled from 'styled-components';

export interface ExtendedLayoutProps extends LayoutProps {
  $gridMinWidth?: string;
  $gridColumns?: string;
  // Columns to use below the mobile breakpoint when $gridColumns is set.
  // Defaults to a single column so fixed multi-column grids stack on phones.
  $mobileColumns?: string;
  // Opt out of the automatic single-column collapse on mobile.
  $noCollapse?: boolean;
  $columnsCount?: number;
  $dividers?: boolean;
}

export const FlexRow = styled.div<
  LayoutProps & { $stackOnMobile?: boolean; $reverseOnMobile?: boolean }
>`
  display: flex;
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  ${layoutStyles}

  ${({ $equalChildren }) =>
    $equalChildren &&
    `
    > * {
      flex: 1 1 0;
    }
  `}

  ${({ $stackOnMobile, $reverseOnMobile, theme }) =>
    ($stackOnMobile || $reverseOnMobile) &&
    `
    @media (max-width: ${theme.breakpoints.md - 1}px) {
      flex-direction: ${$reverseOnMobile ? 'column-reverse' : 'column'};
      align-items: stretch;
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

  ${({ $gridColumns, $mobileColumns, $noCollapse, theme }) =>
    $gridColumns &&
    !$noCollapse &&
    `
    @media (max-width: ${theme.breakpoints.md - 1}px) {
      /* minmax(0, 1fr) lets the single column shrink below its content's
         min-content width, and min-width: 0 on the items lets them do the
         same — so children that handle their own overflow (scrolling tabs,
         truncating text) can't push the page wider than the viewport. */
      grid-template-columns: ${$mobileColumns || 'minmax(0, 1fr)'};

      > * {
        min-width: 0;
      }
    }
  `}

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

export const StyledLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.app};
`;
// shadcn;

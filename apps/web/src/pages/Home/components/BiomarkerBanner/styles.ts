import styled from 'styled-components';

import { theme } from '@package/ui';

const getStatusColor = (status: string): string => {
  if (status === 'performance') return theme.colors.performance;
  if (status === 'normaal') return theme.colors.normaal;
  if (status === 'buiten') return theme.colors.buiten;

  return theme.colors.ink40;
};

/**
 * Dark gradient hero panel for Dashboard
 * linear-gradient(155deg, #15273A, #0B1620)
 * Cards with 18px radius, soft shadows
 */
export const StyledHeroBannerContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1px 1fr;
  gap: 38px;
  align-items: center;
  padding: 36px;
  background: linear-gradient(155deg, #15273a, #0b1620);
  border-radius: 18px;
  box-shadow:
    0 2px 6px rgba(15, 23, 42, 0.05),
    0 14px 36px rgba(15, 23, 42, 0.09);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
  }
`;

export const StyledHeroLeft = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledHeroRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/**
 * Vertical hairline between the score ring and the biomarker overview.
 * Hidden once the hero grid collapses to a single column on mobile so it
 * doesn't leave a tall empty gap.
 */
export const StyledHeroDivider = styled.div`
  width: 1px;
  height: 200px;
  background: rgba(255, 255, 255, 0.09);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledBiomarkerOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  background: ${theme.colors.whiteAlpha.subtle};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
`;

/**
 * Stat item with colored left accent (2px thick)
 */
export const StyledStatItem = styled.div<{ $status?: string }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  position: relative;
`;

export const StyledStatAccent = styled.div<{ $status: string }>`
  width: 2px;
  height: 100%;
  background-color: ${({ $status }) => getStatusColor($status)};
  min-height: 56px;
  border-radius: 99px;
`;

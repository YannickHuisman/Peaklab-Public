import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledFullBleedHero = styled.div`
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  margin-top: -${theme.spacing.xl};
  width: 100vw;
  min-height: calc(100dvh - 55px);
  box-sizing: border-box;
  background: ${theme.gradients.hero};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.md};
`;

export const StyledHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} 0;
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

export const StyledStatItem = styled.div<{ $hasDivider?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};
  flex: 1;
  position: relative;

  ${({ $hasDivider }) =>
    $hasDivider &&
    `
    &::after {
      content: '';
      position: absolute;
      right: -${theme.spacing.md};
      top: 0;
      bottom: 0;
      width: 1px;
      background: ${theme.colors.whiteAlpha.strong};
    }
  `}
`;

export const StyledProgressBar = styled.div`
  display: flex;
  width: 100%;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  background: ${theme.colors.whiteAlpha.muted};
  gap: 2px;
`;

export const StyledProgressSegment = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.4s ease-out;
`;

export const StyledScoreProgressBar = styled.div`
  width: 100%;
  max-width: 180px;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  background: ${theme.colors.whiteAlpha.strong};
`;

export const StyledScoreProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.4s ease-out;
`;

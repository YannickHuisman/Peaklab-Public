import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledOnboardingPage = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px 80px;
`;

export const StyledContainer = styled.div`
  width: 100%;
  max-width: 620px;
`;

export const StyledProgress = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

export const StyledProgressBar = styled.div<{ $active: boolean }>`
  height: 4px;
  border-radius: 99px;
  background: ${({ $active }) => ($active ? theme.colors.ink : theme.colors.line)};
  transition: background 0.2s ease;
`;

export const StyledProgressStep = styled.div<{ $active: boolean }>`
  font-size: 11.5px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? theme.colors.ink : theme.colors.ink40)};
  margin-top: 7px;
  transition: color 0.2s ease;
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const StyledSuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledPanelCard = styled.div<{ $selected: boolean }>`
  padding: 22px;
  background: ${theme.colors.surface};
  border-radius: 18px;
  border: 2px solid ${({ $selected }) => ($selected ? theme.colors.ink : 'transparent')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
  }
`;

export const StyledChip = styled.span`
  font-size: 10.5px;
  font-weight: 700;
  color: ${theme.colors.performance};
  background: ${theme.colors.tintPerf};
  border-radius: 99px;
  padding: 3px 9px;
  white-space: nowrap;
`;

export const StyledConfirmCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${theme.colors.tintPerf};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

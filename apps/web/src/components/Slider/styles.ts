import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledSliderWrapper = styled.div``;

export const StyledSliderIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledSliderNumber = styled.span`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const StyledSliderUnit = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.primary};
`;

export const StyledSliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(
    to right,
    ${theme.colors.text.primary} 0%,
    ${theme.colors.text.primary} var(--progress, 0%),
    ${theme.colors.neutral[200]} var(--progress, 0%),
    ${theme.colors.neutral[200]} 100%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.text.primary};
    cursor: pointer;
    border: 2px solid ${theme.colors.background.raised};
    box-shadow: ${theme.shadows.base};
    margin-top: -6px;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: ${theme.borderRadius.full};
    background: transparent;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.text.primary};
    cursor: pointer;
    border: 2px solid ${theme.colors.background.raised};
    box-shadow: ${theme.shadows.base};
  }

  &::-moz-range-track {
    background: linear-gradient(
      to right,
      ${theme.colors.text.primary} 0%,
      ${theme.colors.text.primary} var(--progress, 0%),
      ${theme.colors.neutral[200]} var(--progress, 0%),
      ${theme.colors.neutral[200]} 100%
    );
    height: 8px;
    border-radius: ${theme.borderRadius.full};
  }
`;

export const StyledSliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
`;

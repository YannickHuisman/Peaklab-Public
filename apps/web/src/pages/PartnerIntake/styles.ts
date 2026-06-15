import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledIntakePage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${theme.colors.background.app};
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
  }
`;

export const StyledIntakeContainer = styled.div`
  width: 100%;
  max-width: 720px;
`;

export const StyledLogo = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

export const StyledFormSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const StyledSectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;

export const StyledFormGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
`;

export const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  transition: border-color ${theme.transitions.duration.fast} ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.strong};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

export const StyledCheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

// ─── Price input group ───────────────────────────────────────────────
export const StyledPriceLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.xs};
`;

export const StyledPriceLabelText = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const StyledOptionalBadge = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 400;
  color: ${theme.colors.text.muted};
  background: ${theme.colors.neutral[100]};
  padding: 1px 6px;
  border-radius: ${theme.borderRadius.sm};
`;

export const StyledPriceInputGroup = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: stretch;
  border: 1px solid
    ${({ $focused }) => ($focused ? theme.colors.border.strong : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background.raised};
  overflow: hidden;
  transition: border-color ${theme.transitions.duration.fast} ease;
`;

export const StyledPricePrefix = styled.span`
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.base};
  font-weight: 500;
  color: ${theme.colors.text.muted};
  background: ${theme.colors.background.app};
  border-right: 1px solid ${theme.colors.border.subtle};
  user-select: none;
  flex-shrink: 0;
`;

export const StyledPriceDivider = styled.span`
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
  background: ${theme.colors.background.app};
  border-left: 1px solid ${theme.colors.border.subtle};
  border-right: 1px solid ${theme.colors.border.subtle};
  user-select: none;
  flex-shrink: 0;
`;

export const StyledPriceNumberInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: ${theme.spacing.sm} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  font-family: inherit;

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  /* Hide number spinners */
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const StyledPriceUnitSelect = styled.select`
  border: none;
  outline: none;
  background: ${theme.colors.background.app};
  padding: ${theme.spacing.sm} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  appearance: none;
  padding-right: ${theme.spacing.xl};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.xs} center;
  border-left: 1px solid ${theme.colors.border.subtle};
`;

export const StyledPriceError = styled.span`
  display: block;
  margin-top: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.error.strong};
`;

// ─── Success page ────────────────────────────────────────────────────
export const StyledSuccessContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']};
`;

export const StyledSuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.accent.green.soft};
  color: ${theme.colors.accent.green.strong};
  margin: 0 auto ${theme.spacing.lg};
`;

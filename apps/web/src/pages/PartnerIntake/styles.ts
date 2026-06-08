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

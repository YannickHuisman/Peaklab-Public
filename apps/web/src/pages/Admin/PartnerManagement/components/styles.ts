import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledFormGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

export const StyledCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  span {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
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
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.strong};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
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

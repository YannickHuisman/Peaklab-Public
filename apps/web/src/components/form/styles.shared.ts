import styled, { css } from 'styled-components';

import { theme } from '@package/ui';

/**
 * Shared form component styles
 * Used by Input, Select, and other form components
 */

// Shared types
export type FormControlVariant = 'default' | 'inline';

// Shared wrapper component - can be used directly by Input and Select
export const StyledFormWrapper = styled.div<{ $variant?: FormControlVariant }>`
  display: flex;
  flex-direction: ${({ $variant }) => ($variant === 'inline' ? 'row' : 'column')};
  align-items: ${({ $variant }) => ($variant === 'inline' ? 'center' : 'stretch')};
  gap: ${({ $variant }) => ($variant === 'inline' ? theme.spacing.xxs : theme.spacing.xs)};

  .error {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.error.strong};
  }
`;

// For backwards compatibility / if you need separate styled components
export const formWrapperStyles = css<{ $variant?: FormControlVariant }>`
  display: flex;
  flex-direction: ${({ $variant }) => ($variant === 'inline' ? 'row' : 'column')};
  align-items: ${({ $variant }) => ($variant === 'inline' ? 'center' : 'stretch')};
  gap: ${({ $variant }) => ($variant === 'inline' ? theme.spacing.xxs : theme.spacing.xs)};

  .error {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.error.strong};
  }
`;

// Shared label styles
export const StyledLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

// Shared suffix styles
export const StyledSuffix = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
`;

// Base styles for default variant (bordered, filled background)
export const defaultFormControlStyles = css`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  transition: border-color ${theme.transitions.duration.fast} ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.strong};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Base styles for inline variant (minimal, transparent)
export const inlineFormControlStyles = css`
  border: none;
  border-bottom: 1px solid ${theme.colors.border.subtle};
  background: transparent;
  font-size: ${theme.typography.fontSize.sm};
  font-family: inherit;
  color: ${theme.colors.text.primary};
  padding: 2px 4px;
  text-align: right;
  transition: border-color ${theme.transitions.duration.fast} ease;

  &:focus {
    outline: none;
    border-bottom-color: ${theme.colors.border.strong};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Dropdown arrow SVG (encoded for use in CSS)
export const dropdownArrowDefault = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

export const dropdownArrowInline = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

export const dropdownArrowFocused = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

// Helper to generate form control IDs
export const generateFormId = (type: string, label?: string): string => {
  if (!label) return `${type}-${Math.random().toString(36).slice(2, 9)}`;

  return `${type}-${label.toLowerCase().replace(/\s/g, '-')}`;
};

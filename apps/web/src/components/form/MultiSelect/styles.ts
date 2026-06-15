import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledMultiSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  .error {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.error.strong};
  }
`;

export const StyledMultiSelectLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const StyledMultiSelectTrigger = styled.button<{ $open: boolean }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  border: 1px solid
    ${({ $open }) => ($open ? theme.colors.border.strong : theme.colors.border.subtle)};
  border-radius: ${({ $open }) =>
    $open ? `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0` : theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  text-align: left;
  transition: border-color ${theme.transitions.duration.fast} ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.strong};
  }
`;

export const StyledMultiSelectTriggerText = styled.span<{ $placeholder?: boolean }>`
  color: ${({ $placeholder }) =>
    $placeholder ? theme.colors.text.muted : theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledMultiSelectDropdown = styled.div`
  border: 1px solid ${theme.colors.border.strong};
  border-top: none;
  border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
  background: ${theme.colors.background.raised};
  max-height: 240px;
  overflow-y: auto;
`;

export const StyledMultiSelectOption = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${({ $checked }) => ($checked ? theme.colors.background.app : 'transparent')};
  transition: background ${theme.transitions.duration.fast} ease;

  &:hover {
    background: ${theme.colors.background.app};
  }

  input[type='checkbox'] {
    width: 15px;
    height: 15px;
    cursor: pointer;
    accent-color: ${theme.colors.text.primary};
    flex-shrink: 0;
  }
`;

export const StyledChevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  transition: transform 0.15s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
`;

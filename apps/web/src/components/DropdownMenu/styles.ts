import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledDropdownContent = styled.div<{ $align: 'left' | 'right' }>`
  position: absolute;
  top: calc(100% + ${theme.spacing.sm});
  ${(props) => (props.$align === 'right' ? 'right: 0;' : 'left: 0;')}
  background: ${theme.colors.background.raised};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  min-width: 200px;

  padding: ${theme.spacing.sm};
  z-index: ${theme.zIndex.dropdown};
  animation: slideDown ${theme.transitions.duration.fast} ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-${theme.spacing.sm});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledDropdownItem = styled.div<{
  $danger?: boolean;
  $interactive?: boolean;
  $disabled?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: none;
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: ${(props) => (props.$interactive && !props.$disabled ? 'pointer' : 'default')};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${(props) => (props.$disabled ? theme.colors.text.disabled : theme.colors.text.primary)};
  transition: background-color ${theme.transitions.duration.fast} ease;
  text-align: left;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
  box-sizing: border-box;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .label {
    flex: 1;
  }

  &:hover {
    background-color: ${(props) =>
      props.$interactive && !props.$disabled
        ? props.$danger
          ? theme.colors.error.soft
          : theme.colors.neutral[200]
        : 'transparent'};
  }
`;

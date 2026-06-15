import styled from 'styled-components';

export const StyledNotificationWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

export const StyledNotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${({ theme }) => theme.colors.error.strong};
  color: #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledNotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  background: ${({ theme }) => theme.colors.background.raised};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  min-width: 320px;
  max-width: 380px;
  max-height: 400px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  animation: slideDown ${({ theme }) => theme.transitions.duration.fast} ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-${({ theme }) => theme.spacing.sm});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledNotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const StyledNotificationItem = styled.button<{ $unread?: boolean }>`
  width: 100%;
  font: inherit;
  appearance: none;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.duration.fast} ease;
  background-color: transparent;
  border: none;
  border-left: 3px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

export const StyledNotificationDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent.hero.main};
  flex-shrink: 0;
  margin-top: 6px;
`;

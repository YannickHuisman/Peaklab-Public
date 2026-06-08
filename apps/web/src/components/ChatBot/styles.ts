import styled, { css, keyframes } from 'styled-components';

import { theme } from '@package/ui';

export const StyledChatWrapper = styled.div`
  display: flex;
  height: 500px;
  gap: ${theme.spacing.md};
`;

export const StyledSidebar = styled.div`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  border-right: 1px solid ${theme.colors.border.subtle};
  padding-right: ${theme.spacing.md};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.subtle};
    border-radius: ${theme.borderRadius.full};
  }
`;

export const StyledSidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border.subtle};
  margin-bottom: ${theme.spacing.xs};
  flex-shrink: 0;
`;

export const StyledNewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.accent.teal.soft};
  color: ${theme.colors.accent.teal.main};
  cursor: pointer;
  flex-shrink: 0;
  transition: background ${theme.transitions.duration.fast} ease;

  &:hover {
    background: ${theme.colors.accent.teal.main};
    color: ${theme.colors.text.inverse};
  }
`;

export const StyledConversationItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  transition: background ${theme.transitions.duration.fast} ease;
  min-height: 36px;

  ${({ $active }) =>
    $active
      ? css`
          background: ${theme.colors.accent.blue.soft};
          font-weight: 500;
        `
      : css`
          &:hover {
            background: ${theme.colors.neutral[200]};
          }
        `}
`;

export const StyledConversationTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledConversationActions = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;

  ${StyledConversationItem}:hover & {
    opacity: 1;
  }
`;

export const StyledActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  background: transparent;
  color: ${theme.colors.text.muted};
  cursor: pointer;
  padding: 0;

  &:hover {
    background: ${theme.colors.neutral[300]};
    color: ${theme.colors.text.primary};
  }
`;

export const StyledRenameInput = styled.input`
  flex: 1;
  padding: 2px ${theme.spacing.xs};
  border: 1px solid ${theme.colors.border.focus};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-family: ${theme.typography.fontFamily.primary};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  outline: none;
  min-width: 0;
`;

export const StyledSaveOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  z-index: 10;
`;

export const StyledSaveDialog = styled.div`
  background: ${theme.colors.background.raised};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadows.lg};
`;

export const StyledDialogActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
`;

export const StyledDialogButton = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background ${theme.transitions.duration.fast} ease;

  ${({ $variant }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.colors.accent.hero.main};
          color: ${theme.colors.text.inverse};
          &:hover {
            background: ${theme.colors.accent.hero.strong};
          }
        `
      : css`
          background: transparent;
          color: ${theme.colors.text.secondary};
          &:hover {
            background: ${theme.colors.neutral[200]};
          }
        `}
`;

export const StyledChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
`;

export const StyledMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.subtle};
    border-radius: ${theme.borderRadius.full};
  }
`;

export const StyledMessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  gap: ${theme.spacing.xs};
`;

export const StyledMessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 75%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.normal};
  white-space: pre-wrap;
  word-break: break-word;

  ${({ $isUser }) =>
    $isUser
      ? css`
          background-color: ${theme.colors.accent.blue.soft};
          color: ${theme.colors.accent.blue.strong};
          border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.sm}
            ${theme.borderRadius.lg};
        `
      : css`
          background-color: ${theme.colors.neutral[200]};
          color: ${theme.colors.text.primary};
          border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.lg}
            ${theme.borderRadius.sm};
        `}
`;

export const StyledAvatarIcon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledInputArea = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border.subtle};
`;

export const StyledChatInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  font-family: ${theme.typography.fontFamily.primary};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background.raised};
  outline: none;
  transition: border-color ${theme.transitions.duration.fast} ease;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    background-color: ${theme.colors.neutral[200]};
    cursor: not-allowed;
  }
`;

export const StyledSendButton = styled.button<{ $hasContent: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ease;

  ${({ $hasContent }) =>
    $hasContent
      ? css`
          background-color: ${theme.colors.accent.hero.main};
          color: ${theme.colors.text.inverse};

          &:hover {
            background-color: ${theme.colors.accent.hero.strong};
          }
        `
      : css`
          background-color: ${theme.colors.neutral[200]};
          color: ${theme.colors.text.muted};
          cursor: default;
        `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const typingDot = keyframes`
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
`;

export const StyledTypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: ${theme.spacing.xs} 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: ${theme.borderRadius.full};
    background-color: ${theme.colors.text.muted};
    animation: ${typingDot} 1.4s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

export const StyledEmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
`;

export const StyledEmptyStateIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledErrorMessage = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.error.soft};
  color: ${theme.colors.error.strong};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
`;

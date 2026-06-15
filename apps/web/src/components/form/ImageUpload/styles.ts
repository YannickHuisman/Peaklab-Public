import styled from 'styled-components';

import { theme } from '@package/ui';

const DROPZONE_HEIGHT = 180;

export const StyledDropzone = styled.label<{ $hasImage: boolean; $isDragging: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  height: ${DROPZONE_HEIGHT}px;
  border: 2px dashed
    ${({ $isDragging }) => ($isDragging ? theme.colors.border.strong : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.md};
  background: ${({ $isDragging, $hasImage }) =>
    $hasImage
      ? theme.colors.neutral[200]
      : $isDragging
        ? theme.colors.background.app
        : theme.colors.background.raised};
  cursor: pointer;
  transition:
    border-color ${theme.transitions.duration.fast} ease,
    background ${theme.transitions.duration.fast} ease;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    border-color: ${theme.colors.border.strong};
  }

  input[type='file'] {
    display: none;
  }
`;

export const StyledPreview = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const StyledRemoveButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: background ${theme.transitions.duration.fast} ease;

  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`;

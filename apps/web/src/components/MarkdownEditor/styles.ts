import styled, { createGlobalStyle } from 'styled-components';

import { theme } from '@package/ui';

export const StyledMDEditorGlobal = createGlobalStyle`
  .wmde-markdown-var {
    --color-canvas-default: ${theme.colors.background.raised};
    --color-canvas-subtle: ${theme.colors.background.subtle};
    --color-border-default: ${theme.colors.border.subtle};
    --color-border-muted: ${theme.colors.border.subtle};
    --color-fg-default: ${theme.colors.text.primary};
    --color-fg-muted: ${theme.colors.text.secondary};
    --color-accent-fg: ${theme.colors.primary};
    --color-btn-bg: ${theme.colors.background.subtle};
    --color-btn-hover-bg: ${theme.colors.background.default};
    --color-btn-border: ${theme.colors.border.subtle};
    --md-editor-font-size: ${theme.typography.fontSize.base};
    --color-prettylights-syntax-comment: ${theme.colors.text.muted};
  }
`;

export const StyledEditorWrapper = styled.div`
  .w-md-editor {
    border: 1px solid ${theme.colors.border.subtle};
    border-radius: ${theme.borderRadius.md};
    box-shadow: none;
    font-family: inherit;

    &:focus-within {
      border-color: ${theme.colors.border.focus};
      outline: none;
    }
  }

  .w-md-editor-toolbar {
    border-bottom: 1px solid ${theme.colors.border.subtle};
    background: ${theme.colors.background.subtle};
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};

    ul li button {
      color: ${theme.colors.text.secondary};

      &:hover {
        color: ${theme.colors.text.primary};
        background: ${theme.colors.background.default};
      }
    }
  }

  .w-md-editor-content {
    background: ${theme.colors.background.raised};
    border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
  }

  .w-md-editor-text-pre,
  .w-md-editor-text-input,
  .w-md-editor-text {
    font-size: ${theme.typography.fontSize.base} !important;
    line-height: 1.6 !important;
    font-family: inherit !important;
    color: ${theme.colors.text.primary} !important;
  }

  .wmde-markdown {
    background: transparent;
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
    font-family: inherit;
  }
`;

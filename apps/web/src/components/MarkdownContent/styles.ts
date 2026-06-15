import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledMarkdown = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
  font-weight: 500;
  line-height: 1.6;

  p {
    margin: 0 0 ${theme.spacing.sm} 0;
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    font-weight: 700;
    color: ${theme.colors.text.primary};
  }

  em {
    font-style: italic;
  }

  ul,
  ol {
    margin: 0 0 ${theme.spacing.sm} 0;
    padding-left: ${theme.spacing.lg};
    &:last-child {
      margin-bottom: 0;
    }
  }

  li {
    margin-bottom: ${theme.spacing.xs};
  }

  h1,
  h2,
  h3 {
    font-weight: 700;
    margin: ${theme.spacing.md} 0 ${theme.spacing.xs} 0;
    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: ${theme.typography.fontSize.lg};
  }
  h2 {
    font-size: ${theme.typography.fontSize.base};
  }
  h3 {
    font-size: ${theme.typography.fontSize.sm};
  }

  code {
    background: ${theme.colors.background.subtle};
    padding: 2px 6px;
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSize.sm};
    font-family: monospace;
  }

  hr {
    border: none;
    border-top: 1px solid ${theme.colors.border};
    margin: ${theme.spacing.md} 0;
  }
`;

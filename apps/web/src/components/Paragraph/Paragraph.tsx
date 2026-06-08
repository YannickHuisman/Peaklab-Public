import React from 'react';

import { StyledParagraph } from './styles';
import type { StyledParagraphProps } from './types';

interface ParagraphProps extends StyledParagraphProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Paragraph({ children, ...props }: ParagraphProps) {
  return <StyledParagraph {...props}>{children}</StyledParagraph>;
}

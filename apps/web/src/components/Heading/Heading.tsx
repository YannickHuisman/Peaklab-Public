import React from 'react';

import { StyledHeading } from './styles';
import type { StyledHeadingProps } from './types';

interface HeadingProps extends StyledHeadingProps {
  children: React.ReactNode;
}

export function Heading({ children, ...props }: HeadingProps) {
  return <StyledHeading {...props}>{children}</StyledHeading>;
}

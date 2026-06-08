import type React from 'react';

import { StyledCard } from './styles';
import type { StyledCardProps } from './types';

interface CardProps extends StyledCardProps, React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return <StyledCard {...props}>{children}</StyledCard>;
}

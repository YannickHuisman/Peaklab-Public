import { StyledDivider } from './styles';

interface DividerProps {
  children?: React.ReactNode;
}

export function Divider({ children }: DividerProps) {
  return <StyledDivider $hasChildren={!!children}>{children}</StyledDivider>;
}

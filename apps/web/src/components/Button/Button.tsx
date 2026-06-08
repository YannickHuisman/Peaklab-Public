import { StyledButton } from './styles';
import type { StyledButtonProps } from './types';

interface ButtonProps extends StyledButtonProps {
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Button({
  label,
  type = 'button',
  disabled,
  onClick,
  children,
  ...props
}: ButtonProps) {
  if ((label && children) || (!label && !children)) {
    throw new Error('Button must have either label or children, but not both.');
  }

  return (
    <StyledButton type={type} onClick={onClick} disabled={disabled} {...props}>
      {children ?? label}
    </StyledButton>
  );
}

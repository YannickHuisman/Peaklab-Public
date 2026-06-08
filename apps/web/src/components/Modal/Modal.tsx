import { useEffect } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';

import {
  StyledModalBody,
  StyledModalCloseButton,
  StyledModalContent,
  StyledModalHeader,
  StyledModalOverlay,
} from './styles';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  hideCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px',
  hideCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledModalOverlay onClick={handleOverlayClick}>
      <StyledModalContent $maxWidth={maxWidth}>
        {title && (
          <StyledModalHeader>
            <Heading $size="large">{title}</Heading>
            {!hideCloseButton && (
              <Button $variant="ghost" $size="small" onClick={onClose}>
                <Icons.X />
              </Button>
            )}
          </StyledModalHeader>
        )}
        {!title && !hideCloseButton && (
          <StyledModalCloseButton>
            <Button $variant="ghost" $size="small" onClick={onClose}>
              <Icons.X />
            </Button>
          </StyledModalCloseButton>
        )}
        <StyledModalBody>{children}</StyledModalBody>
      </StyledModalContent>
    </StyledModalOverlay>
  );
}

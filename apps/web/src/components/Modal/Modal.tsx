import { useId, useRef } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { useFocusTrap } from '@hooks/useFocusTrap';

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
  /** Accessible name when no visible title is rendered. */
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px',
  hideCloseButton = false,
  ariaLabel,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useFocusTrap(contentRef, isOpen, onClose);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledModalOverlay onClick={handleOverlayClick}>
      <StyledModalContent
        ref={contentRef}
        $maxWidth={maxWidth}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
      >
        {title && (
          <StyledModalHeader>
            <Heading $size="large" id={titleId}>
              {title}
            </Heading>
            {!hideCloseButton && (
              <Button $variant="ghost" $size="small" onClick={onClose} aria-label="Sluiten">
                <Icons.X />
              </Button>
            )}
          </StyledModalHeader>
        )}
        {!title && !hideCloseButton && (
          <StyledModalCloseButton>
            <Button $variant="ghost" $size="small" onClick={onClose} aria-label="Sluiten">
              <Icons.X />
            </Button>
          </StyledModalCloseButton>
        )}
        <StyledModalBody>{children}</StyledModalBody>
      </StyledModalContent>
    </StyledModalOverlay>
  );
}

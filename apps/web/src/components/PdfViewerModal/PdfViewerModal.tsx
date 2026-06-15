import { useRef } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { useFocusTrap } from '@hooks/useFocusTrap';

import { StyledModalOverlay } from '../Modal/styles';
import { StyledPdfFrame, StyledPdfModalContent, StyledPdfModalHeader } from './styles';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  signedUrl: string | null;
  title?: string;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  signedUrl,
  title = 'Document',
}: PdfViewerModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap(contentRef, isOpen && !!signedUrl, onClose);

  if (!isOpen || !signedUrl) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <StyledModalOverlay onClick={handleOverlayClick}>
      <StyledPdfModalContent
        ref={contentRef}
        $maxWidth="90vw"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <StyledPdfModalHeader>
          <Heading $size="small">{title}</Heading>
          <Button $variant="ghost" $size="small" onClick={onClose} aria-label="Sluiten">
            <Icons.X aria-hidden="true" />
          </Button>
        </StyledPdfModalHeader>

        <StyledPdfFrame src={signedUrl} title={title} />
      </StyledPdfModalContent>
    </StyledModalOverlay>
  );
}

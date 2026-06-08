import { useEffect } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';

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
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !signedUrl) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <StyledModalOverlay onClick={handleOverlayClick}>
      <StyledPdfModalContent $maxWidth="90vw">
        <StyledPdfModalHeader>
          <Heading $size="small">{title}</Heading>
          <Button $variant="ghost" $size="small" onClick={onClose}>
            <Icons.X />
          </Button>
        </StyledPdfModalHeader>

        <StyledPdfFrame src={signedUrl} title={title} />
      </StyledPdfModalContent>
    </StyledModalOverlay>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { PdfViewerModal } from '@components/PdfViewerModal';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';

import type { BloodResultUpload } from '@package/types';
import { theme } from '@package/ui';

import { StyledDropZone, StyledFileInput, StyledStatusBadge } from './styles';

export function BloodResultUploads() {
  const { t } = useTranslation();

  const STATUS_LABELS: Record<string, { label: string; tone: string }> = {
    pending: { label: t('In afwachting'), tone: 'warning' },
    in_review: { label: t('In beoordeling'), tone: 'info' },
    processed: { label: t('Verwerkt'), tone: 'success' },
    rejected: { label: t('Afgewezen'), tone: 'error' },
  };

  const [uploads, setUploads] = useState<BloodResultUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleViewUpload = useCallback(async (uploadId: string, fileName: string) => {
    setOpeningId(uploadId);

    try {
      const response = await authenticatedFetch(`/api/uploads/${uploadId}/signed-url`);

      if (response.ok) {
        const data = await response.json();

        setPdfTitle(fileName);
        setPdfUrl(data.signedUrl);
      }
    } finally {
      setOpeningId(null);
    }
  }, []);

  const fetchUploads = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/uploads/my-uploads');

      if (response.ok) {
        const data = await response.json();

        setUploads(data.uploads);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleUpload = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      console.error(t('Alleen PDF-bestanden toegestaan'));

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error(t('Bestand is te groot (max 10MB)'));

      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append('file', file);

      const response = await authenticatedFetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchUploads();
      } else {
        const data = await response.json();

        console.error(data.error || t('Upload mislukt'));
      }
    } catch {
      console.error(t('Upload mislukt, probeer het opnieuw'));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];

    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) handleUpload(file);
    e.target.value = '';
  };

  return (
    <FlexColumn $gap="lg">
      <PageHeader
        title={t('Bloedresultaten uploaden')}
        subtitle={t('Upload je bloedresultaten als PDF')}
      />

      <StyledCard $padding="2xl">
        <FlexColumn $gap="lg" $align="center">
          <StyledDropZone
            $active={dragActive}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icons.Clipboard size="xl" color={theme.colors.accent.hero.main} />
            <Heading $size="small">
              {uploading ? t('Uploaden...') : t('Sleep je PDF hierheen')}
            </Heading>
            <Paragraph $variant="secondary" $size="small">
              {t('Max 10MB per bestand')}
            </Paragraph>
          </StyledDropZone>

          <StyledFileInput
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            aria-label={t('Selecteer PDF')}
          />

          <Button
            label={uploading ? t('Uploaden...') : t('Selecteer PDF')}
            $variant="primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          />
        </FlexColumn>
      </StyledCard>

      <FlexColumn $gap="md">
        <Heading $size="small">{t('Mijn uploads')}</Heading>

        {loading && <Loader />}

        {!loading && uploads.length === 0 && (
          <StyledCard $padding="lg">
            <Paragraph $variant="secondary" $align="center">
              {t('Nog geen uploads')}
            </Paragraph>
          </StyledCard>
        )}

        {uploads.map((upload) => {
          const statusConfig = STATUS_LABELS[upload.status] || STATUS_LABELS.pending;

          return (
            <StyledCard key={upload.id} $padding="lg">
              <FlexRow $justify="space-between" $align="center" $gap="md">
                <FlexRow $gap="md" $align="center">
                  <Icons.Clipboard size="md" color={theme.colors.text.secondary} />
                  <FlexColumn $gap="xs">
                    <Paragraph $weight={500}>{upload.file_name}</Paragraph>
                    <Paragraph $size="small" $variant="secondary">
                      {new Date(upload.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Paragraph>
                  </FlexColumn>
                </FlexRow>

                <FlexRow $gap="sm" $align="center">
                  <StyledStatusBadge $tone={statusConfig.tone}>
                    {statusConfig.label}
                  </StyledStatusBadge>
                  {upload.admin_notes && (
                    <Paragraph $size="xsmall" $variant="secondary">
                      {upload.admin_notes}
                    </Paragraph>
                  )}
                  <Button
                    $variant="ghost"
                    $size="small"
                    disabled={openingId === upload.id}
                    onClick={() => handleViewUpload(upload.id, upload.file_name)}
                    aria-label={`${upload.file_name} ${t('bekijken')}`}
                  >
                    <Icons.Eye size="sm" aria-hidden="true" />
                  </Button>
                </FlexRow>
              </FlexRow>
            </StyledCard>
          );
        })}
      </FlexColumn>

      <PdfViewerModal
        isOpen={!!pdfUrl}
        onClose={() => setPdfUrl(null)}
        signedUrl={pdfUrl}
        title={pdfTitle}
      />
    </FlexColumn>
  );
}

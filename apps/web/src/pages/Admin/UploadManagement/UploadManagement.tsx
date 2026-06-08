import { useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { type Column, DataTable } from '@components/DataTable';
import { Icons } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { PdfViewerModal } from '@components/PdfViewerModal';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';

import type { BloodResultUploadWithUser, UploadStatus } from '@package/types';

import { StyledStatusBadge } from '../../BloodResultUploads/styles';
import { UploadDetailModal } from './components/UploadDetailModal';
import { STATUS_FILTERS, STATUS_LABELS } from './constants';

export function UploadManagement() {
  const { t } = useTranslation();

  const [uploads, setUploads] = useState<BloodResultUploadWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUpload, setSelectedUpload] = useState<BloodResultUploadWithUser | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');

  const fetchUploads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await authenticatedFetch(`/api/uploads/admin/all${params}`);

      if (response.ok) {
        const data = await response.json();

        setUploads(data.uploads ?? []);
      } else {
        const errorData = await response.json().catch(() => null);

        setError(errorData?.error || `Server fout (${response.status})`);
      }
    } catch (err) {
      console.error(err);
      setError(t('Kan geen verbinding maken met de server'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, t]);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleStatusUpdate = async (uploadId: string, newStatus: UploadStatus) => {
    setUpdating(true);

    try {
      const response = await authenticatedFetch(`/api/uploads/admin/${uploadId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNotes || undefined,
        }),
      });

      if (response.ok) {
        setSelectedUpload(null);
        setAdminNotes('');
        await fetchUploads();
      }
    } catch {
      console.error(t('Status bijwerken mislukt'));
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenFile = async (uploadId: string, fileName: string) => {
    try {
      const response = await authenticatedFetch(`/api/uploads/admin/${uploadId}/signed-url`);

      if (response.ok) {
        const data = await response.json();

        setPdfTitle(fileName);
        setPdfUrl(data.signedUrl);
      } else {
        console.error(t('Kan bestand niet openen'));
      }
    } catch {
      console.error(t('Kan bestand niet openen'));
    }
  };

  const columns: Column<BloodResultUploadWithUser>[] = [
    {
      id: 'user',
      header: t('Gebruiker'),
      cell: (row) => (
        <Paragraph $size="small" $weight={500}>
          {row.user?.full_name || row.user?.username || t('Onbekend')}
        </Paragraph>
      ),
    },
    {
      id: 'file',
      header: t('Bestand'),
      cell: (row) => <Paragraph $size="small">{row.file_name}</Paragraph>,
    },
    {
      id: 'date',
      header: t('Datum'),
      cell: (row) => (
        <Paragraph $size="small" $variant="secondary">
          {new Date(row.created_at).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Paragraph>
      ),
    },
    {
      id: 'status',
      header: t('Status'),
      cell: (row) => {
        const config = STATUS_LABELS[row.status];

        return <StyledStatusBadge $tone={config.tone}>{t(config.label)}</StyledStatusBadge>;
      },
    },
    {
      id: 'actions',
      header: '',
      width: '120px',
      cell: (row) => (
        <FlexRow $gap="sm">
          <Button
            $variant="secondary"
            $size="small"
            onClick={() => handleOpenFile(row.id, row.file_name)}
          >
            <Icons.Eye size="sm" />
          </Button>
          <Button
            $variant="secondary"
            $size="small"
            onClick={() => {
              setSelectedUpload(row);
              setAdminNotes(row.admin_notes || '');
            }}
          >
            <Icons.Edit size="sm" />
          </Button>
        </FlexRow>
      ),
    },
  ];

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title={t('Upload beheer')}
        subtitle={t('Bekijk en verwerk bloedresultaat uploads van gebruikers')}
        backHref="/admin"
      />

      <StyledCard $flex={1}>
        <FlexColumn $gap="lg" $flex={1}>
          <FlexRow $gap="sm">
            {STATUS_FILTERS.map((filter) => (
              <StyledCard
                key={filter.value}
                $variant="pill"
                $active={statusFilter === filter.value}
                $tone={statusFilter === filter.value ? 'hero' : 'neutral'}
                onClick={() => setStatusFilter(filter.value)}
              >
                {t(filter.label)}
              </StyledCard>
            ))}
          </FlexRow>

          <DataTable columns={columns} data={uploads} isLoading={loading} rowKey={(r) => r.id} />
        </FlexColumn>
      </StyledCard>

      {error && (
        <StyledCard $padding="lg">
          <FlexRow $gap="sm" $align="center">
            <Paragraph $size="small" $variant="secondary">
              {error}
            </Paragraph>
            <Button
              $variant="secondary"
              $size="small"
              label={t('Opnieuw proberen')}
              onClick={fetchUploads}
            />
          </FlexRow>
        </StyledCard>
      )}

      <PdfViewerModal
        isOpen={!!pdfUrl}
        onClose={() => setPdfUrl(null)}
        signedUrl={pdfUrl}
        title={pdfTitle}
      />

      {selectedUpload && (
        <UploadDetailModal
          upload={selectedUpload}
          adminNotes={adminNotes}
          updating={updating}
          onClose={() => setSelectedUpload(null)}
          onAdminNotesChange={setAdminNotes}
          onStatusUpdate={handleStatusUpdate}
          onOpenFile={handleOpenFile}
        />
      )}
    </FlexColumn>
  );
}

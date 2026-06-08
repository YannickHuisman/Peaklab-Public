import { useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { type Column, DataTable } from '@components/DataTable';
import { Icons } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { authenticatedFetch } from '@helpers/authenticatedFetch';

import type { PartnerApplicationWithReviewer } from '@package/types';

import { StyledStatusBadge } from '../../BloodResultUploads/styles';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { STATUS_FILTERS, STATUS_LABELS, TYPE_LABELS } from './constants';

export function ApplicationManagement() {
  const [applications, setApplications] = useState<PartnerApplicationWithReviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] =
    useState<PartnerApplicationWithReviewer | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await authenticatedFetch(`/api/partner-applications/admin${params}`);

      if (response.ok) {
        const data = await response.json();

        setApplications(data.applications ?? []);
      } else {
        const errorData = await response.json().catch(() => null);

        setError(errorData?.error || `Server fout (${response.status})`);
      }
    } catch {
      setError('Kan geen verbinding maken met de server');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async () => {
    if (!selectedApplication) return;
    setUpdating(true);

    try {
      const response = await authenticatedFetch(
        `/api/partner-applications/admin/${selectedApplication.id}/approve`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_notes: adminNotes || undefined }),
        }
      );

      if (response.ok) {
        setSelectedApplication(null);
        setAdminNotes('');
        await fetchApplications();
      } else {
        const data = await response.json().catch(() => null);

        console.error(data?.error || 'Goedkeuren mislukt');
      }
    } catch {
      console.error('Goedkeuren mislukt');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeny = async () => {
    if (!selectedApplication) return;
    setUpdating(true);

    try {
      const response = await authenticatedFetch(
        `/api/partner-applications/admin/${selectedApplication.id}/deny`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_notes: adminNotes || undefined }),
        }
      );

      if (response.ok) {
        setSelectedApplication(null);
        setAdminNotes('');
        await fetchApplications();
      } else {
        const data = await response.json().catch(() => null);

        console.error(data?.error || 'Afwijzen mislukt');
      }
    } catch {
      console.error('Afwijzen mislukt');
    } finally {
      setUpdating(false);
    }
  };

  const columns: Column<PartnerApplicationWithReviewer>[] = [
    {
      id: 'company',
      header: 'Bedrijf',
      cell: (row) => (
        <Paragraph $size="small" $weight={500}>
          {row.company_name}
        </Paragraph>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (row) => <Paragraph $size="small">{TYPE_LABELS[row.type] || row.type}</Paragraph>,
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: (row) => (
        <FlexColumn $gap="xxs">
          <Paragraph $size="small">{row.contact_name}</Paragraph>
          <Paragraph $size="xsmall" $variant="secondary">
            {row.contact_email}
          </Paragraph>
        </FlexColumn>
      ),
    },
    {
      id: 'date',
      header: 'Datum',
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
      header: 'Status',
      cell: (row) => {
        const config = STATUS_LABELS[row.status];

        return <StyledStatusBadge $tone={config.tone}>{config.label}</StyledStatusBadge>;
      },
    },
    {
      id: 'actions',
      header: '',
      width: '80px',
      cell: (row) => (
        <Button
          $variant="secondary"
          $size="small"
          onClick={() => {
            setSelectedApplication(row);
            setAdminNotes(row.admin_notes || '');
          }}
        >
          <Icons.Eye size="sm" />
        </Button>
      ),
    },
  ];

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title="Partner aanvragen"
        subtitle="Bekijk en beoordeel partner aanvragen"
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
                {filter.label}
              </StyledCard>
            ))}
          </FlexRow>

          <DataTable
            columns={columns}
            data={applications}
            isLoading={loading}
            rowKey={(r) => r.id}
          />
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
              label="Opnieuw proberen"
              onClick={fetchApplications}
            />
          </FlexRow>
        </StyledCard>
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          adminNotes={adminNotes}
          updating={updating}
          onClose={() => setSelectedApplication(null)}
          onAdminNotesChange={setAdminNotes}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      )}
    </FlexColumn>
  );
}

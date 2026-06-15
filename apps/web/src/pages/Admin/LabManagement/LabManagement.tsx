import { useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { type Column, DataTable } from '@components/DataTable';
import { Input } from '@components/form/Input';
import { TextArea } from '@components/form/TextArea';
import { Icons } from '@components/Icons';
import { Modal } from '@components/Modal';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';
import { useForm } from '@hooks/useForm';

import type { Lab } from '@package/types';

import { LabReferencesModal } from './components/LabReferencesModal';

interface LabFormData {
  name: string;
  description: string;
  website_url: string;
}

const INITIAL_VALUES: LabFormData = { name: '', description: '', website_url: '' };

export function LabManagement() {
  const { t } = useTranslation();

  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [referencesLabId, setReferencesLabId] = useState<number | null>(null);

  const fetchLabs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch('/api/labs');

      if (response.ok) {
        const data = await response.json();

        setLabs(data.labs ?? []);
      } else {
        const errorData = await response.json().catch(() => null);

        setError(errorData?.error || `Server fout (${response.status})`);
      }
    } catch (err) {
      console.error('Error fetching labs:', err);
      setError(t('Kan geen verbinding maken met de server'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const { getFieldProps, handleSubmit, isSubmitting, reset, setValues } = useForm<LabFormData>({
    initialValues: INITIAL_VALUES,
    requiredFields: ['name'],
    onSubmit: async (values) => {
      const url = editingLab ? `/api/labs/admin/${editingLab.id}` : '/api/labs/admin';
      const method = editingLab ? 'PUT' : 'POST';
      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || t('Opslaan mislukt'));
      }

      setShowForm(false);
      setEditingLab(null);
      reset();
      await fetchLabs();
    },
  });

  const handleDelete = async (labId: number) => {
    if (!confirm(t('Weet je zeker dat je dit lab wilt verwijderen?'))) return;

    try {
      const response = await authenticatedFetch(`/api/labs/admin/${labId}`, { method: 'DELETE' });

      if (response.ok) {
        await fetchLabs();
      } else {
        console.error(t('Verwijderen mislukt. Dit lab heeft mogelijk nog referenties.'));
      }
    } catch {
      console.error(t('Verwijderen mislukt'));
    }
  };

  const openEdit = (lab: Lab) => {
    setEditingLab(lab);
    setValues({
      name: lab.name,
      description: lab.description || '',
      website_url: lab.website_url || '',
    });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingLab(null);
    reset();
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingLab(null);
    reset();
  };

  const columns: Column<Lab>[] = [
    {
      id: 'name',
      header: t('Naam'),
      cell: (row) => <Paragraph $weight={500}>{row.name}</Paragraph>,
    },
    {
      id: 'description',
      header: t('Beschrijving'),
      cell: (row) => (
        <Paragraph $size="small" $variant="secondary">
          {row.description || '-'}
        </Paragraph>
      ),
    },
    {
      id: 'status',
      header: t('Status'),
      width: '100px',
      cell: (row) => (
        <Paragraph $size="small" $color={row.is_active ? 'green' : 'red'}>
          {row.is_active ? t('Actief') : t('Inactief')}
        </Paragraph>
      ),
    },
    {
      id: 'actions',
      header: '',
      width: '180px',
      cell: (row) => (
        <FlexRow $gap="sm">
          <Button
            $variant="secondary"
            $size="small"
            onClick={() => setReferencesLabId(row.id)}
            aria-label={t('Referentiewaarden')}
          >
            <Icons.Settings size="sm" aria-hidden="true" />
          </Button>
          <Button
            $variant="secondary"
            $size="small"
            onClick={() => openEdit(row)}
            aria-label={t('Bewerken')}
          >
            <Icons.Edit size="sm" aria-hidden="true" />
          </Button>
          <Button
            $variant="secondary"
            $size="small"
            onClick={() => handleDelete(row.id)}
            aria-label={t('Verwijderen')}
          >
            <Icons.Trash size="sm" aria-hidden="true" />
          </Button>
        </FlexRow>
      ),
    },
  ];

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title={t('Lab beheer')}
        subtitle={t('Beheer labs en hun biomarker referentiewaarden')}
        backHref="/admin"
      />

      <StyledCard $flex={1}>
        <FlexColumn $gap="lg" $flex={1}>
          <FlexRow $justify="flex-end">
            <Button label={t('Lab toevoegen')} onClick={openCreate} />
          </FlexRow>

          <DataTable
            columns={columns}
            data={labs}
            isLoading={loading}
            rowKey={(r) => String(r.id)}
          />
        </FlexColumn>
      </StyledCard>

      {error && (
        <StyledCard $padding="lg" $showBorder>
          <FlexRow $gap="sm" $align="center">
            <Paragraph $size="small" $variant="secondary">
              {error}
            </Paragraph>
            <Button
              $variant="secondary"
              $size="small"
              label={t('Opnieuw proberen')}
              onClick={fetchLabs}
            />
          </FlexRow>
        </StyledCard>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleClose}
        title={editingLab ? t('Lab bewerken') : t('Nieuw lab')}
      >
        <form onSubmit={handleSubmit}>
          <FlexColumn $gap="md">
            <Input
              label={t('Naam *')}
              {...getFieldProps('name')}
              placeholder={t('bv. Synlab, Star-shl')}
            />
            <TextArea label={t('Beschrijving')} {...getFieldProps('description')} />
            <Input
              label="Website URL"
              {...getFieldProps('website_url')}
              placeholder="https://..."
            />
            <FlexRow $gap="sm" $justify="flex-end">
              <Button $variant="secondary" label={t('Annuleren')} onClick={handleClose} />
              <Button
                type="submit"
                label={isSubmitting ? t('Opslaan...') : t('Opslaan')}
                disabled={isSubmitting}
              />
            </FlexRow>
          </FlexColumn>
        </form>
      </Modal>

      {referencesLabId && (
        <LabReferencesModal
          labId={referencesLabId}
          labName={labs.find((l) => l.id === referencesLabId)?.name || ''}
          onClose={() => setReferencesLabId(null)}
        />
      )}
    </FlexColumn>
  );
}

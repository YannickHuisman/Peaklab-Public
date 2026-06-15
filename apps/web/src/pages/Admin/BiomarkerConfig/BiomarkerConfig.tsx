import { useState } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Icons } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useModal } from '@context/ModalProvider';

import type { BiomarkerWithConfig } from '@package/api';
import { useAppData } from '@package/api';

import { authenticatedFetch } from '../../../helpers/authenticatedFetch';
import { BiomarkerForm } from './components/BiomarkerForm';
import { BiomarkersTable } from './components/BiomarkersTable';

export function BiomarkerConfig() {
  const { openModal, closeModal } = useModal();
  const { categories, biomarkers, panels, refetchBiomarkers, loading } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleSuccess = async () => {
    closeModal();
    await refetchBiomarkers();
  };

  const handleCreate = () => {
    openModal({
      title: 'Create New Biomarker',
      content: (
        <BiomarkerForm
          key={`create-${Date.now()}`}
          biomarker={null}
          categories={categories}
          panels={panels}
          biomarkers={biomarkers}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      ),
    });
  };

  const handleEdit = (biomarker: BiomarkerWithConfig) => {
    openModal({
      title: 'Edit Biomarker',
      content: (
        <BiomarkerForm
          key={`edit-${biomarker.id}-${Date.now()}`}
          biomarker={biomarker}
          categories={categories}
          panels={panels}
          biomarkers={biomarkers}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      ),
    });
  };

  const handleDelete = async (biomarkerId: number) => {
    if (!confirm('Are you sure you want to delete this biomarker?')) return;

    try {
      await authenticatedFetch(`/api/biomarkers/admin/${biomarkerId}`, {
        method: 'DELETE',
      });

      await refetchBiomarkers();
    } catch (error) {
      console.error('Failed to delete biomarker', error);
    }
  };

  const filteredBiomarkers = biomarkers.filter((biomarker) => {
    const matchesSearch =
      searchQuery === '' ||
      biomarker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biomarker.display_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === null || biomarker.category.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title="Biomarker Configuration"
        subtitle="Manage biomarkers, units, and reference ranges"
        backHref="/admin"
      />

      <StyledCard $flex={1}>
        <FlexColumn $gap="lg" $flex={1}>
          <FlexRow $align="center" $justify="space-between" $gap="md" $flexWrap="wrap">
            <FlexRow $align="center" $gap="md" $flex={1} $flexWrap="wrap" $minWidth="0">
              <Input
                placeholder="Search biomarkers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Icons.Search />}
                style={{ maxWidth: '400px', minWidth: '200px' }}
              />
              <Select
                value={selectedCategory?.toString() || ''}
                onChange={(e) =>
                  setSelectedCategory(e.target.value ? Number(e.target.value) : null)
                }
                options={categories.map((cat) => ({
                  value: String(cat.id),
                  label: cat.name,
                }))}
                placeholder="All Categories"
                style={{ maxWidth: '200px' }}
              />
            </FlexRow>
            <Button onClick={handleCreate}>
              <Icons.Plus />
              Add Biomarker
            </Button>
          </FlexRow>

          {loading && <Paragraph>Loading biomarkers...</Paragraph>}
          {!loading && (
            <BiomarkersTable
              biomarkers={filteredBiomarkers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </FlexColumn>
      </StyledCard>
    </FlexColumn>
  );
}

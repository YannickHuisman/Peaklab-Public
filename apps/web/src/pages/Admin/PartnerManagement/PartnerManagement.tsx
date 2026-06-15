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

import type { Partner, PartnerType } from '@package/api';
import { useAppData } from '@package/api';

import { authenticatedFetch } from '../../../helpers/authenticatedFetch';
import { PartnerForm } from './components';
import { PartnersTable } from './components';

const PARTNER_TYPE_OPTIONS: { value: PartnerType | ''; label: string }[] = [
  { value: 'trainer', label: 'Trainer' },
  { value: 'expert', label: 'Expert' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
];

export function PartnerManagement() {
  const { openModal, closeModal } = useModal();
  const { partners, refetchPartners, loading } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PartnerType | ''>('');

  const handleSuccess = async () => {
    closeModal();
    await refetchPartners();
  };

  const handleCreate = () => {
    openModal({
      title: 'Create New Partner',
      content: <PartnerForm partner={null} onSuccess={handleSuccess} onCancel={closeModal} />,
      size: 'large',
    });
  };

  const handleEdit = (partner: Partner) => {
    openModal({
      title: 'Edit Partner',
      content: <PartnerForm partner={partner} onSuccess={handleSuccess} onCancel={closeModal} />,
      size: 'large',
    });
  };

  const handleDelete = async (partnerId: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      await authenticatedFetch(`/api/partners/admin/${partnerId}`, {
        method: 'DELETE',
      });

      await refetchPartners();
    } catch (error) {
      console.error('Failed to delete partner', error);
    }
  };

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      searchQuery === '' ||
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === '' || partner.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title="Partner Management"
        subtitle="Manage partners, trainers, experts, and affiliates"
        backHref="/admin"
      />

      <StyledCard $flex={1}>
        <FlexColumn $gap="lg" $flex={1}>
          <FlexRow $align="center" $justify="space-between" $gap="md" $flexWrap="wrap">
            <FlexRow $align="center" $gap="md" $flex={1} $flexWrap="wrap" $minWidth="0">
              <Input
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Icons.Search />}
                style={{ maxWidth: '400px', minWidth: '200px' }}
              />
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PartnerType | '')}
                options={PARTNER_TYPE_OPTIONS}
                placeholder="All Types"
                style={{ maxWidth: '160px' }}
              />
            </FlexRow>
            <Button onClick={handleCreate}>
              <Icons.Plus />
              Add Partner
            </Button>
          </FlexRow>

          {loading && <Paragraph>Loading partners...</Paragraph>}
          {!loading && (
            <PartnersTable
              partners={filteredPartners}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </FlexColumn>
      </StyledCard>
    </FlexColumn>
  );
}

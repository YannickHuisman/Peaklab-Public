import { memo, useCallback, useMemo, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Select } from '@components/form/Select';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { OptimizedImage } from '@components/OptimizedImage';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { Tabs } from '@components/Tabs';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import type { Partner, TrainerSpecialization } from '@package/api';
import { useAppData } from '@package/api';
import { theme } from '@package/ui';

import { GENDER_OPTIONS, PARTNER_TABS, REGION_OPTIONS, SPECIALIZATION_OPTIONS } from './consts';
import {
  StyledDescriptionText,
  StyledPartnerCardImage,
  StyledPartnerRating,
  StyledPartnerTag,
} from './styles';
import type { PartnerTabId } from './types';

// Partner Card Component
interface PartnerCardProps {
  partner: Partner;
}

const PartnerCard = memo(function PartnerCard({ partner }: PartnerCardProps) {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (partner.affiliate_url) {
      window.open(partner.affiliate_url, '_blank', 'noopener,noreferrer');
    }
  }, [partner.affiliate_url]);

  return (
    <StyledCard $variant="neutral" $overflow="hidden" style={{ padding: 0 }}>
      <StyledPartnerCardImage>
        <OptimizedImage
          src={partner.image_url}
          alt={partner.name}
          height="180px"
          objectFit="cover"
          fallbackIcon={<Icons.User size="xl" color={theme.colors.text.muted} />}
        />
      </StyledPartnerCardImage>

      <FlexColumn $gap="sm" $pt="md" $pl="md" $pr="md" $flex={1}>
        <FlexRow $justify="space-between" $align="flex-start" $gap="sm">
          <FlexColumn $gap="xxs" style={{ flex: 1, minWidth: 0 }}>
            <Heading $size="xsmall" $weight={700}>
              {partner.name}
            </Heading>
            {partner.subtitle && (
              <Paragraph $size="xsmall" $variant="tertiary">
                {partner.subtitle}
              </Paragraph>
            )}
          </FlexColumn>

          {partner.rating && <StyledPartnerRating>{partner.rating.toFixed(1)}</StyledPartnerRating>}
        </FlexRow>

        <FlexRow $flexWrap="wrap" $gap="xs">
          {partner.tags.slice(0, 3).map((tag) => (
            <StyledPartnerTag key={tag} $type={partner.type}>
              {tag}
            </StyledPartnerTag>
          ))}
        </FlexRow>

        {partner.description && (
          <StyledDescriptionText>{partner.description}</StyledDescriptionText>
        )}
      </FlexColumn>

      <FlexRow
        $justify="space-between"
        $align="center"
        $pt="sm"
        $pl="md"
        $pr="md"
        $pb="md"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          <Paragraph $size="xsmall" $variant="tertiary" style={{ marginBottom: 1 }}>
            {t('vanaf')}
          </Paragraph>
          <Paragraph $weight={700} style={{ letterSpacing: '-0.01em' }}>
            €{partner.price_from?.toFixed(0) ?? '–'}/{partner.price_unit}
          </Paragraph>
        </div>

        <Button $variant="secondary" $size="small" $borderRadius="full" onClick={handleClick}>
          <FlexRow $gap="xs" $align="center">
            <span>{t('Bekijken')}</span>
            <Icons.ArrowRight size="xs" />
          </FlexRow>
        </Button>
      </FlexRow>
    </StyledCard>
  );
});

// Filters Component
interface TrainerFiltersProps {
  region: string;
  specialization: string;
  gender: string;
  onRegionChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onGenderChange: (value: string) => void;
}

const TrainerFilters = memo(function TrainerFilters({
  region,
  specialization,
  gender,
  onRegionChange,
  onSpecializationChange,
  onGenderChange,
}: TrainerFiltersProps) {
  const { t } = useTranslation();

  const { isMobile } = useDeviceBreakpoints();

  return (
    <StyledCard $variant="small" $gap="md" $pt="md" $pb="md" $pl="lg" $pr="lg">
      <Paragraph $size="small" $weight={600} $variant="secondary">
        {t('Filter')}
      </Paragraph>
      <Grid $gap="md" $gridMinWidth={isMobile ? '100%' : '200px'}>
        <Select
          label={t('Regio')}
          options={REGION_OPTIONS}
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          placeholder={t("Alle regio's")}
        />
        <Select
          label={t('Specialisatie')}
          options={SPECIALIZATION_OPTIONS}
          value={specialization}
          onChange={(e) => onSpecializationChange(e.target.value)}
          placeholder={t('Alle specialisaties')}
        />
        <Select
          label={t('Geslacht trainer')}
          options={GENDER_OPTIONS}
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          placeholder={t('Alle trainers')}
        />
      </Grid>
    </StyledCard>
  );
});

// Main Partners Component
export function Partners() {
  const { t } = useTranslation();

  const { isMobile } = useDeviceBreakpoints();

  // Get cached partners from AppDataProvider
  const { partners: allPartners, loading, error } = useAppData();

  // State
  const [activeTab, setActiveTab] = useState<PartnerTabId>('all');
  const [regionFilter, setRegionFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  // Filter partners in the frontend (no more backend calls on tab change!)
  const filteredPartners = useMemo(() => {
    let result = allPartners;

    // Filter by type (tab)
    if (activeTab !== 'all') {
      result = result.filter((partner) => partner.type === activeTab);
    }

    // Apply trainer-specific filters
    if (activeTab === 'trainer') {
      if (regionFilter) {
        result = result.filter((partner) => partner.region === regionFilter);
      }
      if (specializationFilter) {
        result = result.filter((partner) =>
          partner.specializations?.includes(specializationFilter as TrainerSpecialization)
        );
      }
      if (genderFilter) {
        result = result.filter((partner) => partner.gender === genderFilter);
      }
    }

    return result;
  }, [allPartners, activeTab, regionFilter, specializationFilter, genderFilter]);

  // Reset filters when changing tabs
  const handleTabChange = useCallback((tab: PartnerTabId) => {
    setActiveTab(tab);
    setRegionFilter('');
    setSpecializationFilter('');
    setGenderFilter('');
  }, []);

  // Show trainer filters only when trainer tab is active
  const showTrainerFilters = activeTab === 'trainer';

  return (
    <FlexColumn $gap="lg">
      <PageHeader title={t('Partners')} subtitle={t('Trainers, experts en merken')} />

      <Tabs tabs={PARTNER_TABS} activeTab={activeTab} onChange={handleTabChange} />

      {showTrainerFilters && (
        <TrainerFilters
          region={regionFilter}
          specialization={specializationFilter}
          gender={genderFilter}
          onRegionChange={setRegionFilter}
          onSpecializationChange={setSpecializationFilter}
          onGenderChange={setGenderFilter}
        />
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <StyledCard $variant="small" $tone="error">
          <Paragraph $variant="primary">
            {t('Er ging iets mis bij het laden van de partners.')}
          </Paragraph>
        </StyledCard>
      ) : filteredPartners.length === 0 ? (
        <Paragraph $variant="secondary" $italic>
          {t('Geen partners gevonden met de huidige filters.')}
        </Paragraph>
      ) : (
        <Grid $gap="md" $gridMinWidth={isMobile ? '100%' : '350px'}>
          {filteredPartners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </Grid>
      )}
    </FlexColumn>
  );
}

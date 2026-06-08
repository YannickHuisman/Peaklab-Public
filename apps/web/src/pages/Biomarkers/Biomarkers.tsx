import { useEffect, useMemo, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';
import { useDirectionalScroll } from '@hooks/useDirectionalScroll';
import { RangeBarCard } from '@pages/Biomarkers/components/RangeBarCard';

import type { BiomarkerResult } from '@package/api';
import { useAppData, useData } from '@package/api';

import { StyledCard } from '../../components/styled/StyledCard';
import { StyledPillsRow } from './styles';

export function Biomarkers() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { categories, loading: loadingCategories } = useAppData();
  const { biomarkers, loading: loadingBiomarkers } = useData();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const {
    containerRef: pillsContainerRef,
    itemRefs: pillRefs,
    scrollToIndex,
  } = useDirectionalScroll<HTMLDivElement>();

  const { isMobile } = useDeviceBreakpoints();
  const [isPending, startTransition] = useTransition();
  const [displayedBiomarkers, setDisplayedBiomarkers] = useState<BiomarkerResult[]>([]);

  const allPills = [{ id: null as null, name: t('Alles') }, ...categories];

  const filteredBiomarkers = useMemo(() => {
    return selectedCategoryId
      ? biomarkers.filter((b: BiomarkerResult) => b.biomarker?.category?.id === selectedCategoryId)
      : biomarkers;
  }, [biomarkers, selectedCategoryId]);

  // Defer the expensive card grid rendering so the page header/pills appear instantly
  useEffect(() => {
    startTransition(() => {
      setDisplayedBiomarkers(filteredBiomarkers);
    });
  }, [filteredBiomarkers]);

  const handlePillClick = (id: number | null, index: number) => {
    setSelectedCategoryId(id);
    scrollToIndex(index);
  };

  const isLoading = loadingCategories || loadingBiomarkers;

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <FlexRow
        $align="center"
        $justify="space-between"
        $flexWrap={isMobile ? 'wrap' : 'nowrap'}
        $gap="sm"
      >
        <PageHeader
          title={t('Biomarkers')}
          subtitle={isLoading ? undefined : `${biomarkers.length} ${t('biomarkers beschikbaar')}`}
        />
        <FlexRow $gap="sm" $align="center" $justify={isMobile ? 'flex-start' : 'flex-end'}>
          <StyledCard
            $variant="pill"
            $interactive
            onClick={() => navigate('/deep-research')}
            $showBorder
          >
            <Paragraph $size="small" $variant="secondary" $whiteSpace="nowrap">
              {/* {t('Diepteonderzoek')} */}
              Deep Research
            </Paragraph>
          </StyledCard>
          <StyledCard $variant="pill" $interactive onClick={() => navigate('/uploads')} $showBorder>
            <Paragraph $size="small" $variant="secondary" $whiteSpace="nowrap">
              {t('PDF uploaden')}
            </Paragraph>
          </StyledCard>
        </FlexRow>
        {isMobile && <Spacer size="xs" />}
      </FlexRow>
      {!isLoading && (
        <StyledPillsRow ref={pillsContainerRef}>
          {allPills.map((cat, index) => (
            <div
              key={cat.id ?? 'all'}
              ref={(el: HTMLDivElement | null) => {
                pillRefs.current[index] = el;
              }}
            >
              <StyledCard
                $variant="pill"
                $active={selectedCategoryId === cat.id}
                $interactive
                onClick={() => handlePillClick(cat.id, index)}
                $borderRadius="md"
                $pt="sm"
                $pb="sm"
              >
                <Paragraph $size="small" $variant="secondary" $whiteSpace="nowrap">
                  {cat.name}
                </Paragraph>
              </StyledCard>
            </div>
          ))}
        </StyledPillsRow>
      )}
      {isLoading || (isPending && displayedBiomarkers.length === 0) ? (
        <Loader />
      ) : (
        <Grid $gap="md" $gridMinWidth={isMobile ? '100%' : '350px'}>
          {displayedBiomarkers.map((b: BiomarkerResult) => (
            <RangeBarCard key={b.biomarker.id} biomarker={b} />
          ))}
          {!displayedBiomarkers.length && (
            <Paragraph $variant="secondary" $size="small" $italic>
              {t('Geen resultaten')}
            </Paragraph>
          )}
        </Grid>
      )}
    </FlexColumn>
  );
}

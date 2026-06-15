import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Loader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { getClickableProps } from '@helpers/getClickableProps';
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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading: loadingCategories } = useAppData();
  const { biomarkers, loading: loadingBiomarkers } = useData();

  const categoryParam = searchParams.get('category');
  const selectedCategoryId = categoryParam ? Number(categoryParam) : null;

  const {
    containerRef: pillsContainerRef,
    itemRefs: pillRefs,
    scrollToIndex,
  } = useDirectionalScroll<HTMLDivElement>();

  const { isMobile } = useDeviceBreakpoints();
  const [isPending, startTransition] = useTransition();
  const [displayedBiomarkers, setDisplayedBiomarkers] = useState<BiomarkerResult[]>([]);

  // Show only categories the user actually has biomarkers for. Includes
  // ratio / calculated categories so people can browse their derived values.
  const visibleCategoryIds = useMemo(
    () =>
      new Set(
        biomarkers
          .map((b) => b.biomarker?.category?.id)
          .filter((id): id is number => typeof id === 'number')
      ),
    [biomarkers]
  );

  const visibleCategories = useMemo(
    () => categories.filter((c) => visibleCategoryIds.has(c.id)),
    [categories, visibleCategoryIds]
  );

  const allPills = useMemo(
    () => [{ id: null as null, name: t('Alles') }, ...visibleCategories],
    [visibleCategories, t]
  );

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
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (id === null) next.delete('category');
        else next.set('category', String(id));

        return next;
      },
      { replace: true }
    );
    scrollToIndex(index);
  };

  const isLoading = loadingCategories || loadingBiomarkers;

  // Scroll to the active category pill on initial load (e.g. navigating back with ?category= in URL)
  const didInitialScroll = useRef(false);

  useEffect(() => {
    if (isLoading || didInitialScroll.current || !selectedCategoryId) return;
    const activeIndex = allPills.findIndex((c) => c.id === selectedCategoryId);

    if (activeIndex >= 0) {
      didInitialScroll.current = true;
      requestAnimationFrame(() => scrollToIndex(activeIndex));
    }
  }, [isLoading, selectedCategoryId, allPills, scrollToIndex]);

  // When returning to this tab from another page, the browser might have reset the horizontal
  // scroll of the pills container because it was hidden. This ensures it snaps back.
  useEffect(() => {
    if (location.pathname === '/biomarkers' && selectedCategoryId) {
      const activeIndex = allPills.findIndex((c) => c.id === selectedCategoryId);

      if (activeIndex >= 0) {
        requestAnimationFrame(() => scrollToIndex(activeIndex));
      }
    }
  }, [location.pathname, selectedCategoryId, allPills, scrollToIndex]);

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
            {...getClickableProps(() => navigate('/biomarkers/deep-research'), 'Deep Research')}
            $showBorder
          >
            <Paragraph $size="small" $variant="secondary" $whiteSpace="nowrap">
              {/* {t('Diepteonderzoek')} */}
              Deep Research
            </Paragraph>
          </StyledCard>
          <StyledCard
            $variant="pill"
            $interactive
            {...getClickableProps(() => navigate('/biomarkers/uploads'), t('PDF uploaden'))}
            $showBorder
          >
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
                aria-pressed={selectedCategoryId === cat.id}
                {...getClickableProps(() => handlePillClick(cat.id, index), cat.name)}
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
      {(isLoading || (isPending && displayedBiomarkers.length === 0)) && <Loader />}
      {!(isLoading || (isPending && displayedBiomarkers.length === 0)) && (
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

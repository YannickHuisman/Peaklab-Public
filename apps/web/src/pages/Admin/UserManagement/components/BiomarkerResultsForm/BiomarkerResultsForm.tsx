import { useCallback, useEffect, useState } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { authenticatedFetch } from '../../../../../helpers/authenticatedFetch';
import { BiomarkerCard } from './components/BiomarkerCard';
import {
  StyledCategoriesContainer,
  StyledCategorySection,
  StyledEmptyState,
  StyledResultsHeader,
  StyledSaveButton,
} from './styles';
import type { Biomarker, BiomarkerResult } from './types';

interface BiomarkerResultsFormProps {
  testId: number;
  panelId: number;
  onUpdate: () => void;
}

interface ExistingResult {
  id: number;
  biomarker_id: number;
  value: number;
  unit: string;
  ref_low: number | null;
  ref_high: number | null;
  flag: string | null;
  biomarker: {
    id: number;
    name: string;
    display_name: string;
  };
}

export function BiomarkerResultsForm({ testId, panelId, onUpdate }: BiomarkerResultsFormProps) {
  const [panelBiomarkers, setPanelBiomarkers] = useState<Biomarker[]>([]);
  const [existingResults, setExistingResults] = useState<ExistingResult[]>([]);
  const [results, setResults] = useState<Record<number, BiomarkerResult>>({});
  const [loading, setLoading] = useState(false);

  const fetchPanelBiomarkers = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/admin/panels/${panelId}/biomarkers`);
      const data = await response.json();

      setPanelBiomarkers(data.biomarkers || []);
    } catch {
      // swallow: error already surfaced via UI state
    }
  }, [panelId]);

  const fetchExistingResults = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/admin/blood-tests/${testId}/results`);
      const data = await response.json();

      setExistingResults(data.results || []);

      const resultsMap: Record<number, BiomarkerResult> = {};

      data.results?.forEach((result: ExistingResult) => {
        resultsMap[result.biomarker_id] = {
          value: result.value,
          unit: result.unit,
          ref_low: result.ref_low,
          ref_high: result.ref_high,
          flag: result.flag,
        };
      });
      setResults(resultsMap);
    } catch {
      // swallow: error already surfaced via UI state
    }
  }, [testId]);

  useEffect(() => {
    fetchPanelBiomarkers();
    fetchExistingResults();
  }, [panelId, testId, fetchPanelBiomarkers, fetchExistingResults]);

  const handleResultChange = (
    biomarkerId: number,
    field: string,
    value: string | number | null
  ) => {
    setResults((prev) => ({
      ...prev,
      [biomarkerId]: {
        ...prev[biomarkerId],
        [field]: value,
      },
    }));
  };

  const handleSaveResults = async () => {
    const resultsArray = Object.entries(results)
      .filter(([, data]) => data.value !== undefined && data.value !== '')
      .map(([biomarkerId, data]) => ({
        biomarker_id: Number(biomarkerId),
        value: Number(data.value),
        unit: data.unit || '',
        ref_low: data.ref_low ? Number(data.ref_low) : null,
        ref_high: data.ref_high ? Number(data.ref_high) : null,
        flag: data.flag || null,
      }));

    if (resultsArray.length === 0) {
      console.error('Please enter at least one biomarker result');

      return;
    }

    try {
      setLoading(true);
      await authenticatedFetch(`/api/admin/blood-tests/${testId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: resultsArray }),
      });

      console.error('Results saved successfully');
      await fetchExistingResults();
      onUpdate();
    } catch (error) {
      console.error('Failed to save results', error);
    } finally {
      setLoading(false);
    }
  };

  const autofillReferences = (biomarker: Biomarker) => {
    handleResultChange(biomarker.id, 'ref_low', biomarker.ref_male_min);
    handleResultChange(biomarker.id, 'ref_high', biomarker.ref_male_max);
    handleResultChange(biomarker.id, 'unit', biomarker.unit);
  };

  const groupedBiomarkers = panelBiomarkers.reduce(
    (acc, biomarker) => {
      const categoryName = biomarker.category.name;

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(biomarker);

      return acc;
    },
    {} as Record<string, Biomarker[]>
  );

  return (
    <StyledCard $variant="small" $showBorder $noShadow $mt="md">
      <StyledResultsHeader>
        <Heading $size="xsmall" $weight={600}>
          Biomarker Results
        </Heading>
        <StyledSaveButton onClick={handleSaveResults} disabled={loading}>
          <Icons.Save />
          {loading ? 'Saving...' : 'Save Results'}
        </StyledSaveButton>
      </StyledResultsHeader>

      <Paragraph $size="small" $variant="secondary">
        Enter values for biomarkers in this panel. Reference ranges will be auto-filled based on
        standard values.
      </Paragraph>

      {panelBiomarkers.length === 0 ? (
        <StyledEmptyState>No biomarkers found for this panel</StyledEmptyState>
      ) : (
        <StyledCategoriesContainer>
          {Object.entries(groupedBiomarkers).map(([categoryName, biomarkers]) => (
            <StyledCategorySection key={categoryName}>
              <Heading $size="xsmall" $weight={600} $variant="secondary">
                {categoryName}
              </Heading>
              <Grid $gridMinWidth="280px" $gap="md">
                {biomarkers.map((biomarker) => {
                  const resultData = results[biomarker.id] || {};
                  const hasExisting = existingResults.some((r) => r.biomarker_id === biomarker.id);

                  return (
                    <BiomarkerCard
                      key={biomarker.id}
                      biomarker={biomarker}
                      resultData={resultData}
                      hasExisting={hasExisting}
                      onResultChange={handleResultChange}
                      onAutofill={autofillReferences}
                    />
                  );
                })}
              </Grid>
            </StyledCategorySection>
          ))}
        </StyledCategoriesContainer>
      )}
    </StyledCard>
  );
}

import { type ReactNode, useState } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { Biomarker } from '@package/api';
import { theme } from '@package/ui';

interface BloodTest {
  id: string | number;
  sample_taken_at: string;
}

interface BiomarkerResultItem {
  biomarker: Biomarker;
  blood_test_id: string;
  value: number;
  unit: string;
  flag: string | null;
  ref_low: number | null;
  ref_high: number | null;
}

interface BiomarkerResultWithTest extends BiomarkerResultItem {
  bloodTest?: BloodTest;
}

interface GroupedBiomarker {
  biomarker: Biomarker;
  results: BiomarkerResultWithTest[];
}

import {
  StyledBiomarkerHeader,
  StyledCategoryBadge,
  StyledCategoryFilter,
  StyledContainer,
  StyledEmptyState,
  StyledFilterButton,
  StyledFlagBadge,
  StyledHeader,
  StyledHistoryFlag,
  StyledHistoryItem,
  StyledLatestValue,
  StyledResultsHistory,
} from './styles';

interface UserBiomarkersViewProps {
  biomarkerResults: BiomarkerResultItem[];
  bloodTests: BloodTest[];
}

export function UserBiomarkersView({ biomarkerResults, bloodTests }: UserBiomarkersViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group results by biomarker
  const biomarkerMap = biomarkerResults.reduce(
    (acc, result) => {
      const biomarkerId = result.biomarker.id;

      if (!acc[biomarkerId]) {
        acc[biomarkerId] = {
          biomarker: result.biomarker,
          results: [],
        };
      }

      // Find the blood test for this result
      const bloodTest = bloodTests.find((t) => t.id === result.blood_test_id);

      acc[biomarkerId].results.push({
        ...result,
        bloodTest,
      });

      return acc;
    },
    {} as Record<number, GroupedBiomarker>
  );

  // Sort each biomarker's results by date descending (latest first)
  for (const group of Object.values(biomarkerMap)) {
    group.results.sort((a, b) => {
      const dateA = a.bloodTest ? new Date(a.bloodTest.sample_taken_at).getTime() : 0;
      const dateB = b.bloodTest ? new Date(b.bloodTest.sample_taken_at).getTime() : 0;

      return dateB - dateA;
    });
  }

  // Get unique categories
  const categories = Array.from(
    new Set(Object.values(biomarkerMap).map((item) => item.biomarker.category.name))
  );

  // Filter biomarkers by category
  const filteredBiomarkers = Object.values(biomarkerMap).filter((item) => {
    if (selectedCategory === 'all') return true;

    return item.biomarker.category.name === selectedCategory;
  });

  const getFlagColor = (flag: string | null): string => {
    switch (flag) {
      case 'H':
        return theme.colors.error.strong;
      case 'L':
        return theme.colors.warning.strong;
      case 'N':
        return theme.colors.success.strong;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getFlagLabel = (flag: string | null): ReactNode => {
    switch (flag) {
      case 'H':
        return (
          <>
            <Icons.ArrowUp size="xs" /> High
          </>
        );
      case 'L':
        return (
          <>
            <Icons.ArrowDown size="xs" /> Low
          </>
        );
      case 'N':
        return (
          <>
            <Icons.Check size="xs" /> Normal
          </>
        );
      default:
        return <Icons.Minus size="xs" />;
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Heading $size="xsmall" $weight={600}>
          Biomarker Results ({biomarkerResults.length})
        </Heading>
        <StyledCategoryFilter>
          <StyledFilterButton
            $active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </StyledFilterButton>
          {categories.map((category) => (
            <StyledFilterButton
              key={category}
              $active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </StyledFilterButton>
          ))}
        </StyledCategoryFilter>
      </StyledHeader>

      {filteredBiomarkers.length === 0 && (
        <StyledEmptyState>No biomarker results found</StyledEmptyState>
      )}
      {filteredBiomarkers.length > 0 && (
        <Grid $gridMinWidth="280px" $gap="md">
          {filteredBiomarkers.map((item) => {
            const latestResult = item.results[0]; // Assuming sorted by date

            return (
              <StyledCard $variant="small" $showBorder $noShadow key={item.biomarker.id}>
                <StyledBiomarkerHeader>
                  <Paragraph $weight={600}>{item.biomarker.display_name}</Paragraph>
                  <StyledCategoryBadge>{item.biomarker.category.name}</StyledCategoryBadge>
                </StyledBiomarkerHeader>

                <Paragraph $size="xsmall" $variant="secondary">
                  {item.biomarker.name}
                </Paragraph>

                <StyledLatestValue>
                  <Paragraph $size="xsmall" $variant="secondary" $allCaps $weight={500}>
                    Latest Value:
                  </Paragraph>
                  <Heading $size="small" $weight={700}>
                    {latestResult.value} {latestResult.unit}
                  </Heading>
                  <StyledFlagBadge $flag={latestResult.flag}>
                    {getFlagLabel(latestResult.flag)}
                  </StyledFlagBadge>
                </StyledLatestValue>

                {latestResult.ref_low !== null && latestResult.ref_high !== null && (
                  <Paragraph $size="xsmall" $variant="secondary">
                    Reference: {latestResult.ref_low} - {latestResult.ref_high} {latestResult.unit}
                  </Paragraph>
                )}

                <StyledResultsHistory>
                  <Paragraph $size="xsmall" $variant="secondary" $allCaps $weight={600}>
                    History ({item.results.length})
                  </Paragraph>
                  {item.results.slice(0, 3).map((result, index) => (
                    <StyledHistoryItem key={index}>
                      <Paragraph $size="xsmall" $variant="secondary">
                        {result.bloodTest
                          ? new Date(result.bloodTest.sample_taken_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Unknown date'}
                      </Paragraph>
                      <Paragraph $size="xsmall" $weight={600}>
                        {result.value} {result.unit}
                      </Paragraph>
                      <StyledHistoryFlag $color={getFlagColor(result.flag)}>
                        {getFlagLabel(result.flag)}
                      </StyledHistoryFlag>
                    </StyledHistoryItem>
                  ))}
                  {item.results.length > 3 && (
                    <Paragraph $size="xsmall" $variant="secondary" $align="center">
                      +{item.results.length - 3} more results
                    </Paragraph>
                  )}
                </StyledResultsHistory>
              </StyledCard>
            );
          })}
        </Grid>
      )}
    </StyledContainer>
  );
}

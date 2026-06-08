import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { MarkdownContent } from '@components/MarkdownContent';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { Biomarker } from '@package/api';
import { theme } from '@package/ui';

export function ReadOnlyView({
  biomarker,
  hasNoContent,
}: {
  biomarker: Biomarker;
  hasNoContent: boolean;
}) {
  if (hasNoContent) {
    return (
      <StyledCard $variant="section" $noShadow>
        <Paragraph $variant="secondary">Geen details beschikbaar voor deze biomarker.</Paragraph>
      </StyledCard>
    );
  }

  return (
    <>
      {biomarker.what_it_measures && (
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="sm">
            <FlexRow $gap="sm" $align="center">
              <Icons.Info size="sm" color={theme.colors.primary} />
              <Heading $size="small">Wat meet deze biomarker in het lichaam?</Heading>
            </FlexRow>
            <MarkdownContent content={biomarker.what_it_measures} />
          </FlexColumn>
        </StyledCard>
      )}

      {biomarker.why_relevant && (
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="sm">
            <Heading $size="small">Waarom relevant?</Heading>
            <MarkdownContent content={biomarker.why_relevant} />
          </FlexColumn>
        </StyledCard>
      )}

      {biomarker.interpretation && (
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="sm">
            <Heading $size="small">Wat zegt een lage of hoge waarde?</Heading>
            <MarkdownContent content={biomarker.interpretation} />
          </FlexColumn>
        </StyledCard>
      )}

      {biomarker.how_to_optimize && (
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="sm">
            <Heading $size="small">Hoe optimaliseer je {biomarker.display_name}?</Heading>
            <MarkdownContent content={biomarker.how_to_optimize} />
          </FlexColumn>
        </StyledCard>
      )}

      {biomarker.optimization_tips && biomarker.optimization_tips.length > 0 && (
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="sm">
            <Heading $size="small">Algemene optimalisatie tips</Heading>
            <FlexColumn $gap="xs" style={{ paddingLeft: theme.spacing.md }}>
              {biomarker.optimization_tips.map((tip, index) => (
                <FlexRow key={index} $gap="sm" $align="flex-start">
                  <Paragraph $variant="secondary">•</Paragraph>
                  <Paragraph>{tip}</Paragraph>
                </FlexRow>
              ))}
            </FlexColumn>
          </FlexColumn>
        </StyledCard>
      )}

      {biomarker.scientific_sources && biomarker.scientific_sources.length > 0 && (
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="sm">
            <Heading $size="small">Wetenschappelijke bronnen</Heading>
            <FlexColumn $gap="xs">
              {biomarker.scientific_sources.map((source, index) => (
                <FlexRow key={index} $gap="sm" $align="center">
                  <Icons.ExternalLink size="xs" color={theme.colors.text.secondary} />
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: theme.colors.primary,
                      textDecoration: 'none',
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    {source.title}
                  </a>
                </FlexRow>
              ))}
            </FlexColumn>
          </FlexColumn>
        </StyledCard>
      )}
    </>
  );
}

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Label, Ring, Seg } from '@components/Primitives';
import { FlexColumn, FlexRow } from '@components/styled/layout';

import type { ReportData } from '@package/api';
import { theme } from '@package/ui';

import {
  StyledHeroContainer,
  StyledHeroContent,
  StyledHeroMeta,
  StyledStatusBadge,
} from '../styles';
import { deriveDomainStatus } from './DomainsSection';

function Stat({ value, label, color }: { value: number; label: string; color?: string }) {
  const c = color ?? '#fff';

  return (
    <div>
      <Heading $size="medium" $weight={700} $color={c}>
        {value}
      </Heading>
      <Label color={color ?? 'rgba(255,255,255,.55)'} style={{ marginTop: 4 }}>
        {label}
      </Label>
    </div>
  );
}

export function HeroSection({ data, createdAt }: { data: ReportData; createdAt: string }) {
  const dateStr = new Date(createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const allBiomarkers = data.domains?.flatMap((d) => d.biomarkers) ?? [];

  const domainCounts = {
    optimaal: allBiomarkers.filter(
      (b) => b.range_bucket === 'performance_range' || (!b.range_bucket && b.status === 'optimal')
    ).length,
    normaal: allBiomarkers.filter(
      (b) => b.range_bucket === 'normal_range' || (!b.range_bucket && b.status === 'good')
    ).length,
    buiten: allBiomarkers.filter(
      (b) =>
        b.range_bucket === 'out_of_range_high' ||
        b.range_bucket === 'out_of_range_low' ||
        (!b.range_bucket && (b.status === 'attention' || b.status === 'concern'))
    ).length,
  };

  const featuredDomains = [
    data.domains
      ?.filter((d) => deriveDomainStatus(d) === 'optimal')
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0],
    data.domains
      ?.filter((d) => deriveDomainStatus(d) === 'good')
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0],
    data.domains
      ?.filter((d) => deriveDomainStatus(d) === 'concern')
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0],
  ].filter(Boolean);

  return (
    <StyledHeroContainer>
      <FlexRow $gap="xl" $align="center" $flexWrap="wrap">
        <Ring
          value={data.overall_score}
          size={116}
          label="Score"
          dark={true}
          color={data.overall_score >= 75 ? theme.colors.performance : '#fff'}
        />

        <StyledHeroContent>
          <div>
            <Heading $size="medium" $weight={700} $color="#fff">
              Deep Research Report
            </Heading>
            <StyledHeroMeta>
              <Icons.Calendar size="xs" color={theme.colors.whiteAlpha.visible} />
              <span>{dateStr}</span>
            </StyledHeroMeta>

            <FlexRow $gap="sm" $flexWrap="wrap" $mt="xs">
              {featuredDomains
                .filter((d): d is NonNullable<typeof d> => d !== undefined)
                .map((d) => (
                  <StyledStatusBadge key={d.name} $status={deriveDomainStatus(d)}>
                    {d.name}
                  </StyledStatusBadge>
                ))}
            </FlexRow>
          </div>

          <FlexColumn $gap="md" $mt="md">
            <FlexRow $gap="md">
              <Stat value={allBiomarkers.length} label="Totaal" />
              <Stat value={domainCounts.optimaal} label="Optimaal" color={theme.colors.optimaal} />
              <Stat value={domainCounts.normaal} label="Normaal" color={theme.colors.normaal} />
              <Stat value={domainCounts.buiten} label="Buiten bereik" color={theme.colors.buiten} />
            </FlexRow>

            <Seg
              counts={domainCounts}
              h={8}
              keys={[
                ['optimaal', 'optimaal'],
                ['normaal', 'normaal'],
                ['buiten', 'buiten'],
              ]}
            />
          </FlexColumn>
        </StyledHeroContent>
      </FlexRow>
    </StyledHeroContainer>
  );
}

import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { Label, Ring, Seg } from '@components/Primitives';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { getClickableProps } from '@helpers/getClickableProps';
import { countBiomarkersByRange } from '@helpers/getRangeStatus';

import type { BiomarkerResult } from '@package/api';
import { useData } from '@package/api';
import { theme } from '@package/ui';

import {
  StyledHeroBannerContainer,
  StyledHeroDivider,
  StyledHeroLeft,
  StyledHeroRight,
} from './styles';

interface HeroBannerProps {
  score: number | null;
  biomarkers: BiomarkerResult[];
}

function StatTile({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ borderLeft: `2px solid ${color}`, paddingLeft: 12 }}>
      <Heading $size="small" $weight={700} $color="#fff">
        {value}
      </Heading>
      <Paragraph $size="xsmall" $color="rgba(255,255,255,.6)" $mt="xxs">
        {label}
      </Paragraph>
    </div>
  );
}

export const HeroBanner = memo(function HeroBanner({ score, biomarkers }: HeroBannerProps) {
  const navigate = useNavigate();
  const { userGender } = useData();
  const gender = userGender === 'female' ? 'female' : 'male';

  const counts = useMemo(() => {
    const directBiomarkers = biomarkers.filter((b) => b.biomarker.kind === 'direct');
    const biomarkerCounts = countBiomarkersByRange(directBiomarkers, gender);

    return {
      performance: biomarkerCounts.performance,
      normaal: biomarkerCounts.normal,
      buiten: biomarkerCounts.outOfRange,
      total: biomarkerCounts.total,
    };
  }, [biomarkers, gender]);

  return (
    <StyledHeroBannerContainer>
      <StyledHeroLeft>
        <FlexColumn $align="center">
          <Ring
            value={score ?? 0}
            size={200}
            label="Peakscore"
            dark={true}
            color={score && score >= 75 ? theme.colors.performance : '#fff'}
          />
        </FlexColumn>
      </StyledHeroLeft>

      <StyledHeroDivider />

      <StyledHeroRight>
        <FlexRow $justify="space-between" $align="baseline" $mb="md">
          <div>
            <Label color="rgba(255,255,255,.5)">Biomarker-overzicht</Label>
            <FlexRow $align="baseline" $gap="sm" $mt="xs">
              <Heading $size="xxlarge" $weight={700} $color="#fff">
                {counts.total}
              </Heading>
              <Paragraph $size="small" $color="rgba(255,255,255,.55)">
                biomarkers gemeten
              </Paragraph>
            </FlexRow>
          </div>
          <div
            {...getClickableProps(() => navigate('/biomarkers'), 'Bekijk alle biomarkers')}
            style={{ cursor: 'pointer' }}
          >
            <Paragraph $size="xsmall" $weight={600} $color="rgba(255,255,255,.75)">
              Bekijk alle →
            </Paragraph>
          </div>
        </FlexRow>

        <Seg
          counts={counts}
          h={9}
          keys={[
            ['performance', 'perf'],
            ['normaal', 'normaal'],
            ['buiten', 'buiten'],
          ]}
        />

        <Grid $gridColumns="1fr 1fr 1fr" $mobileColumns="1fr 1fr 1fr" $gap="md" $mt="md">
          <StatTile
            value={counts.performance}
            label="Performance"
            color={theme.colors.performance}
          />
          <StatTile value={counts.normaal} label="Normaal" color={theme.colors.normaal} />
          <StatTile value={counts.buiten} label="Buiten bereik" color={theme.colors.buiten} />
        </Grid>
      </StyledHeroRight>
    </StyledHeroBannerContainer>
  );
});

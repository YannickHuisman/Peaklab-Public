import { Input } from '@components/form/Input';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { StyledOptionCard } from '../styles';
import type { GenderType, PerformanceFormData, SportType } from '../types';
import { GENDER_OPTIONS, SPORT_TYPES } from '../types';

interface Step1ProfileProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
}

export function Step1Profile({ formData, onChange }: Step1ProfileProps) {
  const { isMobile } = useDeviceBreakpoints();

  return (
    <FlexColumn $gap="lg">
      <FlexColumn $gap="xs">
        <Heading $size="medium">Basis Profiel</Heading>
        <Paragraph $variant="secondary">Vertel ons wat over jezelf</Paragraph>
      </FlexColumn>

      <Grid $gap="md" $gridColumns={isMobile ? '1fr' : '1fr 1fr'}>
        <Input
          label="Leeftijd *"
          type="number"
          placeholder="25"
          value={formData.age ?? ''}
          onChange={(e) => onChange('age', e.target.value ? Number(e.target.value) : null)}
        />
        <FlexColumn $gap="xs">
          <Paragraph $size="small" $weight={500}>
            Geslacht *
          </Paragraph>
          <FlexRow $gap="sm" $flexWrap="wrap">
            {GENDER_OPTIONS.map((option) => (
              <StyledOptionCard
                key={option.value}
                type="button"
                $selected={formData.gender === option.value}
                onClick={() => onChange('gender', option.value as GenderType)}
              >
                <Paragraph
                  $size="small"
                  $variant={formData.gender === option.value ? 'primary' : 'secondary'}
                >
                  {option.label}
                </Paragraph>
              </StyledOptionCard>
            ))}
          </FlexRow>
        </FlexColumn>
      </Grid>

      <Grid $gap="md" $gridColumns={isMobile ? '1fr' : '1fr 1fr'}>
        <Input
          label="Lengte (cm) *"
          type="number"
          placeholder="180"
          value={formData.heightCm ?? ''}
          onChange={(e) => onChange('heightCm', e.target.value ? Number(e.target.value) : null)}
        />
        <Input
          label="Gewicht (kg) *"
          type="number"
          placeholder="75"
          value={formData.weightKg ?? ''}
          onChange={(e) => onChange('weightKg', e.target.value ? Number(e.target.value) : null)}
        />
      </Grid>

      <FlexColumn $gap="sm">
        <Paragraph $size="small" $weight={500}>
          Primaire sport type *
        </Paragraph>
        <FlexRow $gap="sm" $flexWrap="wrap">
          {SPORT_TYPES.map((sport) => (
            <StyledOptionCard
              key={sport.value}
              type="button"
              $selected={formData.primarySportType === sport.value}
              onClick={() => onChange('primarySportType', sport.value as SportType)}
            >
              <Paragraph
                $size="small"
                $variant={formData.primarySportType === sport.value ? 'primary' : 'secondary'}
              >
                {sport.label}
              </Paragraph>
            </StyledOptionCard>
          ))}
        </FlexRow>
      </FlexColumn>
    </FlexColumn>
  );
}

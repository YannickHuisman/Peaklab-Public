import { memo, useMemo } from 'react';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { BIOMARKER_RANGE_CONFIG, countBiomarkersByRange } from '@helpers/getRangeStatus';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import type { BiomarkerResult } from '@package/api';
import { useData } from '@package/api';
import { theme } from '@package/ui';

import {
  StyledBiomarkerOverview,
  StyledFullBleedHero,
  StyledHeroContent,
  StyledProgressBar,
  StyledProgressSegment,
  StyledScoreProgressBar,
  StyledScoreProgressFill,
  StyledStatItem,
} from './styles';

interface HeroBannerProps {
  score: number | null;
  biomarkers: BiomarkerResult[];
}

interface CircularScoreGaugeProps {
  score: number;
  size?: number;
}

function CircularScoreGauge({ score, size = 180 }: CircularScoreGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={theme.colors.whiteAlpha.strong}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={theme.colors.primary}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={theme.colors.text.inverse}
        fontSize={size * 0.28}
        fontFamily={theme.typography.fontFamily.primary}
        fontWeight={700}
      >
        {score}%
      </text>
    </svg>
  );
}

const STAT_CONFIG = [
  { key: 'total' as const, label: 'Total', color: theme.colors.text.inverse },
  ...BIOMARKER_RANGE_CONFIG.map(({ key, labelEn, color }) => ({ key, label: labelEn, color })),
];

export const HeroBanner = memo(function HeroBanner({ score, biomarkers }: HeroBannerProps) {
  const { userGender } = useData();
  const gender = userGender === 'female' ? 'female' : 'male';
  const counts = useMemo(() => countBiomarkersByRange(biomarkers, gender), [biomarkers, gender]);
  const { isDesktop } = useDeviceBreakpoints();

  const percentages = useMemo(() => {
    if (counts.total === 0) return { performance: 0, normal: 0, outOfRange: 0 };

    return {
      performance: (counts.performance / counts.total) * 100,
      normal: (counts.normal / counts.total) * 100,
      outOfRange: (counts.outOfRange / counts.total) * 100,
    };
  }, [counts]);

  const biomarkerOverview = biomarkers.length > 0 && (
    <StyledBiomarkerOverview>
      <Paragraph $variant="inverse" $size="xsmall" $allCaps>
        Biomarker Overview
      </Paragraph>

      <FlexRow $align="flex-end" $gap="lg">
        {STAT_CONFIG.map(({ key, label, color }, index) => (
          <StyledStatItem key={key} $hasDivider={index < STAT_CONFIG.length - 1}>
            <Heading $size="large" $color={color}>
              {counts[key]}
            </Heading>
            <Paragraph $size="xsmall" $color={theme.colors.text.muted} $whiteSpace="nowrap">
              {label}
            </Paragraph>
          </StyledStatItem>
        ))}
      </FlexRow>

      <StyledProgressBar>
        {BIOMARKER_RANGE_CONFIG.map(({ key, color }) => (
          <StyledProgressSegment key={key} $width={percentages[key]} $color={color} />
        ))}
      </StyledProgressBar>
    </StyledBiomarkerOverview>
  );

  // Desktop: old horizontal layout with text score + linear progress bar
  if (isDesktop) {
    return (
      <StyledCard $variant="intro" $tone="hero" $gap="md">
        <FlexRow $gap="xl" $align="center" $justify="space-between">
          <FlexColumn $gap="sm">
            <Heading $size="xxxlarge" $variant="inverse" $color={theme.colors.text.inverse}>
              {score !== null ? `${score}%` : 'N/A'}
            </Heading>
            <StyledScoreProgressBar>
              <StyledScoreProgressFill $percent={score ?? 0} />
            </StyledScoreProgressBar>
            <Paragraph $variant="inverse" $size="xsmall">
              Jouw Peak Score
            </Paragraph>
            <Paragraph $size="xsmall" $color={theme.colors.text.muted}>
              Based on your current biomarkers
            </Paragraph>
          </FlexColumn>
          {biomarkerOverview}
        </FlexRow>
      </StyledCard>
    );
  }

  // Mobile / Tablet: full-bleed hero with circular gauge
  return (
    <StyledFullBleedHero>
      <StyledHeroContent>
        <CircularScoreGauge score={score ?? 0} />
        <Paragraph $variant="inverse" $size="xsmall">
          Jouw Peak Score
        </Paragraph>
        <Paragraph $size="xsmall" $color={theme.colors.text.muted}>
          Based on your current biomarkers
        </Paragraph>
      </StyledHeroContent>
      {biomarkerOverview}
    </StyledFullBleedHero>
  );
});

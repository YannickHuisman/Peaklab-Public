import { useMemo } from 'react';

import { FlexColumn } from '@components/styled/layout';

import {
  StyledBar,
  StyledMarkerStem,
  StyledMarkerWrap,
  StyledSegment,
  StyledTick,
  StyledTicksRow,
} from './styles';

export type Range = {
  label: string;
  min: number;
  max: number;
};

export type RangeBarProps = {
  value: number;
  normalRange: Range;
  performanceRange?: Range;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const pct = (v: number, min: number, max: number) =>
  max === min ? 0 : ((v - min) / (max - min)) * 100;

type Segment = {
  leftPct: number;
  widthPct: number;
  kind: 'out-of-range' | 'normal' | 'performance';
};

function buildSegments(
  scaleMin: number,
  scaleMax: number,
  normal: Range,
  performance?: Range
): Segment[] {
  const perf = performance ?? normal;
  const segments: Segment[] = [];

  const addSegment = (start: number, end: number, kind: Segment['kind']) => {
    if (start < end) {
      segments.push({
        leftPct: pct(start, scaleMin, scaleMax),
        widthPct: pct(end, scaleMin, scaleMax) - pct(start, scaleMin, scaleMax),
        kind,
      });
    }
  };

  // Out of normal range zones (error/red)
  if (scaleMin < normal.min) addSegment(scaleMin, normal.min, 'out-of-range');
  if (normal.max < scaleMax) addSegment(normal.max, scaleMax, 'out-of-range');

  // Normal but not performance zones (info/blue)
  if (normal.min < perf.min) addSegment(normal.min, perf.min, 'normal');
  if (perf.max < normal.max) addSegment(perf.max, normal.max, 'normal');

  // Performance zone (success/green)
  addSegment(perf.min, perf.max, 'performance');

  return segments.filter((s) => s.widthPct > 0);
}

function calculateScale(normalRange: Range, performanceRange: Range | undefined, value: number) {
  const allValues = [
    normalRange.min,
    normalRange.max,
    ...(performanceRange ? [performanceRange.min, performanceRange.max] : []),
  ];
  const rangeMin = Math.min(...allValues);
  const rangeMax = Math.max(...allValues);
  const rangeSpan = rangeMax - rangeMin;

  let scaleMin = rangeMin - rangeSpan * 0.2;
  let scaleMax = rangeMax + rangeSpan * 0.2;

  // Extend scale if value is outside
  if (value < scaleMin) scaleMin = value - rangeSpan * 0.1;
  if (value > scaleMax) scaleMax = value + rangeSpan * 0.1;

  const finalScaleSpan = scaleMax - scaleMin;

  // Generate 5 evenly spaced ticks
  const ticks = Array.from({ length: 5 }, (_, i) => {
    const tickValue = scaleMin + (i * finalScaleSpan) / 4;

    if (finalScaleSpan > 0) {
      const magnitude = Math.pow(10, Math.floor(Math.log10(finalScaleSpan)) - 1);
      const rounded = Math.round(tickValue / magnitude) * magnitude;
      const decimals = magnitude < 1 ? Math.abs(Math.floor(Math.log10(magnitude))) : 0;

      return Number(rounded.toFixed(decimals));
    }

    return Number(tickValue.toFixed(1));
  });

  return { scaleMin, scaleMax, ticks };
}

export function RangeBar({ value, normalRange, performanceRange }: RangeBarProps) {
  const { scaleMin, scaleMax, ticks } = useMemo(
    () => calculateScale(normalRange, performanceRange, value),
    [normalRange, performanceRange, value]
  );

  const valuePct = pct(clamp(value, scaleMin, scaleMax), scaleMin, scaleMax);
  const segments = useMemo(
    () => buildSegments(scaleMin, scaleMax, normalRange, performanceRange),
    [scaleMin, scaleMax, normalRange, performanceRange]
  );

  return (
    <FlexColumn $gap="xs">
      <StyledBar>
        {segments.map((s, idx) => (
          <StyledSegment key={idx} $kind={s.kind} $left={s.leftPct} $width={s.widthPct} />
        ))}
        <StyledMarkerWrap $left={valuePct}>
          <StyledMarkerStem />
        </StyledMarkerWrap>
      </StyledBar>
      <StyledTicksRow>
        {ticks.map((t, idx) => {
          const position = pct(t, scaleMin, scaleMax);
          const isFirst = idx === 0;
          const isLast = idx === ticks.length - 1;

          return (
            <StyledTick
              key={`${t}-${idx}`}
              $left={isFirst ? '0%' : isLast ? '100%' : `${position}%`}
              $transform={
                isFirst ? 'translateX(0)' : isLast ? 'translateX(-100%)' : 'translateX(-50%)'
              }
            >
              {t}
            </StyledTick>
          );
        })}
      </StyledTicksRow>
    </FlexColumn>
  );
}

import { useMemo } from 'react';

import { getRangeStatus } from '@helpers/getRangeStatus';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { BiomarkerHistoryEntry } from '@package/api';
import { theme } from '@package/ui';

interface BiomarkerHistoryChartProps {
  history: BiomarkerHistoryEntry[];
  normalRange?: { min: number; max: number };
  performanceRange?: { min: number; max: number };
}

export function BiomarkerHistoryChart({
  history,
  normalRange,
  performanceRange,
}: BiomarkerHistoryChartProps) {
  const chartData = useMemo(() => {
    return history
      .map((point) => {
        const status = normalRange && getRangeStatus(point.value, normalRange, performanceRange);

        return {
          date: new Date(point.blood_test.sample_taken_at).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: '2-digit',
          }),
          value: point.value,
          flag: point.flag,
          fullDate: point.blood_test.sample_taken_at,
          color: status?.color || theme.colors.info.main,
        };
      })
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [history, normalRange, performanceRange]);

  // Get the most recent value's color for the line
  const lineColor =
    chartData.length > 0 ? chartData[chartData.length - 1].color : theme.colors.info.main;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="0" stroke={theme.colors.neutral[200]} vertical={false} />
        <XAxis
          dataKey="date"
          stroke={theme.colors.text.muted}
          style={{ fontSize: '12px' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          width={35}
          stroke={theme.colors.text.muted}
          style={{ fontSize: '12px' }}
          axisLine={false}
          tickLine={false}
          domain={[
            (dataMin: number) => Math.floor(dataMin * 0.9),
            (dataMax: number) => Math.ceil(dataMax * 1.1),
          ]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.colors.background.raised,
            border: 'none',
            boxShadow: theme.shadows.lg,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
          }}
          labelStyle={{ color: theme.colors.text.primary, fontWeight: 500 }}
          itemStyle={{ color: theme.colors.text.secondary }}
        />
        {normalRange && (
          <>
            <ReferenceLine
              y={normalRange.min}
              stroke={theme.colors.info.strong}
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: 'Min', position: 'insideBottomLeft', fontSize: 10 }}
            />
            <ReferenceLine
              y={normalRange.max}
              stroke={theme.colors.info.strong}
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: 'Max', position: 'insideTopLeft', fontSize: 10 }}
            />
          </>
        )}
        {performanceRange && (
          <>
            <ReferenceLine
              y={performanceRange.min}
              stroke={theme.colors.success.strong}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <ReferenceLine
              y={performanceRange.max}
              stroke={theme.colors.success.strong}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          </>
        )}

        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={2.5}
          dot={{
            fill: theme.colors.background.raised,
            stroke: lineColor,
            strokeWidth: 2.5,
            r: 4,
          }}
          activeDot={{
            r: 6,
            stroke: lineColor,
            strokeWidth: 2,
            fill: theme.colors.background.raised,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

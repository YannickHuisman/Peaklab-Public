import { theme } from '@package/ui';

interface SegProps {
  counts: Record<string, number>;
  h?: number;
  keys?: Array<[string, string]>;
}

const statusColor = (status: string): string => {
  if (status === 'performance') return theme.colors.performance;
  if (status === 'normaal') return theme.colors.normaal;
  if (status === 'buiten') return theme.colors.buiten;
  if (status === 'optimaal') return theme.colors.optimaal;
  if (status === 'letop') return theme.colors.letop;

  return theme.colors.ink40;
};

/**
 * Seg - Segmented status bar showing proportions of biomarker counts
 * Displays performance vs normaal vs buiten bereik distribution
 */
export function Seg({
  counts,
  h = 8,
  keys = [
    ['performance', 'perf'],
    ['normaal', 'normaal'],
    ['buiten', 'buiten'],
  ],
}: SegProps) {
  const total = keys.reduce((a, k) => a + (counts[k[0]] || 0), 0);

  if (total === 0) {
    return (
      <div
        style={{
          display: 'flex',
          height: h,
          borderRadius: 99,
          overflow: 'hidden',
          gap: 2,
          backgroundColor: theme.colors.lineSoft,
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        height: h,
        borderRadius: 99,
        overflow: 'hidden',
        gap: 2,
      }}
    >
      {keys.map((k) => (
        <div
          key={k[0]}
          style={{
            width: `calc(${(counts[k[0]] / total) * 100}% - 1px)`,
            background: statusColor(k[0]),
            minWidth: counts[k[0]] > 0 ? 2 : 0,
          }}
        />
      ))}
    </div>
  );
}

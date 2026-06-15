import { theme } from '@package/ui';

interface RangeProps {
  pos: number; // 0-1, position on the range
  status: string; // 'performance' | 'normaal' | 'buiten' | 'optimaal' | 'letop'
  scale?: string[]; // scale labels (e.g., ['Low', 'Normal', 'High'])
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
 * Range - Biomarker range bar with scale ticks and marker
 * Shows value position within normal and performance bands
 */
export function Range({ pos, status, scale }: RangeProps) {
  const color = statusColor(status);

  return (
    <div>
      <div style={{ position: 'relative', height: 26 }}>
        {/* Base track */}
        <div
          style={{
            position: 'absolute',
            top: 11,
            left: 0,
            right: 0,
            height: 4,
            background: theme.colors.lineSoft,
            borderRadius: 99,
          }}
        />

        {/* Performance band (middle 32% starting at 34%) */}
        <div
          style={{
            position: 'absolute',
            top: 11,
            left: 'calc(34%)',
            width: 'calc(32%)',
            height: 4,
            background: color,
            opacity: 0.25,
            borderRadius: 99,
          }}
        />

        {/* Vertical line at position */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: `calc(${pos * 100}% - 1px)`,
            width: 2,
            height: 18,
            background: color,
          }}
        />

        {/* Circle marker at position */}
        <div
          style={{
            position: 'absolute',
            top: 1,
            left: `calc(${pos * 100}% - 4px)`,
            width: 8,
            height: 8,
            borderRadius: 99,
            background: theme.colors.surface,
            border: `2px solid ${color}`,
          }}
        />
      </div>

      {/* Scale labels */}
      {scale && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 2,
          }}
        >
          {scale.map((s, i) => (
            <span
              key={i}
              style={{
                fontFamily: theme.typography.fontFamily.monospace,
                fontSize: 10,
                color: theme.colors.ink40,
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

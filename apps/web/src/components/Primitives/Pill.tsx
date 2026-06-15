import { theme } from '@package/ui';

interface PillProps {
  status: string; // 'performance' | 'normaal' | 'buiten' | 'optimaal' | 'letop'
  small?: boolean;
}

const statusColor = (status: string): string => {
  if (status === 'performance') return theme.colors.performance;
  if (status === 'normaal') return theme.colors.normaal;
  if (status === 'buiten') return theme.colors.buiten;
  if (status === 'optimaal') return theme.colors.optimaal;
  if (status === 'letop') return theme.colors.letop;

  return theme.colors.ink40;
};

const statusTint = (status: string): string => {
  if (status === 'performance') return theme.colors.tintPerf;
  if (status === 'normaal') return theme.colors.tintNormaal;
  if (status === 'buiten') return theme.colors.tintBuiten;
  if (status === 'optimaal') return theme.colors.tintPerf;
  if (status === 'letop') return theme.colors.tintLet;

  return theme.colors.lineSoft;
};

const statusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    performance: 'Performance',
    normaal: 'Normaal',
    buiten: 'Buiten bereik',
    optimaal: 'Optimaal',
    letop: 'Let op',
  };

  return labels[status] || status;
};

/**
 * Pill - Status chip showing biomarker status with colored dot and label
 */
export function Pill({ status, small = false }: PillProps) {
  const color = statusColor(status);
  const bg = statusTint(status);
  const label = statusLabel(status);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 6,
        padding: small ? '2px 9px' : '4px 11px',
        borderRadius: 99,
        background: bg,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: theme.typography.fontFamily.primary,
          fontSize: small ? 11 : 12,
          fontWeight: 600,
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
}

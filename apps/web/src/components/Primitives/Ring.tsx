import { theme } from '@package/ui';

interface RingProps {
  value: number; // 0-100
  size?: number;
  label?: string;
  dark?: boolean;
  color?: string;
}

/**
 * Ring - Hairline progress ring with tick marks (light + dark variants)
 * Used for PeakScore visualization on Dashboard hero
 */
export function Ring({ value, size = 188, label = 'Peakscore', dark = false, color }: RingProps) {
  const stroke = 4;
  const r = (size - stroke) / 2 - 11;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  const prog = color || (dark ? '#fff' : theme.colors.ink);
  const trackTick = dark ? 'rgba(255,255,255,.16)' : theme.colors.line;
  const majTick = dark ? 'rgba(255,255,255,.4)' : theme.colors.ink40;
  const track = dark ? 'rgba(255,255,255,.13)' : theme.colors.lineSoft;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 60 tick marks around the circle */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
          const maj = i % 5 === 0;
          const r1 = r + 8;
          const r2 = r + (maj ? 14 : 11);

          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(a)}
              y1={cy + r1 * Math.sin(a)}
              x2={cx + r2 * Math.cos(a)}
              y2={cy + r2 * Math.sin(a)}
              stroke={maj ? majTick : trackTick}
              strokeWidth={maj ? 1.3 : 1}
            />
          );
        })}
        {/* Background track circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        {/* Progress circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={prog}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - value / 100)}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: size * 0.33,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: dark ? '#fff' : theme.colors.ink,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: theme.typography.fontFamily.monospace,
            fontSize: 10.5,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: dark ? 'rgba(255,255,255,.55)' : theme.colors.ink40,
            marginTop: 8,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

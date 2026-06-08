import { spacing, type SpacingKey } from '@package/ui';

interface SpacerProps {
  size: SpacingKey;
}

export function Spacer({ size }: SpacerProps) {
  return <div style={{ height: spacing[size], width: '100%' }} />;
}

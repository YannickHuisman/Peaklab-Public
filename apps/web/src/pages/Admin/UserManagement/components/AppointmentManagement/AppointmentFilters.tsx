import { FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { ViewMode } from './types';

interface AppointmentFiltersProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const FILTERS: { mode: ViewMode; label: string }[] = [
  { mode: 'upcoming', label: 'Aankomend' },
  { mode: 'past', label: 'Verleden' },
  { mode: 'all', label: 'Alles' },
];

export function AppointmentFilters({ viewMode, onChange }: AppointmentFiltersProps) {
  return (
    <FlexRow $gap="sm">
      {FILTERS.map(({ mode, label }) => (
        <StyledCard
          key={mode}
          $variant="pill"
          $tone={viewMode === mode ? 'blue' : 'neutral'}
          $active={viewMode === mode}
          $interactive
          onClick={() => onChange(mode)}
        >
          {label}
        </StyledCard>
      ))}
    </FlexRow>
  );
}

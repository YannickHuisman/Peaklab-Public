import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Heading } from '@components/Heading';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { AppointmentType } from '@package/api';

import { APPOINTMENT_TYPE_OPTIONS } from './consts';
import type { AppointmentFormState } from './types';

interface AppointmentFormProps {
  state: AppointmentFormState;
  isEditing: boolean;
  loading: boolean;
  onChange: (state: AppointmentFormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AppointmentForm({
  state,
  isEditing,
  loading,
  onChange,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const { t } = useTranslation();
  const set = <K extends keyof AppointmentFormState>(field: K, value: AppointmentFormState[K]) =>
    onChange({ ...state, [field]: value });

  return (
    <StyledCard $tone="subtle" $gap="md">
      <Heading $size="xsmall">{isEditing ? t('Bewerken') : t('Nieuwe afspraak')}</Heading>

      <Grid $gridMinWidth="200px" $gap="md">
        <Input
          label="Titel *"
          type="text"
          value={state.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Bijv. Intake gesprek"
        />
        <Select
          label="Type"
          value={state.appointmentType}
          onChange={(e) => set('appointmentType', e.target.value as AppointmentType)}
          options={APPOINTMENT_TYPE_OPTIONS}
        />
        <Input
          label="Datum *"
          type="date"
          value={state.scheduledDate}
          onChange={(e) => set('scheduledDate', e.target.value)}
        />
        <Input
          label="Tijd *"
          type="time"
          value={state.scheduledTime}
          onChange={(e) => set('scheduledTime', e.target.value)}
        />
        <Input
          label="Duur (minuten)"
          type="number"
          value={state.durationMinutes}
          onChange={(e) => set('durationMinutes', Number(e.target.value))}
          min={15}
          step={15}
        />
        <Input
          label="Locatie"
          type="text"
          value={state.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="Bijv. Online of adres"
        />
      </Grid>

      <FlexColumn $gap="sm">
        <Input
          label="Beschrijving"
          type="text"
          value={state.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Optionele beschrijving..."
        />
        <Input
          label="Admin Notities (niet zichtbaar voor gebruiker)"
          type="text"
          value={state.adminNotes}
          onChange={(e) => set('adminNotes', e.target.value)}
          placeholder="Interne notities..."
        />
      </FlexColumn>

      <FlexRow $gap="md">
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? t('Bezig...') : isEditing ? t('Opslaan') : t('Aanmaken')}
        </Button>
        <Button $variant="ghost" onClick={onCancel}>
          {t('Annuleren')}
        </Button>
      </FlexRow>
    </StyledCard>
  );
}

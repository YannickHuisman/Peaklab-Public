import { useCallback, useState } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { Appointment } from '@package/api';

import { AppointmentCard } from './AppointmentCard';
import { AppointmentFilters } from './AppointmentFilters';
import { AppointmentForm } from './AppointmentForm';
import {
  type AppointmentFormState,
  appointmentToFormState,
  EMPTY_FORM_STATE,
  filterAppointments,
  type ViewMode,
} from './types';
import { useAppointments } from './useAppointments';

interface AppointmentManagementProps {
  userId: string;
  onUpdate: () => void;
}

export function AppointmentManagement({ userId, onUpdate }: AppointmentManagementProps) {
  const { t } = useTranslation();

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formState, setFormState] = useState<AppointmentFormState>(EMPTY_FORM_STATE);
  const [viewMode, setViewMode] = useState<ViewMode>('upcoming');

  const { appointments, loading, create, update, updateStatus, remove } = useAppointments({
    userId,
    onChange: onUpdate,
  });

  const resetForm = useCallback(() => {
    setFormState(EMPTY_FORM_STATE);
    setEditingAppointment(null);
  }, []);

  const handleEdit = useCallback((appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormState(appointmentToFormState(appointment));
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formState.title || !formState.scheduledDate || !formState.scheduledTime) {
      console.error(t('Vul alle verplichte velden in'));

      return;
    }

    const success = editingAppointment
      ? await update(editingAppointment.id, formState)
      : await create(formState);

    if (!success) {
      console.error(
        editingAppointment ? t('Afspraak bijwerken mislukt') : t('Afspraak aanmaken mislukt')
      );

      return;
    }

    setShowForm(false);
    resetForm();
  }, [formState, editingAppointment, update, create, resetForm, t]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(t('Weet je zeker dat je deze afspraak wilt verwijderen?'))) return;
      await remove(id);
    },
    [remove, t]
  );

  const handleToggleForm = useCallback(() => {
    resetForm();
    setShowForm((prev) => !prev);
  }, [resetForm]);

  const now = new Date();
  const filtered = filterAppointments(appointments, viewMode, now);

  const emptyMessage =
    viewMode === 'upcoming'
      ? 'Geen aankomende afspraken'
      : viewMode === 'past'
        ? 'Geen afspraken in het verleden'
        : 'Geen afspraken gevonden';

  return (
    <FlexColumn $gap="lg">
      <FlexRow $justify="space-between" $align="center">
        <FlexColumn $gap="xs">
          <Heading $size="small">{t('Afspraken')}</Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Beheer afspraken')}
          </Paragraph>
        </FlexColumn>
        <Button onClick={handleToggleForm}>
          <Icons.Plus size="sm" />
          {showForm ? t('Annuleren') : t('Nieuwe afspraak')}
        </Button>
      </FlexRow>

      {showForm && (
        <AppointmentForm
          state={formState}
          isEditing={Boolean(editingAppointment)}
          loading={loading}
          onChange={setFormState}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            resetForm();
          }}
        />
      )}

      <AppointmentFilters viewMode={viewMode} onChange={setViewMode} />

      {filtered.length === 0 && (
        <StyledCard $tone="subtle" $padding="xl">
          <FlexColumn $align="center">
            <Paragraph $variant="secondary">{emptyMessage}</Paragraph>
          </FlexColumn>
        </StyledCard>
      )}

      {filtered.length > 0 && (
        <FlexColumn $gap="md">
          <Paragraph $variant="secondary" $size="small">
            {filtered.length} afspra{filtered.length === 1 ? 'ak' : 'ken'}
          </Paragraph>

          {filtered.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isPast={new Date(appointment.scheduled_at) < now}
              onEdit={handleEdit}
              onUpdateStatus={updateStatus}
              onDelete={handleDelete}
            />
          ))}
        </FlexColumn>
      )}
    </FlexColumn>
  );
}

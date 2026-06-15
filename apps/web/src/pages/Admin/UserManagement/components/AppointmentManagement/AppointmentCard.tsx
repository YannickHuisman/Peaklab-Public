import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { formatDate } from '@helpers/formatDate';

import type { Appointment, AppointmentStatus } from '@package/api';
import { theme } from '@package/ui';

import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS, STATUS_TONE_MAP } from './consts';

interface AppointmentCardProps {
  appointment: Appointment;
  isPast: boolean;
  onEdit: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  isPast,
  onEdit,
  onUpdateStatus,
  onDelete,
}: AppointmentCardProps) {
  const isScheduled = appointment.status === 'scheduled';

  return (
    <StyledCard $gap="sm" $opacity={isPast ? 0.7 : 1}>
      <FlexRow $justify="space-between" $align="flex-start">
        <FlexColumn $gap="xs">
          <Heading $size="xsmall">{appointment.title}</Heading>
          <Paragraph $variant="secondary" $size="small">
            {formatDate(appointment.scheduled_at, { preset: 'datetime' })}
            {appointment.duration_minutes && ` (${appointment.duration_minutes} min)`}
          </Paragraph>
          {appointment.location && (
            <Paragraph $variant="secondary" $size="small">
              {appointment.location}
            </Paragraph>
          )}
          {appointment.description && (
            <Paragraph $size="small">{appointment.description}</Paragraph>
          )}
        </FlexColumn>
        <FlexRow $gap="xs" $width="auto">
          <StyledCard $variant="pill" $tone="blue" $noBorder $noShadow>
            <Paragraph $size="xsmall" $color={theme.colors.accent.blue.strong}>
              {APPOINTMENT_TYPE_LABELS[appointment.appointment_type]}
            </Paragraph>
          </StyledCard>
          <StyledCard
            $variant="pill"
            $tone={STATUS_TONE_MAP[appointment.status]}
            $noBorder
            $noShadow
          >
            <Paragraph $size="xsmall">{APPOINTMENT_STATUS_LABELS[appointment.status]}</Paragraph>
          </StyledCard>
        </FlexRow>
      </FlexRow>

      <FlexRow $gap="xs" $mt="sm">
        <Button $size="small" $variant="ghost" onClick={() => onEdit(appointment)}>
          <Icons.Edit size="sm" /> Bewerk
        </Button>
        {isScheduled && (
          <>
            <Button
              $size="small"
              $variant="ghost"
              onClick={() => onUpdateStatus(appointment.id, 'completed')}
            >
              <Icons.Check size="sm" /> Voltooid
            </Button>
            <Button
              $size="small"
              $variant="ghost"
              onClick={() => onUpdateStatus(appointment.id, 'no_show')}
            >
              <Icons.X size="sm" /> No-show
            </Button>
            <Button
              $size="small"
              $variant="ghost"
              onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
            >
              <Icons.X size="sm" /> Annuleer
            </Button>
          </>
        )}
        <FlexRow $flex={1} $justify="flex-end">
          <Button
            $size="small"
            $variant="ghost"
            onClick={() => onDelete(appointment.id)}
            aria-label="Afspraak verwijderen"
          >
            <Icons.Trash size="sm" aria-hidden="true" />
          </Button>
        </FlexRow>
      </FlexRow>
    </StyledCard>
  );
}

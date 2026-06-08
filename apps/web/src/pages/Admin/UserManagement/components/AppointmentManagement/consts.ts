import type { SelectOption } from '@components/form/Select';

import type { AppointmentStatus, AppointmentType } from '@package/api';

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  blood_test: 'Bloedtest',
  consultation: 'Consultatie',
  follow_up: 'Follow-up',
  initial_assessment: 'Intake',
  other: 'Anders',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Gepland',
  completed: 'Voltooid',
  cancelled: 'Geannuleerd',
  no_show: 'Niet verschenen',
};

export const APPOINTMENT_TYPE_OPTIONS: SelectOption[] = Object.entries(APPOINTMENT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const STATUS_TONE_MAP: Record<AppointmentStatus, 'success' | 'error' | 'warning' | 'blue'> =
  {
    completed: 'success',
    cancelled: 'error',
    no_show: 'warning',
    scheduled: 'blue',
  };

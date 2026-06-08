import type { Appointment, AppointmentType } from '@package/api';

export type ViewMode = 'all' | 'upcoming' | 'past';

export interface AppointmentFormState {
  title: string;
  description: string;
  appointmentType: AppointmentType;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  location: string;
  adminNotes: string;
}

export const EMPTY_FORM_STATE: AppointmentFormState = {
  title: '',
  description: '',
  appointmentType: 'consultation',
  scheduledDate: '',
  scheduledTime: '',
  durationMinutes: 60,
  location: '',
  adminNotes: '',
};

export function appointmentToFormState(appointment: Appointment): AppointmentFormState {
  const date = new Date(appointment.scheduled_at);

  return {
    title: appointment.title,
    description: appointment.description || '',
    appointmentType: appointment.appointment_type,
    scheduledDate: date.toISOString().split('T')[0],
    scheduledTime: date.toTimeString().slice(0, 5),
    durationMinutes: appointment.duration_minutes,
    location: appointment.location || '',
    adminNotes: appointment.admin_notes || '',
  };
}

export function formStateToPayload(state: AppointmentFormState) {
  return {
    title: state.title,
    description: state.description || null,
    appointment_type: state.appointmentType,
    scheduled_at: `${state.scheduledDate}T${state.scheduledTime}:00`,
    duration_minutes: state.durationMinutes,
    location: state.location || null,
    admin_notes: state.adminNotes || null,
  };
}

export function filterAppointments(
  appointments: Appointment[],
  viewMode: ViewMode,
  now = new Date()
): Appointment[] {
  if (viewMode === 'all') return appointments;

  return appointments.filter((appointment) => {
    const date = new Date(appointment.scheduled_at);

    if (viewMode === 'upcoming') {
      return date >= now && appointment.status === 'scheduled';
    }

    return date < now || appointment.status !== 'scheduled';
  });
}

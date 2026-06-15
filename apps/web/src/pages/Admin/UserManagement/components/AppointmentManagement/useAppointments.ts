import { useCallback, useEffect, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';

import type { Appointment, AppointmentStatus } from '@package/api';

import { type AppointmentFormState, formStateToPayload } from './types';

interface UseAppointmentsOptions {
  userId: string;
  onChange: () => void;
}

export function useAppointments({ userId, onChange }: UseAppointmentsOptions) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/appointments/user/${userId}`);
      const data = await response.json();

      setAppointments(data.appointments || []);
    } catch {
      // empty list is a valid fallback
    }
  }, [userId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const create = useCallback(
    async (state: AppointmentFormState) => {
      setLoading(true);
      try {
        await authenticatedFetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, ...formStateToPayload(state) }),
        });
        await fetchAppointments();
        onChange();

        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchAppointments, onChange]
  );

  const update = useCallback(
    async (id: string, state: AppointmentFormState) => {
      setLoading(true);
      try {
        await authenticatedFetch(`/api/appointments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formStateToPayload(state)),
        });
        await fetchAppointments();
        onChange();

        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchAppointments, onChange]
  );

  const updateStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      try {
        await authenticatedFetch(`/api/appointments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        await fetchAppointments();
        onChange();
      } catch {
        // empty list is a valid fallback
      }
    },
    [fetchAppointments, onChange]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await authenticatedFetch(`/api/appointments/${id}`, { method: 'DELETE' });
        await fetchAppointments();
        onChange();
      } catch {
        // empty list is a valid fallback
      }
    },
    [fetchAppointments, onChange]
  );

  return { appointments, loading, create, update, updateStatus, remove };
}

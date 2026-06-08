import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { exportMock } from '@helpers/exportMock';

import type {
  Achievement,
  Appointment,
  DataContextType,
  DataProviderProps,
  PerformanceProfileData,
  PerformanceProfileState,
} from '@package/api';
import { DataContext, useAuth } from '@package/api';

const INITIAL_PERFORMANCE_PROFILE: PerformanceProfileState = {
  data: null,
  loading: false,
  error: null,
  fetched: false,
};

type CoreData = Omit<
  DataContextType,
  | 'loading'
  | 'performanceProfile'
  | 'fetchPerformanceProfile'
  | 'savePerformanceProfile'
  | 'invalidatePerformanceProfile'
  | 'appointments'
  | 'lastAppointment'
  | 'nextAppointment'
  | 'appointmentsLoading'
  | 'fetchAppointments'
  | 'achievements'
  | 'achievementsLoading'
  | 'fetchAchievements'
  | 'addAchievement'
  | 'removeAchievement'
>;

const EMPTY_DATA: CoreData = {
  latestTest: null,
  biomarkers: [],
  userGender: null,
  goals: [],
  performances: [],
  peakScores: [],
  bloodTests: [],
  biomarkerHistory: {},
  fetchBiomarkerHistory: async () => {},
};

export function DataProvider({ children }: DataProviderProps) {
  const { isAuthenticated } = useAuth();
  const token = isAuthenticated ? 'authenticated' : null;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CoreData>(EMPTY_DATA);

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  // Performance profile
  const [performanceProfile, setPerformanceProfile] = useState<PerformanceProfileState>(
    INITIAL_PERFORMANCE_PROFILE
  );

  const lastFetchedToken = useRef<string | null>(null);
  const fetchingBiomarkerIds = useRef(new Set<number>());
  const isFetchingProfile = useRef(false);

  const fetchAppointments = useCallback(async () => {
    if (!token) return;
    setAppointmentsLoading(true);
    try {
      const res = await authenticatedFetch('/api/appointments/my');

      if (res.ok) {
        const result = await res.json();

        setAppointments(result.appointments || []);
        setLastAppointment(result.lastAppointment || null);
        setNextAppointment(result.nextAppointment || null);
      }
    } catch {
      // swallow: empty list is a valid fallback
    } finally {
      setAppointmentsLoading(false);
    }
  }, [token]);

  const fetchAchievements = useCallback(async () => {
    if (!token) return;
    setAchievementsLoading(true);
    try {
      const res = await authenticatedFetch('/api/achievements');

      if (res.ok) {
        const result = await res.json();

        setAchievements(result.achievements || []);
      }
    } catch {
      // swallow: empty list is a valid fallback
    } finally {
      setAchievementsLoading(false);
    }
  }, [token]);

  const addAchievement = useCallback(
    async (data: {
      category: string;
      title: string;
      value: string;
      reps?: number;
      achieved_at: string;
    }): Promise<Achievement | null> => {
      if (!token) return null;
      try {
        const res = await authenticatedFetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const result = await res.json();

          setAchievements((prev) => [result.achievement, ...prev]);

          return result.achievement;
        }

        return null;
      } catch {
        return null;
      }
    },
    [token]
  );

  const removeAchievement = useCallback(
    async (id: string): Promise<boolean> => {
      if (!token) return false;
      try {
        const res = await authenticatedFetch(`/api/achievements/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setAchievements((prev) => prev.filter((a) => a.id !== id));

          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [token]
  );

  const fetchBiomarkerHistory = useCallback(
    async (biomarkerId: number) => {
      if (!token) return;

      setData((prev) => {
        if (prev.biomarkerHistory[biomarkerId]) return prev; // cached
        if (fetchingBiomarkerIds.current.has(biomarkerId)) return prev; // in-flight

        fetchingBiomarkerIds.current.add(biomarkerId);

        (async () => {
          try {
            const res = await authenticatedFetch(`/api/biomarkers/history/${biomarkerId}`);

            if (res.ok) {
              const result = await res.json();

              setData((cur) => ({
                ...cur,
                biomarkerHistory: {
                  ...cur.biomarkerHistory,
                  [biomarkerId]: result.history || [],
                },
              }));
            }
          } catch {
            // swallow: empty history is a valid fallback
          } finally {
            fetchingBiomarkerIds.current.delete(biomarkerId);
          }
        })();

        return prev;
      });
    },
    [token]
  );

  const fetchPerformanceProfile = useCallback(async (): Promise<PerformanceProfileData | null> => {
    if (!token) return null;
    if (performanceProfile.fetched && performanceProfile.data) return performanceProfile.data;
    if (isFetchingProfile.current) return null;

    isFetchingProfile.current = true;
    setPerformanceProfile((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await authenticatedFetch('/api/performance/profile');

      if (!res.ok) {
        setPerformanceProfile((prev) => ({
          ...prev,
          loading: false,
          error: `Failed to fetch performance profile: ${res.status}`,
          fetched: true,
        }));

        return null;
      }

      const result = await res.json();
      const profileData: PerformanceProfileData = {
        form_data: result.profile?.form_data || null,
        plan_form_data: result.profile?.plan_form_data || null,
        ai_plan: result.profile?.ai_plan || null,
      };

      setPerformanceProfile({
        data: result.profile ? profileData : null,
        loading: false,
        error: null,
        fetched: true,
      });

      return result.profile ? profileData : null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch performance profile';

      setPerformanceProfile((prev) => ({
        ...prev,
        loading: false,
        error: message,
        fetched: true,
      }));

      return null;
    } finally {
      isFetchingProfile.current = false;
    }
  }, [token, performanceProfile.fetched, performanceProfile.data]);

  const savePerformanceProfile = useCallback(
    async (profileData: { form_data: unknown; ai_plan?: unknown }): Promise<boolean> => {
      if (!token) return false;

      try {
        const res = await authenticatedFetch('/api/performance/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        });

        if (res.ok) {
          setPerformanceProfile((prev) => ({
            ...prev,
            data: {
              form_data: profileData.form_data,
              plan_form_data: profileData.ai_plan
                ? profileData.form_data
                : prev.data?.plan_form_data || null,
              ai_plan: profileData.ai_plan || prev.data?.ai_plan || null,
            },
          }));

          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [token]
  );

  const invalidatePerformanceProfile = useCallback(() => {
    setPerformanceProfile(INITIAL_PERFORMANCE_PROFILE);
  }, []);

  useEffect(() => {
    if (!token) {
      setData({ ...EMPTY_DATA, fetchBiomarkerHistory });
      setPerformanceProfile(INITIAL_PERFORMANCE_PROFILE);
      setAppointments([]);
      setLastAppointment(null);
      setNextAppointment(null);
      setAchievements([]);
      setLoading(false);
      lastFetchedToken.current = null;

      return;
    }

    if (token === lastFetchedToken.current) return;
    setPerformanceProfile(INITIAL_PERFORMANCE_PROFILE);
    lastFetchedToken.current = token;

    const loadAll = async () => {
      setLoading(true);

      const [dashboardRes, bloodTestsRes, perfRes] = await Promise.all([
        authenticatedFetch('/api/dashboard').then((r) => r.json()),
        authenticatedFetch('/api/blood-tests').then((r) => r.json()),
        authenticatedFetch('/api/performance/profile')
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      exportMock('dashboard', dashboardRes);
      exportMock('bloodTests', bloodTestsRes);

      setData({
        latestTest: dashboardRes.latestTest,
        biomarkers: dashboardRes.biomarkers,
        userGender: dashboardRes.userGender ?? null,
        goals: dashboardRes.goals,
        performances: dashboardRes.performances,
        peakScores: dashboardRes.peakScores,
        bloodTests: bloodTestsRes.tests || [],
        biomarkerHistory: {},
        fetchBiomarkerHistory,
      });

      setPerformanceProfile({
        data: perfRes?.profile
          ? {
              form_data: perfRes.profile.form_data || null,
              plan_form_data: perfRes.profile.plan_form_data || null,
              ai_plan: perfRes.profile.ai_plan || null,
            }
          : null,
        loading: false,
        error: null,
        fetched: true,
      });

      fetchAppointments();
      fetchAchievements();
      setLoading(false);
    };

    loadAll();
  }, [token, fetchBiomarkerHistory, fetchAppointments, fetchAchievements]);

  const contextValue = useMemo(
    () => ({
      ...data,
      loading,
      fetchBiomarkerHistory,
      performanceProfile,
      fetchPerformanceProfile,
      savePerformanceProfile,
      invalidatePerformanceProfile,
      appointments,
      lastAppointment,
      nextAppointment,
      appointmentsLoading,
      fetchAppointments,
      achievements,
      achievementsLoading,
      fetchAchievements,
      addAchievement,
      removeAchievement,
    }),
    [
      data,
      loading,
      fetchBiomarkerHistory,
      performanceProfile,
      fetchPerformanceProfile,
      savePerformanceProfile,
      invalidatePerformanceProfile,
      appointments,
      lastAppointment,
      nextAppointment,
      appointmentsLoading,
      fetchAppointments,
      achievements,
      achievementsLoading,
      fetchAchievements,
      addAchievement,
      removeAchievement,
    ]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}

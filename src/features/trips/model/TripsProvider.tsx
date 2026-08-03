import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AppError } from '@/api/AppError';
import { fetchTrips } from '@/api/tripsApi';
import { useRefetchOnFocusAndNetwork } from '@/hooks/useRefetchOnFocusAndNetwork';

import type { Trip } from './types';

type LoadMode = 'initial' | 'refresh' | 'silent';

type TripsContextValue = {
  trips: Trip[];
  /** Перше завантаження (немає даних). */
  loading: boolean;
  /** Pull-to-refresh. */
  refreshing: boolean;
  /** Остання помилка мережі / сервера (null якщо ок). */
  error: AppError | null;
  getTrip: (id: string) => Trip | undefined;
  /** Локально додана поїздка (до RTK Query / POST — лише в пам’яті). */
  addTrip: (trip: Trip) => void;
  /** Повторний GET /trips. */
  refetch: (mode?: LoadMode) => Promise<void>;
};

const TripsContext = createContext<TripsContextValue | null>(null);

type TripsProviderProps = {
  children: ReactNode;
};

export function TripsProvider({ children }: TripsProviderProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const refetch = useCallback(async (mode: LoadMode = 'silent') => {
    if (mode === 'initial') {
      setLoading(true);
    }
    if (mode === 'refresh') {
      setRefreshing(true);
    }

    try {
      const data = await fetchTrips();
      setTrips(data);
      setError(null);
    } catch (err) {
      const appError = AppError.from(err);
      setError(appError);
      // Не очищуємо trips: при офлайні / retry залишаємо попередній успішний список.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refetch('initial');
  }, [refetch]);

  useRefetchOnFocusAndNetwork(() => {
    void refetch('silent');
  });

  const getTrip = useCallback(
    (id: string) => trips.find((t) => t.id === id),
    [trips],
  );

  const addTrip = useCallback((trip: Trip) => {
    setTrips((prev) => [trip, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      trips,
      loading,
      refreshing,
      error,
      getTrip,
      addTrip,
      refetch,
    }),
    [trips, loading, refreshing, error, getTrip, addTrip, refetch],
  );

  return (
    <TripsContext.Provider value={value}>{children}</TripsContext.Provider>
  );
}

export function useTrips(): TripsContextValue {
  const ctx = useContext(TripsContext);
  if (!ctx) {
    throw new Error('useTrips треба викликати всередині TripsProvider');
  }
  return ctx;
}

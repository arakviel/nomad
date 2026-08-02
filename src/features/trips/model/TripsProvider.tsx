import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { mockTrips } from './mockTrips';
import type { Trip } from './types';

type TripsContextValue = {
  trips: Trip[];
  /** Додати нову поїздку на початок стрічки (найсвіжіша зверху). */
  addTrip: (trip: Trip) => void;
  /** Mock «оновити з сервера» — повертає seed mockTrips (без локально створених). */
  resetToMock: () => void;
};

const TripsContext = createContext<TripsContextValue | null>(null);

type TripsProviderProps = {
  children: ReactNode;
};

export function TripsProvider({ children }: TripsProviderProps) {
  const [trips, setTrips] = useState<Trip[]>(() => [...mockTrips]);

  const addTrip = useCallback((trip: Trip) => {
    setTrips((prev) => [trip, ...prev]);
  }, []);

  const resetToMock = useCallback(() => {
    setTrips([...mockTrips]);
  }, []);

  const value = useMemo(
    () => ({ trips, addTrip, resetToMock }),
    [trips, addTrip, resetToMock],
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

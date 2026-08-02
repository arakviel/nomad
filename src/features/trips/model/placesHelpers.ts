import { mockPlaces } from './mockPlaces';
import type { Place } from './types';

/** Місця, прив’язані до поїздки (mock). */
export function getPlacesForTrip(tripId: string): Place[] {
  return mockPlaces.filter((p) => p.tripId === tripId);
}

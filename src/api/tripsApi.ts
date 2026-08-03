import type { Trip } from '@/features/trips/model/types';

import { AppError } from './AppError';
import { apiClient } from './client';

/** GET /trips — список поїздок з mock REST (json-server). */
export async function fetchTrips(): Promise<Trip[]> {
  try {
    const response = await apiClient.get<Trip[]>('/trips');
    return response.data;
  } catch (error) {
    throw AppError.from(error);
  }
}

/** GET /trips/:id — одна поїздка (на майбутнє / deep link cold start). */
export async function fetchTripById(id: string): Promise<Trip> {
  try {
    const response = await apiClient.get<Trip>(`/trips/${id}`);
    return response.data;
  } catch (error) {
    throw AppError.from(error);
  }
}

export type Trip = {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  coverUri: string;
  /** Регіон / макрозона (з Picker у формі створення). */
  region: string;
  /** Приватна поїздка (Switch) — навчальна мітка на картці. */
  isPrivate?: boolean;
  /** Скільки днів плануємо (Slider 1–14). */
  plannedDays?: number;
  /** Є попередній план маршруту (Checkbox). */
  hasItinerary?: boolean;
};

export type Place = {
  id: string;
  tripId: string;
  name: string;
  city: string;
  note: string;
};

/** Варіанти регіону для Picker — ті самі рядки, що в mock-стрічці. */
export const TRIP_REGIONS = [
  'Карпати',
  'Захід',
  'Південь',
  'Центр',
  'Схід',
  'Інше',
] as const;

export type TripRegion = (typeof TRIP_REGIONS)[number];

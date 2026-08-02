import { z } from 'zod';

import { TRIP_REGIONS } from './types';

/**
 * Схема створення поїздки (Zod).
 * Повідомлення — українською: саме їх побачить користувач під полем.
 *
 * Покриває різні типи контролів:
 * - string → TextInput
 * - enum → Picker
 * - date → DateTimePicker
 * - boolean → Switch / Checkbox
 * - number → Slider
 */
export const createTripSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Назва має містити щонайменше 2 символи')
      .max(80, 'Назва занадто довга (макс. 80)'),
    region: z.enum(TRIP_REGIONS, {
      error: 'Оберіть регіон зі списку',
    }),
    description: z
      .string()
      .trim()
      .min(10, 'Опис — щонайменше 10 символів')
      .max(500, 'Опис занадто довгий (макс. 500)'),
    startDate: z.date({ error: 'Оберіть дату початку' }),
    endDate: z.date({ error: 'Оберіть дату завершення' }),
    /** Switch: чи ховати поїздку з «публічної» стрічки (навчальна семантика). */
    isPrivate: z.boolean(),
    /** Slider: орієнтовна тривалість у днях. */
    plannedDays: z
      .number()
      .min(1, 'Мінімум 1 день')
      .max(14, 'У формі максимум 14 днів'),
    /** Checkbox: чи є план маршруту. */
    hasItinerary: z.boolean(),
    /**
     * Checkbox з обов’язковою згодою.
     * `true` — єдине прийнятне значення (як «прийняти умови»).
     */
    acceptedLocalSave: z.literal(true, {
      error: 'Підтвердіть, що дані поки зберігаються лише на пристрої',
    }),
  })
  .refine((data) => data.endDate.getTime() >= data.startDate.getTime(), {
    message: 'Дата завершення не може бути раніше початку',
    path: ['endDate'],
  });

export type CreateTripFormValues = z.infer<typeof createTripSchema>;

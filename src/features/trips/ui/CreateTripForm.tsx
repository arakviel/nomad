import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import Checkbox from '@react-native-community/checkbox';
import Slider from '@react-native-community/slider';

import {
  createTripSchema,
  type CreateTripFormValues,
} from '@/features/trips/model/createTripSchema';
import { formatTripDateLabel } from '@/features/trips/model/formatTripDates';
import { TRIP_REGIONS, type Trip } from '@/features/trips/model/types';
import { DateField } from '@/features/trips/ui/DateField';
import { FormRow } from '@/features/trips/ui/FormRow';
import { useTheme } from '@/shared/theme';
import { AppText, Button, TextField } from '@/shared/ui';

type CreateTripFormProps = {
  onSubmitSuccess: (trip: Trip) => void;
  onCancel?: () => void;
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Форма «Нова поїздка»: усі основні form-контроли + RHF + Zod.
 * Не залежить від навігації — батько вирішує, куди піти після submit.
 */
export function CreateTripForm({
  onSubmitSuccess,
  onCancel,
}: CreateTripFormProps) {
  const { colors, spacing, radius } = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTripFormValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: '',
      region: 'Карпати',
      description: '',
      startDate: startOfToday(),
      endDate: addDays(startOfToday(), 2),
      isPrivate: false,
      plannedDays: 3,
      hasItinerary: false,
      // literal true — у default false, щоб користувач свідомо поставив галочку
      acceptedLocalSave: false as unknown as true,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const startDate = watch('startDate');
  const plannedDays = watch('plannedDays');

  const onValid = (values: CreateTripFormValues) => {
    setSubmitting(true);
    const trip: Trip = {
      id: `local-${Date.now()}`,
      title: values.title,
      region: values.region,
      description: values.description,
      dateLabel: formatTripDateLabel(values.startDate, values.endDate),
      coverUri: `https://picsum.photos/seed/${encodeURIComponent(values.title)}/800/400`,
      isPrivate: values.isPrivate,
      plannedDays: values.plannedDays,
      hasItinerary: values.hasItinerary,
    };
    onSubmitSuccess(trip);
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="caption" color={colors.textSecondary}>
          Заповніть поля. Помилки з’являться після натискання «Створити», якщо
          щось не так. Тут зібрані різні типи контролів: текст, список, дати,
          перемикач, галочка, повзунок.
        </AppText>

        {/* ——— TextInput ——— */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Назва поїздки"
              placeholder="Наприклад, Карпати на вихідні"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
              autoCapitalize="sentences"
              returnKeyType="next"
              maxLength={80}
            />
          )}
        />

        {/* ——— Picker ——— */}
        <Controller
          control={control}
          name="region"
          render={({ field: { onChange, value } }) => (
            <FormRow
              label="Регіон"
              description="Оберіть зі списку (Picker), а не вводьте вручну"
              error={errors.region?.message}
              stacked
              control={
                <View
                  style={[
                    styles.pickerWrap,
                    {
                      borderColor: errors.region
                        ? colors.danger
                        : colors.border,
                      backgroundColor: colors.surface,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    dropdownIconColor={colors.text}
                    style={{ color: colors.text }}
                  >
                    {TRIP_REGIONS.map((region) => (
                      <Picker.Item
                        key={region}
                        label={region}
                        value={region}
                        color={colors.text}
                      />
                    ))}
                  </Picker>
                </View>
              }
            />
          )}
        />

        {/* ——— DateTimePicker через DateField ——— */}
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <DateField
              label="Дата початку"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.startDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <DateField
              label="Дата завершення"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={errors.endDate?.message}
              minimumDate={startDate}
            />
          )}
        />

        {/* ——— TextInput multiline ——— */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label="Опис"
              placeholder="Коротко: що плануєте побачити, з ким їдете…"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.multiline}
              maxLength={500}
              hint="Мінімум 10 символів"
            />
          )}
        />

        {/* ——— Slider ——— */}
        <Controller
          control={control}
          name="plannedDays"
          render={({ field: { onChange, value } }) => (
            <FormRow
              label={`Тривалість: ${value} ${daysWord(value)}`}
              description="Повзунок (Slider) — зручно для діапазону 1–14"
              error={errors.plannedDays?.message}
              stacked
              control={
                <Slider
                  minimumValue={1}
                  maximumValue={14}
                  step={1}
                  value={value}
                  onValueChange={onChange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.border}
                  thumbTintColor={colors.primary}
                />
              }
            />
          )}
        />
        <AppText variant="caption" color={colors.textSecondary}>
          Зараз на слайдері: {plannedDays}{' '}
          {daysWord(plannedDays ?? 1)} (можна не збігатися з датами — це
          окреме «орієнтовне» поле для навчання).
        </AppText>

        {/* ——— Switch ——— */}
        <Controller
          control={control}
          name="isPrivate"
          render={({ field: { onChange, value } }) => (
            <FormRow
              label="Приватна поїздка"
              description="Switch: увімкнено — мітка «приватна» на картці"
              error={errors.isPrivate?.message}
              control={
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.onPrimary}
                  ios_backgroundColor={colors.border}
                />
              }
            />
          )}
        />

        {/* ——— Checkbox (опційний прапорець) ——— */}
        <Controller
          control={control}
          name="hasItinerary"
          render={({ field: { onChange, value } }) => (
            <FormRow
              label="Є план маршруту"
              description="Checkbox: так / ні, без обов’язковості"
              error={errors.hasItinerary?.message}
              control={
                <Checkbox
                  value={value}
                  onValueChange={onChange}
                  tintColors={{
                    true: colors.primary,
                    false: colors.border,
                  }}
                  onCheckColor={colors.onPrimary}
                  onFillColor={colors.primary}
                  onTintColor={colors.primary}
                  boxType="square"
                />
              }
            />
          )}
        />

        {/* ——— Checkbox (обов’язкова згода) ——— */}
        <Controller
          control={control}
          name="acceptedLocalSave"
          render={({ field: { onChange, value } }) => (
            <FormRow
              label="Згода на локальне збереження"
              description="Поки немає API: дані лишаються в пам’яті застосунку"
              error={errors.acceptedLocalSave?.message}
              control={
                <Checkbox
                  value={Boolean(value)}
                  onValueChange={onChange}
                  tintColors={{
                    true: colors.primary,
                    false: colors.border,
                  }}
                  onCheckColor={colors.onPrimary}
                  onFillColor={colors.primary}
                  onTintColor={colors.primary}
                  boxType="square"
                />
              }
            />
          )}
        />

        {/* ——— Button (Pressable-обгортка з shared/ui) ——— */}
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <Button
            label={submitting ? 'Створюємо…' : 'Створити поїздку'}
            onPress={handleSubmit(onValid)}
            disabled={submitting}
          />
          {onCancel ? (
            <Button
              label="Скасувати"
              variant="secondary"
              onPress={onCancel}
              disabled={submitting}
            />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function daysWord(n: number): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return 'днів';
  if (last === 1) return 'день';
  if (last >= 2 && last <= 4) return 'дні';
  return 'днів';
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  multiline: {
    minHeight: 110,
  },
  pickerWrap: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { useTheme } from '@/shared/theme';
import { AppText, Button } from '@/shared/ui';

type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  onBlur?: () => void;
  error?: string;
  /** Мінімальна дата (наприклад, endDate ≥ startDate). */
  minimumDate?: Date;
  maximumDate?: Date;
};

/**
 * Поле дати: натискання відкриває системний date picker.
 * iOS — spinner у Modal; Android — нативний діалог.
 */
export function DateField({
  label,
  value,
  onChange,
  onBlur,
  error,
  minimumDate,
  maximumDate,
}: DateFieldProps) {
  const { colors, spacing, radius } = useTheme();
  const [open, setOpen] = useState(false);
  /** Тимчасове значення на iOS, поки користувач крутить spinner. */
  const [draft, setDraft] = useState(value);

  const hasError = Boolean(error);

  const openPicker = () => {
    setDraft(value);
    setOpen(true);
  };

  const closePicker = () => {
    setOpen(false);
    onBlur?.();
  };

  const applyIos = () => {
    onChange(draft);
    closePicker();
  };

  const onAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android закриває діалог сам; event.type: set | dismissed
    setOpen(false);
    if (event.type === 'set' && selected) {
      onChange(selected);
    }
    onBlur?.();
  };

  const onIosChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setDraft(selected);
    }
  };

  const display = formatDisplay(value);

  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display}`}
        onPress={openPicker}
        style={[
          styles.field,
          {
            borderColor: hasError ? colors.danger : colors.border,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            paddingVertical: spacing.sm + 4,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <AppText>{display}</AppText>
      </Pressable>
      {hasError ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : null}

      {/* Android: системний діалог; iOS/web: spinner у Modal */}
      {Platform.OS === 'android' && open ? (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={onAndroidChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : null}

      {Platform.OS !== 'android' ? (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={closePicker}
        >
          <Pressable style={styles.backdrop} onPress={closePicker} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                paddingBottom: spacing.lg,
              },
            ]}
          >
            <View
              style={[
                styles.sheetHeader,
                { paddingHorizontal: spacing.md, paddingTop: spacing.md },
              ]}
            >
              <AppText variant="subtitle">{label}</AppText>
            </View>
            <DateTimePicker
              value={draft}
              mode="date"
              display="spinner"
              onChange={onIosChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              style={{ alignSelf: 'center' }}
            />
            <View
              style={[
                styles.sheetActions,
                { paddingHorizontal: spacing.md, gap: spacing.sm },
              ]}
            >
              <Button label="Готово" onPress={applyIos} />
              <Pressable onPress={closePicker} style={styles.cancel}>
                <AppText color={colors.textSecondary}>Скасувати</AppText>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function formatDisplay(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
  },
  field: {
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
  },
  sheetHeader: {
    alignItems: 'center',
  },
  sheetActions: {
    marginTop: 8,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});

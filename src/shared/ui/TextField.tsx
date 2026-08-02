import { ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from './AppText';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /** Допоміжний текст під полем (коли немає error). */
  hint?: string;
  containerStyle?: ViewStyle;
  /** Опційний правий слот (іконка, кнопка дати). */
  rightSlot?: ReactNode;
};

/**
 * Поле форми: label + TextInput + помилка/підказка.
 * Контрольоване ззовні (value / onChangeText) — зручно з RHF Controller.
 */
export function TextField({
  label,
  error,
  hint,
  containerStyle,
  rightSlot,
  style,
  ...inputProps
}: TextFieldProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrap, { gap: spacing.xs }, containerStyle]}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <View
        style={[
          styles.row,
          {
            borderColor: hasError ? colors.danger : colors.border,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              color: colors.text,
              fontSize: fontSize.md,
              paddingVertical: spacing.sm + 4,
              paddingHorizontal: spacing.md,
            },
            style,
          ]}
          {...inputProps}
        />
        {rightSlot}
      </View>
      {hasError ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    minHeight: 48,
  },
});

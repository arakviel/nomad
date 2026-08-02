import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

type FormRowProps = {
  label: string;
  /** Короткий опис під label (для Switch / Checkbox / Slider). */
  description?: string;
  error?: string;
  /** Правий слот: Switch, Checkbox тощо. */
  control: ReactNode;
  /** Якщо true — control під label на всю ширину (Slider, Picker). */
  stacked?: boolean;
};

/**
 * Рядок форми для не-текстових контролів:
 * label + опис зліва, control справа (або stacked).
 */
export function FormRow({
  label,
  description,
  error,
  control,
  stacked = false,
}: FormRowProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.wrap, { gap: spacing.xs }]}>
      <View
        style={[
          stacked ? styles.stacked : styles.row,
          !stacked && { gap: spacing.md },
        ]}
      >
        <View style={styles.texts}>
          <AppText variant="caption" style={styles.label}>
            {label}
          </AppText>
          {description ? (
            <AppText variant="caption" color={colors.textSecondary}>
              {description}
            </AppText>
          ) : null}
        </View>
        <View style={stacked ? styles.fullControl : styles.sideControl}>
          {control}
        </View>
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontWeight: '600',
  },
  sideControl: {
    flexShrink: 0,
  },
  fullControl: {
    marginTop: 8,
    width: '100%',
  },
});

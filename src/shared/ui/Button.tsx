import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { tokens } from '@/shared/theme';
type ButtonProps = { label: string; onPress: () => void; disabled?: boolean; style?: ViewStyle };
export function Button({ label, onPress, disabled = false, style }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && !disabled ? styles.pressed : null, disabled ? styles.disabled : null, style]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: { backgroundColor: tokens.colors.primary, paddingVertical: tokens.spacing.sm + 4, paddingHorizontal: tokens.spacing.md, borderRadius: tokens.radius.md, alignItems: 'center' },
  pressed: { backgroundColor: tokens.colors.primaryPressed },
  disabled: { opacity: 0.5 },
  label: { color: tokens.colors.onPrimary, fontSize: tokens.fontSize.md, fontWeight: '600' },
});

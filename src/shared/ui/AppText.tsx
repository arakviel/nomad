import { ReactNode } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { tokens } from '@/shared/theme';
type AppTextVariant = 'body' | 'title' | 'subtitle' | 'caption';
type AppTextProps = TextProps & { children: ReactNode; variant?: AppTextVariant; color?: string; style?: TextStyle | TextStyle[] };
export function AppText({ children, variant = 'body', color = tokens.colors.text, style, ...rest }: AppTextProps) {
  return <Text style={[styles.base, styles[variant], { color }, style]} {...rest}>{children}</Text>;
}
const styles = StyleSheet.create({
  base: { color: tokens.colors.text },
  body: { fontSize: tokens.fontSize.md, lineHeight: 24 },
  title: { fontSize: tokens.fontSize.xl, fontWeight: '700', lineHeight: 34 },
  subtitle: { fontSize: tokens.fontSize.lg, fontWeight: '600', lineHeight: 28 },
  caption: { fontSize: tokens.fontSize.sm, color: tokens.colors.textSecondary, lineHeight: 20 },
});

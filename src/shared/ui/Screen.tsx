import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '@/shared/theme';
type ScreenProps = { children: ReactNode; style?: ViewStyle };
export function Screen({ children, style }: ScreenProps) {
  return <SafeAreaView style={[styles.root, style]}>{children}</SafeAreaView>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.colors.background, paddingHorizontal: tokens.spacing.md },
});

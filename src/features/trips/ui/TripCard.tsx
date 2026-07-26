import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import type { Trip } from '@/features/trips/model/types';
import { tokens } from '@/shared/theme';
import { AppText } from '@/shared/ui';
type TripCardProps = { trip: Trip; onPress?: (trip: Trip) => void };
export function TripCard({ trip, onPress }: TripCardProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Поїздка ${trip.title}`}
      onPress={() => onPress?.(trip)} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <Image source={{ uri: trip.coverUri }} style={styles.cover} resizeMode="cover" accessibilityIgnoresInvertColors />
      <View style={styles.body}>
        <AppText variant="subtitle" numberOfLines={1}>{trip.title}</AppText>
        <AppText variant="caption" style={styles.dates}>{trip.dateLabel}</AppText>
        <AppText numberOfLines={2} style={styles.description}>{trip.description}</AppText>
        <View style={styles.footer}><AppText variant="caption" color={tokens.colors.primary}>Відкрити</AppText></View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: tokens.colors.surface, borderRadius: tokens.radius.lg, borderWidth: 1, borderColor: tokens.colors.border, overflow: 'hidden', marginBottom: tokens.spacing.md,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }, android: { elevation: 3 }, default: {} }) },
  cardPressed: { opacity: 0.92 },
  cover: { width: '100%', height: 160, backgroundColor: tokens.colors.border },
  body: { padding: tokens.spacing.md, gap: tokens.spacing.xs },
  dates: { marginTop: 2 },
  description: { marginTop: tokens.spacing.xs, color: tokens.colors.textSecondary },
  footer: { marginTop: tokens.spacing.sm, alignItems: 'flex-start' },
});

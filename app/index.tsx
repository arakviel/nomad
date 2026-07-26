import { ScrollView, StyleSheet, View } from 'react-native';
import { mockTrips, TripCard, type Trip } from '@/features/trips';
import { tokens } from '@/shared/theme';
import { AppText, Button, Screen } from '@/shared/ui';
export default function HomeScreen() {
  const handleOpenTrip = (trip: Trip) => console.log('TODO', trip.id);
  const hasTrips = mockTrips.length > 0;
  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <AppText variant="title">Мандрівник</AppText>
        <AppText variant="caption" style={styles.caption}>Щоденник подорожей</AppText>
        <AppText variant="caption" style={styles.meta}>
          {hasTrips ? `${mockTrips.length} поїздки у списку` : 'Список порожній'}
        </AppText>
      </View>
      {hasTrips ? (
        <ScrollView style={styles.list} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppText style={styles.sectionLabel}>Ваші поїздки</AppText>
          <View style={styles.cards}>
            {mockTrips.map((trip) => <TripCard key={trip.id} trip={trip} onPress={handleOpenTrip} />)}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <AppText variant="subtitle" style={styles.emptyTitle}>Поки немає поїздок</AppText>
          <AppText variant="caption" style={styles.emptyDesc}>Створіть першу — і тут з’явиться стрічка.</AppText>
        </View>
      )}
      <View style={styles.footer}>
        <Button label="Нова поїздка" onPress={() => console.log('TODO')} />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  header: { paddingHorizontal: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.md, gap: tokens.spacing.xs, borderBottomWidth: 1, borderBottomColor: tokens.colors.border },
  caption: { marginTop: tokens.spacing.xs },
  meta: { marginTop: tokens.spacing.xs, color: tokens.colors.primary, fontWeight: '600' },
  list: { flex: 1 },
  scrollContent: { paddingHorizontal: tokens.spacing.md, paddingTop: tokens.spacing.md, paddingBottom: tokens.spacing.md },
  sectionLabel: { marginBottom: tokens.spacing.sm, fontWeight: '600' },
  cards: { gap: tokens.spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: tokens.spacing.xl, gap: tokens.spacing.sm },
  emptyTitle: { textAlign: 'center' },
  emptyDesc: { textAlign: 'center', color: tokens.colors.textSecondary },
  footer: { paddingHorizontal: tokens.spacing.md, paddingTop: tokens.spacing.sm, paddingBottom: tokens.spacing.md, borderTopWidth: 1, borderTopColor: tokens.colors.border, backgroundColor: tokens.colors.background },
});

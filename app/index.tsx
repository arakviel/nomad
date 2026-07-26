import { ScrollView, StyleSheet, View } from 'react-native';
import { mockTrips, TripCard, type Trip } from '@/features/trips';
import { tokens } from '@/shared/theme';
import { AppText, Button, Screen } from '@/shared/ui';
export default function HomeScreen() {
  const handleOpenTrip = (trip: Trip) => console.log('TODO', trip.id);
  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="title">Мандрівник</AppText>
          <AppText variant="caption" style={styles.caption}>Щоденник подорожей</AppText>
        </View>
        <AppText style={styles.sectionLabel}>Ваші поїздки</AppText>
        {mockTrips.map((trip) => <TripCard key={trip.id} trip={trip} onPress={handleOpenTrip} />)}
        <Button label="Нова поїздка" onPress={() => console.log('TODO')} style={styles.cta} />
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  scrollContent: { paddingHorizontal: tokens.spacing.md, paddingBottom: tokens.spacing.xl },
  header: { marginBottom: tokens.spacing.lg, marginTop: tokens.spacing.sm, gap: tokens.spacing.xs },
  caption: { marginTop: tokens.spacing.xs },
  sectionLabel: { marginBottom: tokens.spacing.sm, fontWeight: '600' },
  cta: { marginTop: tokens.spacing.sm },
});

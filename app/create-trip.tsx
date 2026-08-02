import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { CreateTripForm, useTrips } from '@/features/trips';
import { Screen } from '@/shared/ui';

/**
 * Екран створення поїздки — Stack-екран поза Tabs.
 * Заголовок і системна кнопка «назад» задаються в app/_layout.tsx (Stack.Screen options).
 */
export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();

  return (
    <Screen style={styles.screen}>
      <CreateTripForm
        onSubmitSuccess={(trip) => {
          addTrip(trip);
          router.back();
        }}
        onCancel={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
});

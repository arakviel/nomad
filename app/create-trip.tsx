import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { CreateTripForm, useTrips } from '@/features/trips';
import { useTheme } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';

/**
 * Екран створення поїздки.
 * Навігацію (Stack, back) детальніше розберемо в статті про Expo Router;
 * тут — мінімальний router.push / router.back.
 */
export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip } = useTrips();
  const { colors, spacing } = useTheme();

  return (
    <Screen style={styles.screen}>
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.md,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={() => router.back()}
          hitSlop={12}
        >
          <AppText color={colors.primary} style={styles.back}>
            ← Назад
          </AppText>
        </Pressable>
        <AppText variant="title" style={{ marginTop: spacing.sm }}>
          Нова поїздка
        </AppText>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Форма з валідацією · RHF + Zod
        </AppText>
      </View>

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
  header: {
    borderBottomWidth: 1,
  },
  back: {
    fontWeight: '600',
  },
});

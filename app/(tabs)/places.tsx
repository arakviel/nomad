import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { mockPlaces, PlaceChip, type Place } from '@/features/trips';
import { useTheme } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';

/**
 * Вкладка «Місця» — повний список місць (раніше лише горизонтальна стрічка на home).
 */
export default function PlacesScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const [places] = useState<Place[]>(mockPlaces);

  const handleOpenPlace = useCallback(
    (place: Place) => {
      router.push(`/trips/${place.tripId}`);
    },
    [router],
  );

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
        <AppText variant="title">Місця</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Усі збережені точки з mock-даних · {places.length}
        </AppText>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
        }}
        contentContainerStyle={{
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
          gap: spacing.sm,
        }}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <PlaceChip place={item} onPress={handleOpenPlace} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant="subtitle" style={styles.center}>
              Місць поки немає
            </AppText>
            <AppText variant="caption" color={colors.textSecondary} style={styles.center}>
              Вони з’являться разом із поїздками.
            </AppText>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
  cell: {
    flex: 1,
  },
  empty: {
    padding: 32,
    gap: 8,
  },
  center: {
    textAlign: 'center',
  },
});

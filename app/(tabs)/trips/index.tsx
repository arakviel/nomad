import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';

import {
  mockPlaces,
  PlaceChip,
  TripCard,
  useTrips,
  type Place,
  type Trip,
} from '@/features/trips';
import { useTheme, type ThemePreference } from '@/shared/theme';
import { AppText, Button, Screen } from '@/shared/ui';

const PREFS: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'Система' },
  { id: 'light', label: 'Світла' },
  { id: 'dark', label: 'Темна' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { trips, loading, refreshing, error, refetch } = useTrips();
  const { colors, spacing, preference, setPreference, scheme } = useTheme();
  const [places] = useState<Place[]>(mockPlaces);

  const handleOpenTrip = useCallback(
    (trip: Trip) => {
      router.push(`/trips/${trip.id}`);
    },
    [router],
  );

  const handleOpenPlace = useCallback(
    (place: Place) => {
      router.push(`/trips/${place.tripId}`);
    },
    [router],
  );

  const onRefresh = useCallback(() => {
    void refetch('refresh');
  }, [refetch]);

  const onRetry = useCallback(() => {
    void refetch(trips.length === 0 ? 'initial' : 'silent');
  }, [refetch, trips.length]);

  const renderTrip = useCallback(
    ({ item }: { item: Trip }) => (
      <TripCard trip={item} onPress={handleOpenTrip} />
    ),
    [handleOpenTrip],
  );

  const keyExtractor = useCallback((item: Trip) => item.id, []);

  const listHeader = (
    <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
      {error && trips.length > 0 ? (
        <View
          style={[
            styles.inlineError,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              padding: spacing.sm,
              gap: spacing.xs,
            },
          ]}
        >
          <AppText variant="caption" color={colors.textSecondary}>
            {error.userMessage}
          </AppText>
          <Pressable onPress={onRetry} accessibilityRole="button">
            <AppText variant="caption" color={colors.primary} style={styles.retryLink}>
              Повторити
            </AppText>
          </Pressable>
        </View>
      ) : null}

      {places.length > 0 ? (
        <View style={{ gap: spacing.sm }}>
          <AppText style={{ fontWeight: '600' }}>Останні місця</AppText>
          <FlatList
            horizontal
            data={places}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PlaceChip place={item} onPress={handleOpenPlace} />
            )}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: spacing.sm }} />}
            contentContainerStyle={{ paddingVertical: 2 }}
          />
        </View>
      ) : null}

      <AppText style={{ fontWeight: '600' }}>Ваші поїздки</AppText>
    </View>
  );

  const listEmpty = (
    <View
      style={[
        styles.empty,
        {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xl,
          gap: spacing.sm,
        },
      ]}
    >
      <AppText variant="subtitle" style={styles.emptyTitle}>
        Поки немає поїздок
      </AppText>
      <AppText
        variant="caption"
        color={colors.textSecondary}
        style={styles.emptyDesc}
      >
        Потягніть список униз, щоб оновити з API, або натисніть «Нова поїздка».
      </AppText>
    </View>
  );

  const showFullScreenError = Boolean(error) && trips.length === 0 && !loading;
  const showFullScreenLoading = loading && trips.length === 0;

  return (
    <Screen style={styles.screen}>
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.md,
            gap: spacing.xs,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <AppText variant="title">Мандрівник</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Щоденник подорожей · тема: {scheme === 'dark' ? 'темна' : 'світла'}
        </AppText>
        <AppText
          variant="caption"
          style={{
            marginTop: spacing.xs,
            color: colors.primary,
            fontWeight: '600',
          }}
        >
          {loading && trips.length === 0
            ? 'Завантаження з API…'
            : trips.length > 0
              ? `${trips.length} поїздок · ${places.length} місць`
              : 'Список порожній'}
        </AppText>

        <View style={[styles.themeRow, { gap: spacing.sm, marginTop: spacing.sm }]}>
          {PREFS.map((p) => {
            const active = preference === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPreference(p.id)}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Тема: ${p.label}`}
              >
                <AppText
                  variant="caption"
                  color={active ? colors.onPrimary : colors.text}
                  style={styles.themeChipText}
                >
                  {p.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.listWrap}>
        {showFullScreenLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={{ marginTop: spacing.md }}
            >
              Завантажуємо поїздки…
            </AppText>
          </View>
        ) : showFullScreenError ? (
          <View style={[styles.centerState, { paddingHorizontal: spacing.lg, gap: spacing.sm }]}>
            <AppText variant="subtitle" style={styles.emptyTitle}>
              Не вдалося завантажити
            </AppText>
            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={styles.emptyDesc}
            >
              {error?.userMessage}
            </AppText>
            <AppText
              variant="caption"
              color={colors.textSecondary}
              style={styles.emptyDesc}
            >
              Переконайтесь, що запущено mock API: npm run api
            </AppText>
            <Button label="Повторити" onPress={onRetry} style={{ marginTop: spacing.sm }} />
          </View>
        ) : (
          <FlashList
            data={trips}
            renderItem={renderTrip}
            keyExtractor={keyExtractor}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={listEmpty}
            contentContainerStyle={{
              paddingHorizontal: spacing.md,
              paddingTop: spacing.md,
              paddingBottom: spacing.md,
            }}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.md,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Button
          label="Нова поїздка"
          onPress={() => {
            router.push('/create-trip');
          }}
        />
      </View>
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
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeChipText: {
    fontWeight: '600',
  },
  listWrap: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDesc: {
    textAlign: 'center',
  },
  inlineError: {
    borderWidth: 1,
    borderRadius: 8,
  },
  retryLink: {
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
  },
});

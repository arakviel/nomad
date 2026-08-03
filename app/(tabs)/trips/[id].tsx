import { useCallback, useMemo } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

import {
  getPlacesForTrip,
  useTrips,
  type Place,
} from '@/features/trips';
import { useTheme } from '@/shared/theme';
import { AppText, Button, Screen } from '@/shared/ui';

/**
 * Деталі поїздки — вкладений Stack у вкладці «Поїздки».
 * Tab bar знизу лишається (на відміну від root-modal create-trip).
 */
export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripId = Array.isArray(id) ? id[0] : id;
  const { getTrip } = useTrips();
  const trip = tripId ? getTrip(tripId) : undefined;
  const places = useMemo(
    () => (tripId ? getPlacesForTrip(tripId) : []),
    [tripId],
  );
  const { colors, spacing, radius } = useTheme();
  const router = useRouter();

  const openCreateModal = useCallback(() => {
    router.push('/create-trip');
  }, [router]);

  const deepLink = tripId
    ? Linking.createURL(`/trips/${tripId}`)
    : Linking.createURL('/trips');

  const shareDeepLink = useCallback(async () => {
    try {
      await Linking.openURL(deepLink);
    } catch {
      Alert.alert('Deep link', deepLink);
    }
  }, [deepLink]);

  if (!trip) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Не знайдено' }} />
        <View style={[styles.center, { padding: spacing.lg }]}>
          <AppText variant="subtitle">Поїздку не знайдено</AppText>
          <AppText
            variant="caption"
            color={colors.textSecondary}
            style={{ marginTop: spacing.sm, textAlign: 'center' }}
          >
            Немає запису з id: {String(tripId)}. Можливо, список скинули
            pull-to-refresh.
          </AppText>
          <Button
            label="До списку"
            onPress={() => router.back()}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ title: trip.title }} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: trip.coverUri }}
          style={[styles.cover, { backgroundColor: colors.border }]}
          resizeMode="cover"
        />
        <View style={{ padding: spacing.md, gap: spacing.sm }}>
          <AppText variant="title">{trip.title}</AppText>
          <AppText variant="caption" color={colors.primary} style={styles.meta}>
            {trip.dateLabel} · {trip.region}
            {trip.plannedDays
              ? ` · ${trip.plannedDays} дн.`
              : ''}
          </AppText>

          <View style={[styles.badges, { gap: spacing.sm }]}>
            {trip.isPrivate ? (
              <AppText variant="caption" color={colors.textSecondary}>
                приватна
              </AppText>
            ) : null}
            {trip.hasItinerary ? (
              <AppText variant="caption" color={colors.primary}>
                є план маршруту
              </AppText>
            ) : null}
          </View>

          <AppText style={{ marginTop: spacing.sm, lineHeight: 24 }}>
            {trip.description}
          </AppText>

          <AppText
            style={{ fontWeight: '700', marginTop: spacing.md }}
          >
            Місця в цій поїздці
          </AppText>
          {places.length === 0 ? (
            <AppText variant="caption" color={colors.textSecondary}>
              Поки немає точок у mock-даних для цієї поїздки.
            </AppText>
          ) : (
            places.map((place) => (
              <PlaceRow key={place.id} place={place} />
            ))
          )}

          <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
            <AppText style={{ fontWeight: '700' }}>Deep link</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Посилання на цей екран (scheme з app.json + path). У Expo Go
              рядок може бути exp://…; у standalone — nomad://…
            </AppText>
            <AppText
              variant="caption"
              color={colors.primary}
              style={styles.linkMono}
            >
              {deepLink}
            </AppText>
            <Button
              label="Відкрити це посилання"
              variant="secondary"
              onPress={shareDeepLink}
            />

            <Button
              label="Нова поїздка (modal)"
              onPress={openCreateModal}
            />
            <AppText variant="caption" color={colors.textSecondary}>
              Modal create-trip на кореневому Stack — вкладки ховаються під
              модалкою.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function PlaceRow({ place }: { place: Place }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={[
        styles.place,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.sm,
        },
      ]}
    >
      <AppText style={{ fontWeight: '700' }}>{place.name}</AppText>
      <AppText variant="caption" color={colors.primary}>
        {place.city}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        {place.note}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: '100%',
    height: 200,
  },
  meta: {
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkMono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  place: {
    borderWidth: 1,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
});

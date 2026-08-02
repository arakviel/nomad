import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import { useTheme, type ThemePreference } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';

const PREFS: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'Система' },
  { id: 'light', label: 'Світла' },
  { id: 'dark', label: 'Темна' },
];

/**
 * Вкладка «Ще» — про застосунок, тема, посилання на створення поїздки (Link).
 */
export default function AboutScreen() {
  const { colors, spacing, preference, setPreference, scheme } = useTheme();

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="title">Мандрівник</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Навчальний щоденник подорожей курсу React Native (Nomad). Тема зараз:{' '}
          {scheme === 'dark' ? 'темна' : 'світла'}.
        </AppText>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              padding: spacing.md,
              gap: spacing.sm,
            },
          ]}
        >
          <AppText style={{ fontWeight: '700' }}>Тема оформлення</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Ті самі чіпи, що були на головному екрані — винесені також сюди, щоб
            налаштування жили на окремій вкладці.
          </AppText>
          <View style={[styles.themeRow, { gap: spacing.sm }]}>
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

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              padding: spacing.md,
              gap: spacing.sm,
            },
          ]}
        >
          <AppText style={{ fontWeight: '700' }}>Навігація (Expo Router)</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Нижні вкладки — група маршрутів (tabs). «Нова поїздка» відкривається
            поверх вкладок у Stack. Нижче — приклад компонента Link (як якір на
            вебі).
          </AppText>
          <Link href="/create-trip" asChild>
            <Pressable
              style={[
                styles.linkBtn,
                {
                  backgroundColor: colors.primary,
                  paddingVertical: spacing.sm + 4,
                  borderRadius: 12,
                },
              ]}
            >
              <AppText color={colors.onPrimary} style={{ fontWeight: '700' }}>
                Відкрити форму (Link)
              </AppText>
            </Pressable>
          </Link>
        </View>

        <AppText variant="caption" color={colors.textSecondary}>
          Репозиторій: github.com/arakviel/nomad
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
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
  linkBtn: {
    alignItems: 'center',
  },
});

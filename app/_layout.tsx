import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { OfflineBanner } from '@/components/OfflineBanner';
import { TripsProvider } from '@/features/trips';
import { ThemeProvider, useTheme } from '@/shared/theme';

/**
 * Кореневий Stack:
 * - (tabs) — вкладки (всередині «Поїздки» ще один Stack)
 * - create-trip — modal поверх усього (вкладки ховаються)
 *
 * OfflineBanner — глобально над навігацією (стаття 14 / NetInfo).
 * initialRouteName: щоб deep link / reload на modal мав куди «спертись».
 */
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootNavigator() {
  const { colors, scheme } = useTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <OfflineBanner />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-trip"
          options={{
            headerShown: true,
            title: 'Нова поїздка',
            presentation: 'modal',
            headerBackTitle: 'Закрити',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TripsProvider>
        <RootNavigator />
      </TripsProvider>
    </ThemeProvider>
  );
}

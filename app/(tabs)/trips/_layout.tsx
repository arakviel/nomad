import { Stack } from 'expo-router';

import { useTheme } from '@/shared/theme';

/**
 * Вкладений Stack усередині вкладки «Поїздки».
 * Список (index) → деталі ([id]); tab bar лишається видимим.
 */
export default function TripsStackLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Поїздка',
          headerBackTitle: 'Список',
        }}
      />
    </Stack>
  );
}

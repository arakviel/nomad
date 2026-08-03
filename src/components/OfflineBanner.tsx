import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { AppText } from '@/shared/ui';

/**
 * Глобальна плашка «немає мережі».
 * Рендериться в root layout; не показується, коли isOffline === false.
 */
export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (!isOffline) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          paddingTop: Math.max(insets.top, 8),
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <AppText color="#FFFFFF" style={styles.text}>
        Немає підключення до інтернету. Робота в офлайн-режимі.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#D32F2F',
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

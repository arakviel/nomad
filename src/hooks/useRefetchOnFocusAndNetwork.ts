import { useEffect, useRef } from 'react';
import type { AppStateStatus } from 'react-native';

import { useAppState } from './useAppState';
import { useNetworkStatus } from './useNetworkStatus';

/**
 * Авто-оновлення даних:
 * 1) background/inactive → active
 * 2) offline → online
 * Не викликає onRefetch, поки isOffline === true.
 */
export function useRefetchOnFocusAndNetwork(onRefetch: () => void): void {
  const appState = useAppState();
  const { isOffline } = useNetworkStatus();

  const prevAppStateRef = useRef<AppStateStatus>(appState);
  const prevOfflineRef = useRef<boolean>(isOffline);
  const onRefetchRef = useRef(onRefetch);
  onRefetchRef.current = onRefetch;

  useEffect(() => {
    const isReturningToActive =
      !!prevAppStateRef.current.match(/inactive|background/) &&
      appState === 'active';

    const isReconnectingToNetwork =
      prevOfflineRef.current === true && isOffline === false;

    if ((isReturningToActive || isReconnectingToNetwork) && !isOffline) {
      onRefetchRef.current();
    }

    prevAppStateRef.current = appState;
    prevOfflineRef.current = isOffline;
  }, [appState, isOffline]);
}

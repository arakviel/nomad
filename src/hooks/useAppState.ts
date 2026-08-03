import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/** Поточний стан життєвого циклу: active | inactive | background. */
export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        setAppState(nextAppState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
}

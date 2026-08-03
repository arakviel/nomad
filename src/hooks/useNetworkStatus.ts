import { useEffect, useState } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean;
  /** true, якщо немає інтерфейсу АБО інтернет недосяжний. */
  isOffline: boolean;
  type: string;
};

const initialStatus: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
  isOffline: false,
  type: 'unknown',
};

/**
 * Підписка на NetInfo: isConnected ≠ isInternetReachable.
 * Для «справді офлайн» орієнтуємось на обидва прапорці.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(initialStatus);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      // null під час першої перевірки — не вважаємо офлайном, щоб не блимати банером
      const isInternetReachable = state.isInternetReachable !== false;
      const isOffline = !isConnected || state.isInternetReachable === false;

      setStatus({
        isConnected,
        isInternetReachable,
        isOffline,
        type: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return status;
}

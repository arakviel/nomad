import { Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';

/**
 * baseURL для json-server залежить від того, де крутиться застосунок:
 * - Android Emulator → 10.0.2.2 (псевдонім host-машини)
 * - фізичний пристрій (Expo Go) → IP з hostUri Metro
 * - iOS Simulator → localhost
 */
const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':').shift();
    if (ip) {
      return `http://${ip}:3000`;
    }
  }

  return 'http://localhost:3000';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

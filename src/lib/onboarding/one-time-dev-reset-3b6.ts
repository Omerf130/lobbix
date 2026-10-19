import AsyncStorage from '@react-native-async-storage/async-storage';

import { LOCAL_PROFILE_STORAGE_KEY } from '@/lib/profile/profile-storage';

/** Marker: one-time LOBBIX local mock reset for checkpoint 3B.6 (dev only). */
export const ONE_TIME_RESET_3B6_MARKER_KEY = '@lobbix/dev/one-time-reset-3b6/v1';

/**
 * Clears only LOBBIX mock profile/onboarding data once per install (dev builds).
 * Does not call AsyncStorage.clear(). After the marker is set, never runs again.
 */
export async function runOneTimeDevReset3B6IfNeeded(): Promise<boolean> {
  if (!__DEV__) return false;

  const marker = await AsyncStorage.getItem(ONE_TIME_RESET_3B6_MARKER_KEY);
  if (marker === 'done') return false;

  await AsyncStorage.removeItem(LOCAL_PROFILE_STORAGE_KEY);
  await AsyncStorage.setItem(ONE_TIME_RESET_3B6_MARKER_KEY, 'done');
  return true;
}

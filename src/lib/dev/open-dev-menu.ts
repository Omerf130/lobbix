import { router, type Href } from 'expo-router';

const DEV_MENU_HREF = '/dev' as Href;

/** Navigate to LOBBIX internal dev tools (no-op outside __DEV__). */
export function openDevMenu(): void {
  if (!__DEV__) return;
  router.push(DEV_MENU_HREF);
}

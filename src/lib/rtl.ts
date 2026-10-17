import { I18nManager } from 'react-native';

/**
 * Hebrew-first LOBBIX: enable RTL globally.
 * On first native launch, Expo Go may require one app reload after forceRTL.
 */
export function configureRtl(): void {
  I18nManager.allowRTL(true);
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  }
}

configureRtl();

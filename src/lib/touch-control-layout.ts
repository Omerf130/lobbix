import { I18nManager, type ViewStyle } from 'react-native';

/**
 * Portrait touch layout — physical screen edges.
 *
 * With `I18nManager.forceRTL(true)` and `doLeftAndRightSwapInRTL` (Android default),
 * React Native **swaps** `left` and `right`:
 * - `left`  = inset from the **physical right**
 * - `right` = inset from the **physical left**
 *
 * A large numeric `left` (e.g. width - controlWidth - margin) therefore insets from
 * the physical right by ~300px → control sits on the **physical left** (the observed bug).
 */
export const CAMERA_ZONE_WIDTH_FRACTION = 0.58;

export function physicalCameraZoneWidth(screenWidth: number): number {
  return screenWidth * CAMERA_ZONE_WIDTH_FRACTION;
}

export const PHYSICAL_LTR_OVERLAY: ViewStyle = {
  direction: 'ltr',
};

/**
 * Physical bottom-right joystick inside a full-width lane.
 * Uses swapped left/right semantics in RTL (small `left`, not width-based `left`).
 */
export function physicalBottomRightJoystickStyle(
  margin: number,
  bottom: number,
  controlWidth: number,
): ViewStyle {
  const base: ViewStyle = {
    position: 'absolute',
    bottom,
    width: controlWidth,
  };

  if (I18nManager.isRTL) {
    return { ...base, left: margin };
  }

  return { ...base, right: margin };
}

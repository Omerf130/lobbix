import { I18nManager, StyleSheet, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

/**
 * Portrait touch layout — physical screen edges.
 *
 * With `I18nManager.forceRTL(true)` and `doLeftAndRightSwapInRTL` (Android default),
 * React Native **swaps** `left` and `right`:
 * - `left`  = inset from the **physical right**
 * - `right` = inset from the **physical left**
 *
 * Pin both `left` and `right` on overlays with `direction: 'ltr'` so width is unambiguous.
 */
export const CAMERA_ZONE_WIDTH_FRACTION = 0.58;

export const PHYSICAL_LTR_OVERLAY: ViewStyle = {
  direction: 'ltr',
};

export function physicalCameraZoneWidth(screenWidth: number): number {
  return screenWidth * CAMERA_ZONE_WIDTH_FRACTION;
}

/** Default virtual joystick outer diameter (matches VirtualJoystick). */
export const MOVEMENT_JOYSTICK_OUTER_SIZE = 128;

/**
 * Camera pan hit region: physical-left/center column, excluding the bottom-right joystick square.
 */
export function physicalCameraPaneStyle(
  screenWidth: number,
  margin: number,
  bottomInset: number,
  joystickOuterSize: number,
): ViewStyle {
  const joyReserve = joystickOuterSize + margin * 2;
  const pinnedWidth = Math.max(screenWidth - joyReserve, screenWidth * 0.42);

  return {
    ...PHYSICAL_LTR_OVERLAY,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: margin,
    width: Math.min(physicalCameraZoneWidth(screenWidth), pinnedWidth),
  };
}

/**
 * Physical bottom-right joystick.
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
    ...PHYSICAL_LTR_OVERLAY,
  };

  if (I18nManager.isRTL) {
    return { ...base, left: margin };
  }

  return { ...base, right: margin };
}

/**
 * Joystick host fills the screen with `box-none` so only the bottom-right base
 * receives touches. Child `bottom`/`right` (or RTL `left`) are relative to this
 * frame — a zero-size host (3B.5D.3 regression) pinned the stick to the top.
 */
export function physicalJoystickHostStyle(): ViewStyle {
  return {
    ...StyleSheet.absoluteFill,
    ...PHYSICAL_LTR_OVERLAY,
    zIndex: 20,
    elevation: 20,
  };
}

/** Margin used by movement touch controls (kept in sync with joystick placement). */
export const MOVEMENT_TOUCH_MARGIN = Spacing.md;

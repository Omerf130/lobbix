/**
 * Camera orbit sensitivity — single source of truth for dev movement screens.
 *
 * Yaw: horizontal drag across full screen width → this many radians total.
 * Pitch: vertical drag across full screen height → this many radians total.
 */

/** Previous yaw constant (3B.5D.2 and earlier). */
export const CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH_LEGACY = 2.2;

/** ~30% higher horizontal sensitivity (3B.5D.3). */
export const CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH = 2.86;

/** Total pitch change (radians) when dragging one full screen height — portrait. */
export const CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT = 1.35;

export const CAMERA_MIN_PITCH = 0.15;
export const CAMERA_MAX_PITCH = 1.1;

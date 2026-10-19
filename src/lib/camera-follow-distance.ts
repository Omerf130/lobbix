/** Third-person orbit radius (meters) — ChibiMovementRig. */
export const CAMERA_FOLLOW_DISTANCE_DEFAULT = 5.8;
export const CAMERA_FOLLOW_DISTANCE_MIN = 3.5;
export const CAMERA_FOLLOW_DISTANCE_MAX = 8;

export function clampCameraFollowDistance(distance: number): number {
  return Math.min(
    CAMERA_FOLLOW_DISTANCE_MAX,
    Math.max(CAMERA_FOLLOW_DISTANCE_MIN, distance),
  );
}

/**
 * Pinch scale from RNGH: >1 spread (closer cam), <1 pinch in (farther cam).
 * @param startDistance distance at pinch gesture start
 * @param scale cumulative scale since gesture start (starts ~1)
 */
export function cameraFollowDistanceFromPinchScale(
  startDistance: number,
  scale: number,
): number {
  const safeScale = Math.max(scale, 0.05);
  return clampCameraFollowDistance(startDistance / safeScale);
}

import {
  CAMERA_MAX_PITCH,
  CAMERA_MIN_PITCH,
  CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT,
  CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH,
} from '@/lib/camera-touch-sensitivity';

export type CameraOrbitDragResult = {
  cameraYaw: number;
  cameraPitch: number;
};

/** Apply one pan update (change since last event) to orbit yaw/pitch. */
export function cameraOrbitFromPanDelta(
  cameraYaw: number,
  cameraPitch: number,
  changeX: number,
  changeY: number,
  viewportWidth: number,
  viewportHeight: number,
): CameraOrbitDragResult {
  if (changeX === 0 && changeY === 0) {
    return { cameraYaw, cameraPitch };
  }

  const width = Math.max(viewportWidth, 1);
  const height = Math.max(viewportHeight, 1);

  const nextYaw = cameraYaw - (changeX / width) * CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH;
  const nextPitch = Math.min(
    CAMERA_MAX_PITCH,
    Math.max(
      CAMERA_MIN_PITCH,
      cameraPitch + (changeY / height) * CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT,
    ),
  );

  return { cameraYaw: nextYaw, cameraPitch: nextPitch };
}

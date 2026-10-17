/** Mutable movement input shared between RN overlays and the R3F scene (no per-frame React state). */
export type MovementControlState = {
  /** Joystick horizontal axis, -1..1 */
  moveX: number;
  /** Joystick vertical axis, -1 forward .. 1 backward */
  moveY: number;
  /** Orbit yaw around character (radians) */
  cameraYaw: number;
  /** Orbit pitch (radians, clamped in scene) */
  cameraPitch: number;
};

export function createMovementControlState(): MovementControlState {
  return {
    moveX: 0,
    moveY: 0,
    cameraYaw: 0,
    cameraPitch: 0.35,
  };
}

export function resetMovementControlState(state: MovementControlState): void {
  state.moveX = 0;
  state.moveY = 0;
  state.cameraYaw = 0;
  state.cameraPitch = 0.35;
}

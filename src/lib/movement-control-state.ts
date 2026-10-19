import { CAMERA_FOLLOW_DISTANCE_DEFAULT } from '@/lib/camera-follow-distance';

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
  /** Orbit radius (meters) — pinch-to-zoom on mobile */
  cameraDistance: number;
};

/** Dev movement test — yaw 0 places camera on −Z; verified on Android (3B.5D). */
export function createMovementControlState(): MovementControlState {
  return {
    moveX: 0,
    moveY: 0,
    cameraYaw: 0,
    cameraPitch: 0.35,
    cameraDistance: CAMERA_FOLLOW_DISTANCE_DEFAULT,
  };
}

export function resetMovementControlState(state: MovementControlState): void {
  state.moveX = 0;
  state.moveY = 0;
  state.cameraYaw = 0;
  state.cameraPitch = 0.35;
  state.cameraDistance = CAMERA_FOLLOW_DISTANCE_DEFAULT;
}

/**
 * Personal lobby — camera on +Z side of spawn so the view looks toward GAME CLUB (−Z).
 * Orbit math unchanged; only initial/rest yaw differs from dev test.
 */
export const PERSONAL_LOBBY_INITIAL_CAMERA_YAW = Math.PI;

export function createPersonalLobbyMovementControlState(): MovementControlState {
  const state = createMovementControlState();
  state.cameraYaw = PERSONAL_LOBBY_INITIAL_CAMERA_YAW;
  return state;
}

export function resetPersonalLobbyMovementControlState(state: MovementControlState): void {
  resetMovementControlState(state);
  state.cameraYaw = PERSONAL_LOBBY_INITIAL_CAMERA_YAW;
}

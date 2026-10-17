'use no memo';

/**
 * @deprecated Joystick is rendered by {@link MovementTouchControls} for simultaneous camera + move.
 * This export is a no-op placeholder so legacy imports fail visibly in layout (zero size).
 */
import type { MovementControlState } from '@/lib/movement-control-state';

type VirtualJoystickProps = {
  controls: MovementControlState;
};

export function VirtualJoystick(_props: VirtualJoystickProps) {
  return null;
}

/** Dev-only scene layer toggles for isolating GL / touch issues on `/dev/chibi-movement-test`. */
export type ChibiMovementRenderFlags = {
  showCharacter: boolean;
  showGround: boolean;
  showGrid: boolean;
  showObstacles: boolean;
  showArenaRing: boolean;
  /** When false, skip MovementTouchControls (isolate touch vs scene crashes). */
  enableTouchControls: boolean;
};

export const DEFAULT_CHIBI_MOVEMENT_RENDER_FLAGS: ChibiMovementRenderFlags = {
  showCharacter: true,
  showGround: true,
  showGrid: true,
  showObstacles: true,
  showArenaRing: true,
  enableTouchControls: true,
};

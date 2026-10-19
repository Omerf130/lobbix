/** Per-frame camera + focus for lobby boundary occlusion (written by ChibiMovementRig). */
export type LobbySceneFrameSnapshot = {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  focusX: number;
  focusY: number;
  focusZ: number;
};

export const lobbySceneFrameSnapshot: LobbySceneFrameSnapshot = {
  cameraX: 0,
  cameraY: 3,
  cameraZ: 7,
  focusX: 0,
  focusY: 1,
  focusZ: 0,
};

export function writeLobbySceneFrameSnapshot(
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  focusX: number,
  focusY: number,
  focusZ: number,
): void {
  lobbySceneFrameSnapshot.cameraX = cameraX;
  lobbySceneFrameSnapshot.cameraY = cameraY;
  lobbySceneFrameSnapshot.cameraZ = cameraZ;
  lobbySceneFrameSnapshot.focusX = focusX;
  lobbySceneFrameSnapshot.focusY = focusY;
  lobbySceneFrameSnapshot.focusZ = focusZ;
}

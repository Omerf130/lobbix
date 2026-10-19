/** Axis-aligned block collision (world XZ center + size). */
export type LobbyObstacle = {
  readonly x: number;
  readonly z: number;
  readonly sx: number;
  readonly sz: number;
};

export type LobbyArenaConfig = {
  readonly halfExtentX: number;
  readonly halfExtentZ: number;
  readonly spawnX: number;
  readonly spawnZ: number;
  readonly obstacles: readonly LobbyObstacle[];
};

/** Dev movement test arena (unchanged from 3B.5D). */
export const DEV_CHIBI_MOVEMENT_ARENA: LobbyArenaConfig = {
  halfExtentX: 11,
  halfExtentZ: 11,
  spawnX: 0,
  spawnZ: 0,
  obstacles: [
    { x: -4, z: -3, sx: 1.2, sz: 1.2 },
    { x: 3, z: -5, sx: 1.6, sz: 0.9 },
    { x: -2, z: 4, sx: 0.9, sz: 1.4 },
    { x: 5, z: 3, sx: 1.1, sz: 1.1 },
  ],
};

/** Personal lobby club layout (4B.1) — see {@link PERSONAL_LOBBY_CLUB_LAYOUT}. */
export { PERSONAL_LOBBY_ARENA } from '@/lib/lobby/lobby-club-layout';

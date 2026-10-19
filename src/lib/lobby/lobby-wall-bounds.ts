import type { LobbyArenaConfig } from '@/lib/lobby/lobby-arena';
import { PERSONAL_LOBBY_CLUB_LAYOUT } from '@/lib/lobby/lobby-club-layout';

export type LobbyWallAabb = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

export type LobbyBoundaryWallBoxes = {
  left: LobbyWallAabb;
  right: LobbyWallAabb;
  far: LobbyWallAabb;
};

type LayoutLike = typeof PERSONAL_LOBBY_CLUB_LAYOUT;

/** Axis-aligned bounds for the three boundary shells (matches lobby-club-environment meshes). */
export function getLobbyBoundaryWallBoxes(
  arena: LobbyArenaConfig,
  layout: LayoutLike,
): LobbyBoundaryWallBoxes {
  const wallT = layout.wallThickness;
  const wallH = layout.wallHeight;
  const hx = arena.halfExtentX + wallT / 2;
  const floorD = arena.halfExtentZ * 2 + 1.4;
  const floorW = arena.halfExtentX * 2 + 1.4;
  const halfD = floorD / 2;
  const halfW = floorW / 2;
  const farZ = layout.farWallZ;

  return {
    left: {
      minX: -hx - wallT / 2,
      maxX: -hx + wallT / 2,
      minY: 0,
      maxY: wallH,
      minZ: -halfD,
      maxZ: halfD,
    },
    right: {
      minX: hx - wallT / 2,
      maxX: hx + wallT / 2,
      minY: 0,
      maxY: wallH,
      minZ: -halfD,
      maxZ: halfD,
    },
    far: {
      minX: -halfW,
      maxX: halfW,
      minY: 0,
      maxY: wallH,
      minZ: farZ - wallT / 2,
      maxZ: farZ + wallT / 2,
    },
  };
}

import type { LobbyArenaConfig, LobbyObstacle } from '@/lib/lobby/lobby-arena';

/** Clear central walkway half-width (|x| below this between lounge and station). */
export const LOBBY_CORRIDOR_HALF_WIDTH = 1.85;

export type GameEntranceTheme = {
  readonly id: 'valorant' | 'cs2' | 'fortnite';
  readonly label: string;
  readonly x: number;
  readonly z: number;
  readonly accent: string;
  readonly accentDim: string;
  readonly glow: string;
};

/** Three portals on the forward (−Z) wall — 4B.3E vision layout. */
export const LOBBY_PORTAL_ROW_Z = -3.42;

export const LOBBY_GAME_ENTRANCES: readonly GameEntranceTheme[] = [
  {
    id: 'valorant',
    label: 'VALORANT',
    x: -3.12,
    z: LOBBY_PORTAL_ROW_Z,
    accent: '#FF5A78',
    accentDim: '#8B2E48',
    glow: '#FF8AA8',
  },
  {
    id: 'cs2',
    label: 'CS2',
    x: 0,
    z: LOBBY_PORTAL_ROW_Z,
    accent: '#FFB347',
    accentDim: '#8B5A18',
    glow: '#FFD080',
  },
  {
    id: 'fortnite',
    label: 'FORTNITE',
    x: 3.12,
    z: LOBBY_PORTAL_ROW_Z,
    accent: '#00D4FF',
    accentDim: '#0E6E8C',
    glow: '#5CE1FF',
  },
] as const;

const hx = 6.15;
/** Compact wide club — not a deep corridor (4B.3E). */
const hz = 4.65;

export const LOBBY_MESHY_PORTAL_FIT = { sx: 1.68, sz: 0.52, maxHeight: 2.22 } as const;

/** Walkable half-width inside each portal frame (world X). */
export const LOBBY_PORTAL_PASSAGE_HALF_WIDTH = 0.52;

export function lobbyPortalSideFrameObstacles(
  portalX: number,
  portalZ: number,
): readonly LobbyObstacle[] {
  const lip = LOBBY_PORTAL_PASSAGE_HALF_WIDTH + 0.22;
  return [
    { x: portalX - lip, z: portalZ, sx: 0.34, sz: 0.48 },
    { x: portalX + lip, z: portalZ, sx: 0.34, sz: 0.48 },
  ];
}

export const LOBBY_GAMING_STATION_FOOTPRINT = { sx: 1.52, sz: 1.02 } as const;
export const LOBBY_GAMING_STATION_PLACEMENT = {
  x: 4.28,
  z: 0.35,
  rotationY: Math.PI / 2,
} as const;

/** Lounge GLB is very flat in Y (~0.17 m native) — minHeight fixes “tiny table” read. */
export const LOBBY_GAMING_LOUNGE_FOOTPRINT = { sx: 2.35, sz: 1.32, minHeight: 0.5 } as const;
export const LOBBY_GAMING_LOUNGE_PLACEMENT = {
  x: -4.28,
  z: 0.35,
  rotationY: Math.PI / 2,
} as const;

const portalFrames = LOBBY_GAME_ENTRANCES.flatMap((e) =>
  lobbyPortalSideFrameObstacles(e.x, e.z),
);

export const LOBBY_CLUB_OBSTACLES: readonly LobbyObstacle[] = [
  {
    x: LOBBY_GAMING_LOUNGE_PLACEMENT.x,
    z: LOBBY_GAMING_LOUNGE_PLACEMENT.z,
    sx: LOBBY_GAMING_LOUNGE_FOOTPRINT.sx,
    sz: LOBBY_GAMING_LOUNGE_FOOTPRINT.sz,
  },
  {
    x: LOBBY_GAMING_STATION_PLACEMENT.x,
    z: LOBBY_GAMING_STATION_PLACEMENT.z,
    sx: LOBBY_GAMING_STATION_FOOTPRINT.sx,
    sz: LOBBY_GAMING_STATION_FOOTPRINT.sz,
  },
  { x: -5.55, z: -1.85, sx: 0.42, sz: 0.42 },
  { x: 5.55, z: -1.85, sx: 0.42, sz: 0.42 },
  ...portalFrames,
];

export const PERSONAL_LOBBY_CLUB_LAYOUT = {
  halfExtentX: hx,
  halfExtentZ: hz,
  spawnX: 0,
  /** Forward in the club — first frame shows portals + sign + flanking props. */
  spawnZ: 3.05,
  wallHeight: 3.55,
  wallThickness: 0.32,
  corridorHalfWidth: LOBBY_CORRIDOR_HALF_WIDTH,
  /** Centered above CS2 portal row (GAME CLUB neon). */
  signZ: -2.72,
  farWallZ: -hz + 0.58,
} as const;

export const PERSONAL_LOBBY_ARENA: LobbyArenaConfig = {
  halfExtentX: PERSONAL_LOBBY_CLUB_LAYOUT.halfExtentX,
  halfExtentZ: PERSONAL_LOBBY_CLUB_LAYOUT.halfExtentZ,
  spawnX: PERSONAL_LOBBY_CLUB_LAYOUT.spawnX,
  spawnZ: PERSONAL_LOBBY_CLUB_LAYOUT.spawnZ,
  obstacles: LOBBY_CLUB_OBSTACLES,
};

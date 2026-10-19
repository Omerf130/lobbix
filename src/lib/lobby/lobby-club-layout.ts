import type { LobbyArenaConfig, LobbyObstacle } from '@/lib/lobby/lobby-arena';

/** Walkable corridor half-width (keep |x| below this for clear path). */
export const LOBBY_CORRIDOR_HALF_WIDTH = 2.35;

export type GameEntranceTheme = {
  readonly id: 'valorant' | 'cs2' | 'fortnite';
  readonly label: string;
  readonly side: 'left' | 'right';
  readonly z: number;
  readonly accent: string;
  readonly accentDim: string;
  readonly glow: string;
};

/** Clustered alcoves visible from default spawn (visual only). */
export const LOBBY_GAME_ENTRANCES: readonly GameEntranceTheme[] = [
  {
    id: 'valorant',
    label: 'VALORANT',
    side: 'left',
    z: 2.4,
    accent: '#FF6B5A',
    accentDim: '#8B3D34',
    glow: '#FF8A7A',
  },
  {
    id: 'cs2',
    label: 'CS2',
    side: 'right',
    z: 0.9,
    accent: '#00C2FF',
    accentDim: '#0E6E8C',
    glow: '#5CE1FF',
  },
  {
    id: 'fortnite',
    label: 'FORTNITE',
    side: 'left',
    z: -0.9,
    accent: '#B47CFF',
    accentDim: '#6B3FA8',
    glow: '#E089F5',
  },
] as const;

const hx = 5.85;
/** Shortened club depth (4B.3B) — was 11.8. */
const hz = 7.5;

/** Meshy gaming station — chibi-scale desk (~4B.3D). */
export const LOBBY_GAMING_STATION_FOOTPRINT = { sx: 1.55, sz: 1.05 } as const;

/** Single sofa + table asset (right lounge nook). */
export const LOBBY_GAMING_LOUNGE_PLACEMENT = { x: 3.2, z: -3.05, rotationY: -Math.PI / 2 } as const;
export const LOBBY_GAMING_LOUNGE_FOOTPRINT = { sx: 1.9, sz: 1.08 } as const;

/** One Meshy portal (VALORANT alcove) — opening width × depth × max height. */
export const LOBBY_MESHY_PORTAL_FIT = { sx: 1.72, sz: 0.48, maxHeight: 2.18 } as const;

/** Side frames only — center passage stays walkable (4B.3D). */
export const LOBBY_VALORANT_PORTAL_FRAME_OBSTACLES: readonly LobbyObstacle[] = [
  { x: -5.55, z: 1.55, sx: 0.38, sz: 0.55 },
  { x: -5.55, z: 3.25, sx: 0.38, sz: 0.55 },
];

/** Props / furniture — synced with rendered meshes and collision. */
export const LOBBY_CLUB_OBSTACLES: readonly LobbyObstacle[] = [
  { x: -3.45, z: 4.0, sx: 1.1, sz: 0.72 },
  { x: 3.45, z: 3.5, sx: LOBBY_GAMING_STATION_FOOTPRINT.sx, sz: LOBBY_GAMING_STATION_FOOTPRINT.sz },
  { x: -3.55, z: 1.2, sx: 1.15, sz: 0.62 },
  { x: 3.55, z: 0.2, sx: 1.15, sz: 0.62 },
  {
    x: LOBBY_GAMING_LOUNGE_PLACEMENT.x,
    z: LOBBY_GAMING_LOUNGE_PLACEMENT.z,
    sx: LOBBY_GAMING_LOUNGE_FOOTPRINT.sx,
    sz: LOBBY_GAMING_LOUNGE_FOOTPRINT.sz,
  },
  { x: -4.25, z: 5.0, sx: 0.45, sz: 0.45 },
  /** Moved back from (4.25, 4.6) so Meshy station at (3.45, 3.5) stays visible. */
  { x: 4.2, z: 1.85, sx: 0.45, sz: 0.45 },
  ...LOBBY_VALORANT_PORTAL_FRAME_OBSTACLES,
];

export const PERSONAL_LOBBY_CLUB_LAYOUT = {
  halfExtentX: hx,
  halfExtentZ: hz,
  spawnX: 0,
  spawnZ: 5.2,
  wallHeight: 3.55,
  wallThickness: 0.32,
  corridorHalfWidth: LOBBY_CORRIDOR_HALF_WIDTH,
  /** GAME CLUB focal — closer for first-frame read (4B.3B). */
  signZ: -4.0,
  farWallZ: -hz + 0.55,
} as const;

export const PERSONAL_LOBBY_ARENA: LobbyArenaConfig = {
  halfExtentX: PERSONAL_LOBBY_CLUB_LAYOUT.halfExtentX,
  halfExtentZ: PERSONAL_LOBBY_CLUB_LAYOUT.halfExtentZ,
  spawnX: PERSONAL_LOBBY_CLUB_LAYOUT.spawnX,
  spawnZ: PERSONAL_LOBBY_CLUB_LAYOUT.spawnZ,
  obstacles: LOBBY_CLUB_OBSTACLES,
};

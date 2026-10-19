'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import { useMemo } from 'react';
import { LobbyBoundaryWalls } from '@/components/lobby/lobby-boundary-walls';
import { LobbyGameClubHub } from '@/components/lobby/lobby-game-club-hub';
import { LobbyGamingLounge } from '@/components/lobby/lobby-gaming-lounge';
import { LobbyGamingStation } from '@/components/lobby/lobby-gaming-station';
import { LobbyMeshyGamePortal } from '@/components/lobby/lobby-meshy-game-portal';
import { lobbyMat } from '@/components/lobby/lobby-shared-materials';
import { palette } from '@/constants/theme';
import type { LobbyArenaConfig } from '@/lib/lobby/lobby-arena';
import {
  LOBBY_CLUB_OBSTACLES,
  LOBBY_GAME_ENTRANCES,
  LOBBY_GAMING_LOUNGE_PLACEMENT,
  LOBBY_GAMING_STATION_PLACEMENT,
  LOBBY_PORTAL_ROW_Z,
  PERSONAL_LOBBY_CLUB_LAYOUT,
} from '@/lib/lobby/lobby-club-layout';

type LobbyClubEnvironmentProps = {
  arena: LobbyArenaConfig;
};

const FLOOR_TILE = 2.05;

function LobbyClubFloor({ halfX, halfZ }: { halfX: number; halfZ: number }) {
  const tiles = useMemo(() => {
    const out: { x: number; z: number; alt: boolean; key: string }[] = [];
    for (let x = -halfX; x < halfX - 0.01; x += FLOOR_TILE) {
      for (let z = -halfZ; z < halfZ - 0.01; z += FLOOR_TILE) {
        const xi = Math.round(x / FLOOR_TILE);
        const zi = Math.round(z / FLOOR_TILE);
        out.push({
          x: x + FLOOR_TILE / 2,
          z: z + FLOOR_TILE / 2,
          alt: (xi + zi) % 2 === 0,
          key: `${xi}-${zi}`,
        });
      }
    }
    return out;
  }, [halfX, halfZ]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[halfX * 2 + 0.6, halfZ * 2 + 0.6]} />
        <meshStandardMaterial
          color="#080c16"
          roughness={0.32}
          metalness={0.28}
          emissive="#060810"
          emissiveIntensity={0.05}
        />
      </mesh>

      {tiles.map((t) => (
        <mesh
          key={t.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[t.x, 0.003, t.z]}
          material={t.alt ? lobbyMat.floorA : lobbyMat.floorB}>
          <planeGeometry args={[FLOOR_TILE * 0.97, FLOOR_TILE * 0.97]} />
        </mesh>
      ))}
    </group>
  );
}

function LobbySpawnMedallion({ spawnZ }: { spawnZ: number }) {
  return (
    <group position={[0, 0.008, spawnZ - 0.35]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 1.05, 40]} />
        <meshBasicMaterial color={palette.turquoise} toneMapped={false} transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.48, 32]} />
        <meshBasicMaterial color={palette.pink} toneMapped={false} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function LobbySideWallPanels({ hx, halfZ }: { hx: number; halfZ: number }) {
  const panelZs = useMemo(() => {
    const zs: number[] = [];
    for (let z = -halfZ + 1.8; z < halfZ - 0.5; z += 2.8) zs.push(z);
    return zs;
  }, [halfZ]);

  return (
    <>
      {panelZs.map((z) => (
        <group key={`side-panels-${z}`}>
          {[-1, 1].map((side) => (
            <group key={`${side}-${z}`}>
              <mesh
                position={[side * (hx - 0.22), 1.45, z]}
                material={lobbyMat.wallPanel}
                rotation={[0, side < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
                <boxGeometry args={[2.2, 2.65, 0.08]} />
              </mesh>
              <mesh
                position={[side * (hx - 0.16), 1.45, z]}
                rotation={[0, side < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
                <boxGeometry args={[0.04, 2.4, 0.02]} />
                <meshBasicMaterial
                  color={side < 0 ? palette.turquoise : palette.pink}
                  toneMapped={false}
                  transparent
                  opacity={0.32}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </>
  );
}

function LobbyBackWallBand({
  halfX,
  farWallZ,
  wallH,
}: {
  halfX: number;
  farWallZ: number;
  wallH: number;
}) {
  const bandW = halfX * 2 + 0.4;
  return (
    <group position={[0, 0, farWallZ]}>
      <mesh position={[0, wallH * 0.48, 0.08]} material={lobbyMat.wallDeep}>
        <boxGeometry args={[bandW, wallH, 0.24]} />
      </mesh>
      {LOBBY_GAME_ENTRANCES.map((e) => (
        <mesh key={`portal-glow-${e.id}`} position={[e.x, 1.05, 0.18]}>
          <boxGeometry args={[1.55, 2.05, 0.04]} />
          <meshBasicMaterial color={e.glow} toneMapped={false} transparent opacity={0.12} />
        </mesh>
      ))}
      <mesh position={[0, wallH - 0.22, 0.14]}>
        <boxGeometry args={[bandW * 0.88, 0.14, 0.06]} />
        <meshBasicMaterial color={palette.purple} toneMapped={false} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function DecorativePlant({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.18, 0]} material={lobbyMat.plantPot}>
        <cylinderGeometry args={[0.18, 0.22, 0.36, 8]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={lobbyMat.plant}>
        <coneGeometry args={[0.32, 0.55, 8]} />
      </mesh>
    </group>
  );
}

export function LobbyClubEnvironment({ arena }: LobbyClubEnvironmentProps) {
  const layout = PERSONAL_LOBBY_CLUB_LAYOUT;
  const floorW = arena.halfExtentX * 2 + 1.4;
  const floorD = arena.halfExtentZ * 2 + 1.4;
  const wallH = layout.wallHeight;
  const wallT = layout.wallThickness;
  const hx = arena.halfExtentX + wallT / 2;

  const plantPositions = useMemo(
    () =>
      LOBBY_CLUB_OBSTACLES.filter((o) => o.sx <= 0.5 && o.sz <= 0.5).map((o) => ({
        x: o.x,
        z: o.z,
        key: `${o.x}-${o.z}`,
      })),
    [],
  );

  return (
    <>
      <color attach="background" args={['#0B1020']} />

      <hemisphereLight args={['#8A9EC8', '#1E1438', 0.78]} />
      <ambientLight intensity={0.52} color="#E8ECFA" />
      <directionalLight position={[2, 10, 5]} intensity={0.95} color="#FFF8F0" />
      <directionalLight position={[-3, 7, -1]} intensity={0.45} color={palette.purple} />

      <LobbyClubFloor halfX={arena.halfExtentX} halfZ={arena.halfExtentZ} />
      <LobbySpawnMedallion spawnZ={arena.spawnZ} />

      <LobbyBoundaryWalls
        arena={arena}
        hx={hx}
        halfZ={arena.halfExtentZ}
        wallH={wallH}
        wallT={wallT}
        floorD={floorD}
        floorW={floorW}
      />

      <LobbySideWallPanels hx={hx} halfZ={arena.halfExtentZ} />

      <LobbyBackWallBand
        halfX={arena.halfExtentX}
        farWallZ={layout.farWallZ}
        wallH={wallH}
      />

      {LOBBY_GAME_ENTRANCES.map((entrance) => (
        <LobbyMeshyGamePortal key={entrance.id} entrance={entrance} />
      ))}

      <LobbyGameClubHub signZ={layout.signZ} />

      <LobbyGamingLounge
        x={LOBBY_GAMING_LOUNGE_PLACEMENT.x}
        z={LOBBY_GAMING_LOUNGE_PLACEMENT.z}
        rotationY={LOBBY_GAMING_LOUNGE_PLACEMENT.rotationY}
      />
      <LobbyGamingStation
        x={LOBBY_GAMING_STATION_PLACEMENT.x}
        z={LOBBY_GAMING_STATION_PLACEMENT.z}
        rotationY={LOBBY_GAMING_STATION_PLACEMENT.rotationY}
      />

      {plantPositions.map((p) => (
        <DecorativePlant key={p.key} x={p.x} z={p.z} />
      ))}

      <pointLight position={[0, 2.8, arena.spawnZ - 0.6]} intensity={0.55} color="#FFF4E8" distance={10} />
      <pointLight position={[0, 2.6, layout.signZ + 0.5]} intensity={0.5} color={palette.turquoise} distance={8} />
      <pointLight
        position={[LOBBY_GAMING_LOUNGE_PLACEMENT.x + 0.5, 2.2, LOBBY_GAMING_LOUNGE_PLACEMENT.z]}
        intensity={0.38}
        color="#C8A8FF"
        distance={5.5}
      />
      <pointLight
        position={[LOBBY_GAMING_STATION_PLACEMENT.x - 0.5, 2.2, LOBBY_GAMING_STATION_PLACEMENT.z]}
        intensity={0.42}
        color={palette.turquoise}
        distance={5.5}
      />
      <pointLight position={[0, 2.2, LOBBY_PORTAL_ROW_Z + 0.8]} intensity={0.35} color={palette.purple} distance={7} />
    </>
  );
}

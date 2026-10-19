'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import { useMemo } from 'react';
import { LobbyBoundaryWalls } from '@/components/lobby/lobby-boundary-walls';
import { LobbyGameClubHub } from '@/components/lobby/lobby-game-club-hub';
import { LobbyGameEntrance } from '@/components/lobby/lobby-game-entrance';
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
  PERSONAL_LOBBY_CLUB_LAYOUT,
} from '@/lib/lobby/lobby-club-layout';

type LobbyClubEnvironmentProps = {
  arena: LobbyArenaConfig;
};

const FLOOR_TILE = 2.5;

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
          color="#0a0e18"
          roughness={0.55}
          metalness={0.12}
          emissive="#060810"
          emissiveIntensity={0.04}
        />
      </mesh>

      {tiles.map((t) => (
        <mesh
          key={t.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[t.x, 0.003, t.z]}
          material={t.alt ? lobbyMat.floorA : lobbyMat.floorB}>
          <planeGeometry args={[FLOOR_TILE * 0.98, FLOOR_TILE * 0.98]} />
        </mesh>
      ))}

    </group>
  );
}

function GamingKiosk({ x, z, glow }: { x: number; z: number; glow: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.42, 0]} material={lobbyMat.desk}>
        <boxGeometry args={[1.1, 0.84, 0.62]} />
      </mesh>
      <mesh position={[0, 0.92, -0.08]} material={lobbyMat.monitor}>
        <boxGeometry args={[0.72, 0.48, 0.06]} />
      </mesh>
      <mesh position={[0, 0.92, -0.12]}>
        <boxGeometry args={[0.62, 0.38, 0.02]} />
        <meshBasicMaterial color={glow} toneMapped={false} transparent opacity={0.65} />
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
  const hz = arena.halfExtentZ + wallT / 2;
  const cw = layout.corridorHalfWidth;

  const beamZs = useMemo(() => {
    const zs: number[] = [];
    for (let z = -hz + 2; z < hz; z += 3.6) zs.push(z);
    return zs;
  }, [hz]);

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

      <hemisphereLight args={['#9AACD8', '#221840', 0.82]} />
      <ambientLight intensity={0.58} color="#F0F2FA" />
      <directionalLight position={[2, 11, 6]} intensity={1.05} color="#FFF8F0" />
      <directionalLight position={[-4, 8, -2]} intensity={0.52} color={palette.purple} />
      <directionalLight position={[0, 5, 4]} intensity={0.35} color={palette.turquoise} />

      <LobbyClubFloor halfX={arena.halfExtentX} halfZ={arena.halfExtentZ} />

      <LobbyBoundaryWalls
        arena={arena}
        hx={hx}
        halfZ={arena.halfExtentZ}
        wallH={wallH}
        wallT={wallT}
        floorD={floorD}
        floorW={floorW}
      />

      <LobbyGameClubHub signZ={layout.signZ} corridorHalfWidth={cw} />

      {beamZs.map((z) => (
        <group key={`beam-${z}`}>
          <mesh position={[0, wallH - 0.18, z]} material={lobbyMat.beam}>
            <boxGeometry args={[floorW * 0.86, 0.2, 0.34]} />
          </mesh>
          <mesh position={[-cw - 0.12, wallH - 0.3, z]}>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshBasicMaterial color={palette.turquoise} toneMapped={false} />
          </mesh>
          <mesh position={[cw + 0.12, wallH - 0.3, z]}>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshBasicMaterial color={palette.pink} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {LOBBY_GAME_ENTRANCES.map((entrance) =>
        entrance.id === 'valorant' ? (
          <LobbyMeshyGamePortal
            key={entrance.id}
            entrance={entrance}
            wallX={-hx}
          />
        ) : (
          <LobbyGameEntrance
            key={entrance.id}
            entrance={entrance}
            wallX={entrance.side === 'left' ? -hx : hx}
          />
        ),
      )}

      <GamingKiosk x={-3.45} z={4.0} glow="#5CE1FF" />
      <LobbyGamingStation x={3.45} z={3.5} rotationY={Math.PI} />
      <GamingKiosk x={-3.55} z={1.2} glow="#FF8A7A" />
      <GamingKiosk x={3.55} z={0.2} glow="#00C2FF" />

      <LobbyGamingLounge
        x={LOBBY_GAMING_LOUNGE_PLACEMENT.x}
        z={LOBBY_GAMING_LOUNGE_PLACEMENT.z}
        rotationY={LOBBY_GAMING_LOUNGE_PLACEMENT.rotationY}
      />

      {plantPositions.map((p) => (
        <DecorativePlant key={p.key} x={p.x} z={p.z} />
      ))}

      <pointLight position={[0, 2.9, arena.spawnZ - 1.2]} intensity={0.62} color="#FFF4E8" distance={12} />
      <pointLight position={[0, 2.5, layout.signZ + 1.2]} intensity={0.48} color={palette.turquoise} distance={9} />
      <pointLight position={[0, 2.4, 1.5]} intensity={0.42} color={palette.purple} distance={10} />
      <pointLight position={[-3.2, 2.3, 3.8]} intensity={0.4} color={palette.turquoise} distance={7} />
      <pointLight position={[3.2, 2.3, 3.5]} intensity={0.48} color="#C8B0FF" distance={7} />
      <pointLight
        position={[LOBBY_GAMING_LOUNGE_PLACEMENT.x - 0.4, 2.1, LOBBY_GAMING_LOUNGE_PLACEMENT.z]}
        intensity={0.38}
        color="#B8A0E8"
        distance={6}
      />
    </>
  );
}

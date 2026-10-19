'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useGLTF } from '@react-three/drei/native';
import { useMemo } from 'react';
import type { GLTF } from 'three-stdlib';

import { LobbyDotMatrixSign } from '@/components/lobby/lobby-dot-matrix-sign';
import { cloneAndFitFloorGlb } from '@/lib/lobby/fit-floor-glb-clone';
import { LOBBY_MESHY_PORTAL_FIT } from '@/lib/lobby/lobby-club-layout';
import type { GameEntranceTheme } from '@/lib/lobby/lobby-club-layout';
import { LOBBY_GAME_PORTAL_GLB, preloadLobbyGamePortalGlb } from '@/lib/lobby/game-portal-model';

type LobbyMeshyGamePortalProps = {
  entrance: GameEntranceTheme;
  wallX: number;
};

/**
 * Meshy portal frame for one alcove (4B.3D) — replaces procedural alcove meshes; keeps dot-matrix title.
 */
export function LobbyMeshyGamePortal({ entrance, wallX }: LobbyMeshyGamePortalProps) {
  const gltf = useGLTF(LOBBY_GAME_PORTAL_GLB as unknown as string, false, false) as GLTF;
  const model = useMemo(
    () =>
      cloneAndFitFloorGlb(gltf.scene, {
        targetSizeX: LOBBY_MESHY_PORTAL_FIT.sx,
        targetSizeZ: LOBBY_MESHY_PORTAL_FIT.sz,
        targetMaxHeight: LOBBY_MESHY_PORTAL_FIT.maxHeight,
      }),
    [gltf.scene],
  );

  const signX = entrance.side === 'left' ? wallX + 0.95 : wallX - 0.95;
  const facing = entrance.side === 'left' ? Math.PI / 2 : -Math.PI / 2;
  const alcoveDepth = 1.05;
  const alcoveCenterX = entrance.side === 'left' ? wallX + alcoveDepth / 2 : wallX - alcoveDepth / 2;
  const portalYaw = entrance.side === 'left' ? Math.PI / 2 : -Math.PI / 2;

  return (
    <group position={[0, 0, entrance.z]}>
      <group position={[alcoveCenterX, 0, 0]} rotation={[0, portalYaw, 0]}>
        <primitive object={model} />
      </group>

      <mesh position={[alcoveCenterX, 0.06, 0]}>
        <boxGeometry args={[alcoveDepth + 0.05, 0.08, LOBBY_MESHY_PORTAL_FIT.sz + 0.35]} />
        <meshBasicMaterial color={entrance.accent} toneMapped={false} transparent opacity={0.35} />
      </mesh>

      <mesh position={[signX, 2.05, 0]} rotation={[0, facing, 0]}>
        <boxGeometry args={[2.5, 0.55, 0.08]} />
        <meshLambertMaterial color="#121829" emissive={entrance.accent} emissiveIntensity={0.25} />
      </mesh>

      <group position={[signX, 2.05, 0.06]} rotation={[0, facing, 0]}>
        <LobbyDotMatrixSign text={entrance.label} color={entrance.glow} scale={0.85} />
      </group>

      <pointLight
        position={[alcoveCenterX + (entrance.side === 'left' ? 0.6 : -0.6), 1.6, 0]}
        intensity={0.55}
        color={entrance.glow}
        distance={5}
      />
    </group>
  );
}

export { preloadLobbyGamePortalGlb };

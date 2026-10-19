'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useGLTF } from '@react-three/drei/native';
import { useMemo } from 'react';
import type { GLTF } from 'three-stdlib';

import { cloneAndFitFloorGlb } from '@/lib/lobby/fit-floor-glb-clone';
import { LOBBY_MESHY_PORTAL_FIT } from '@/lib/lobby/lobby-club-layout';
import type { GameEntranceTheme } from '@/lib/lobby/lobby-club-layout';
import { LOBBY_GAME_PORTAL_GLB, preloadLobbyGamePortalGlb } from '@/lib/lobby/game-portal-model';

type LobbyMeshyGamePortalProps = {
  entrance: GameEntranceTheme;
};

/** Meshy portal arch — opening faces +Z toward spawn (4B.3E). */
export function LobbyMeshyGamePortal({ entrance }: LobbyMeshyGamePortalProps) {
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

  return (
    <group position={[entrance.x, 0, entrance.z]}>
      <primitive object={model} />

      <mesh position={[0, 0.05, LOBBY_MESHY_PORTAL_FIT.sz * 0.55]}>
        <boxGeometry args={[LOBBY_MESHY_PORTAL_FIT.sx + 0.12, 0.06, 0.14]} />
        <meshBasicMaterial color={entrance.accent} toneMapped={false} transparent opacity={0.42} />
      </mesh>

      <pointLight position={[0, 1.55, 0.35]} intensity={0.42} color={entrance.glow} distance={4.5} />
    </group>
  );
}

export { preloadLobbyGamePortalGlb };

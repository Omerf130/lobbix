'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useGLTF } from '@react-three/drei/native';
import { useMemo } from 'react';
import type { GLTF } from 'three-stdlib';

import { cloneAndFitFloorGlb } from '@/lib/lobby/fit-floor-glb-clone';
import { LOBBY_GAMING_LOUNGE_FOOTPRINT } from '@/lib/lobby/lobby-club-layout';
import {
  LOBBY_GAMING_LOUNGE_GLB,
  preloadLobbyGamingLoungeGlb,
} from '@/lib/lobby/gaming-lounge-model';

type LobbyGamingLoungeProps = {
  x: number;
  z: number;
  rotationY?: number;
};

export function LobbyGamingLounge({ x, z, rotationY = 0 }: LobbyGamingLoungeProps) {
  const gltf = useGLTF(LOBBY_GAMING_LOUNGE_GLB as unknown as string, false, false) as GLTF;
  const model = useMemo(() => {
    const quarterTurn = Math.abs(Math.abs(rotationY) - Math.PI / 2) < 0.02;
    const worldSx = LOBBY_GAMING_LOUNGE_FOOTPRINT.sx;
    const worldSz = LOBBY_GAMING_LOUNGE_FOOTPRINT.sz;
    return cloneAndFitFloorGlb(gltf.scene, {
      targetSizeX: quarterTurn ? worldSz : worldSx,
      targetSizeZ: quarterTurn ? worldSx : worldSz,
    });
  }, [gltf.scene, rotationY]);

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <primitive object={model} />
    </group>
  );
}

export { preloadLobbyGamingLoungeGlb };

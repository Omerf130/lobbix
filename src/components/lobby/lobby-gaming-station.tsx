'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useGLTF } from '@react-three/drei/native';
import { useMemo } from 'react';
import type { GLTF } from 'three-stdlib';

import { cloneAndFitFloorGlb } from '@/lib/lobby/fit-floor-glb-clone';
import { LOBBY_GAMING_STATION_FOOTPRINT } from '@/lib/lobby/lobby-club-layout';
import {
  LOBBY_GAMING_STATION_GLB,
  preloadLobbyGamingStationGlb,
} from '@/lib/lobby/gaming-station-model';

type LobbyGamingStationProps = {
  x: number;
  z: number;
  /** Y rotation — default faces monitors toward +Z (spawn / corridor approach). */
  rotationY?: number;
};

export function LobbyGamingStation({ x, z, rotationY = 0 }: LobbyGamingStationProps) {
  const gltf = useGLTF(LOBBY_GAMING_STATION_GLB as unknown as string, false, false) as GLTF;
  const model = useMemo(
    () =>
      cloneAndFitFloorGlb(gltf.scene, {
        targetSizeX: LOBBY_GAMING_STATION_FOOTPRINT.sx,
        targetSizeZ: LOBBY_GAMING_STATION_FOOTPRINT.sz,
      }),
    [gltf.scene],
  );

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <primitive object={model} />
    </group>
  );
}

export { preloadLobbyGamingStationGlb };

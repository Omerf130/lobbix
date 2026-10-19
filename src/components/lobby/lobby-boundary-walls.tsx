'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';

import { lobbyMat } from '@/components/lobby/lobby-shared-materials';
import { palette } from '@/constants/theme';
import type { LobbyArenaConfig } from '@/lib/lobby/lobby-arena';
import { PERSONAL_LOBBY_CLUB_LAYOUT } from '@/lib/lobby/lobby-club-layout';
import { lobbySceneFrameSnapshot } from '@/lib/lobby/lobby-scene-frame-snapshot';
import { getLobbyBoundaryWallBoxes } from '@/lib/lobby/lobby-wall-bounds';
import {
  applyMaterialWallFade,
  lerpBoundaryWallOpacity,
  wallObstructsCameraView,
} from '@/lib/lobby/lobby-wall-occlusion';

type LobbyBoundaryWallsProps = {
  arena: LobbyArenaConfig;
  hx: number;
  halfZ: number;
  wallH: number;
  wallT: number;
  floorD: number;
  floorW: number;
};

export function LobbyBoundaryWalls({
  arena,
  hx,
  halfZ,
  wallH,
  wallT,
  floorD,
  floorW,
}: LobbyBoundaryWallsProps) {
  const layout = PERSONAL_LOBBY_CLUB_LAYOUT;
  const boxes = useMemo(
    () => getLobbyBoundaryWallBoxes(arena, layout),
    [arena, layout],
  );

  const panelZs = useMemo(() => {
    const zs: number[] = [];
    for (let z = -halfZ + 2.5; z < halfZ - 1; z += 3.4) zs.push(z);
    return zs;
  }, [halfZ]);

  const leftOpacity = useRef(1);
  const rightOpacity = useRef(1);
  const farOpacity = useRef(1);

  useFrame((_, delta) => {
    const s = lobbySceneFrameSnapshot;
    const leftObs = wallObstructsCameraView(
      s.cameraX,
      s.cameraY,
      s.cameraZ,
      s.focusX,
      s.focusY,
      s.focusZ,
      boxes.left,
    );
    const rightObs = wallObstructsCameraView(
      s.cameraX,
      s.cameraY,
      s.cameraZ,
      s.focusX,
      s.focusY,
      s.focusZ,
      boxes.right,
    );
    const farObs = wallObstructsCameraView(
      s.cameraX,
      s.cameraY,
      s.cameraZ,
      s.focusX,
      s.focusY,
      s.focusZ,
      boxes.far,
    );

    leftOpacity.current = lerpBoundaryWallOpacity(leftOpacity.current, leftObs, delta);
    rightOpacity.current = lerpBoundaryWallOpacity(rightOpacity.current, rightObs, delta);
    farOpacity.current = lerpBoundaryWallOpacity(farOpacity.current, farObs, delta);

    applyMaterialWallFade(lobbyMat.boundaryLeftShell, leftOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryLeftPanel, leftOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryLeftTrim, leftOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryRightShell, rightOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryRightPanel, rightOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryRightTrim, rightOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryFarShell, farOpacity.current);
    applyMaterialWallFade(lobbyMat.boundaryFarAccent, farOpacity.current * 0.25);
  });

  return (
    <>
      {[-1, 1].map((side) => {
        const isLeft = side < 0;
        const shellMat = isLeft ? lobbyMat.boundaryLeftShell : lobbyMat.boundaryRightShell;
        const panelMat = isLeft ? lobbyMat.boundaryLeftPanel : lobbyMat.boundaryRightPanel;
        const trimMat = isLeft ? lobbyMat.boundaryLeftTrim : lobbyMat.boundaryRightTrim;

        return (
          <group key={side}>
            <mesh position={[side * hx, wallH / 2, 0]} material={shellMat}>
              <boxGeometry args={[wallT, wallH, floorD]} />
            </mesh>

            {panelZs.map((z) => (
              <group key={`panel-${side}-${z}`}>
                <mesh position={[side * (hx - 0.14), wallH * 0.52, z]} material={panelMat}>
                  <boxGeometry args={[0.1, wallH * 0.72, 2.65]} />
                </mesh>
                <mesh position={[side * (hx - 0.1), wallH * 0.22, z]} material={trimMat}>
                  <boxGeometry args={[0.04, 0.06, 2.75]} />
                </mesh>
                <mesh position={[side * (hx - 0.1), wallH * 0.78, z]} material={trimMat}>
                  <boxGeometry args={[0.035, 0.05, 2.7]} />
                </mesh>
                <mesh position={[side * (hx - 0.08), 0.42, z]}>
                  <boxGeometry args={[0.05, 0.04, 2.4]} />
                  <meshBasicMaterial
                    color={side < 0 ? palette.turquoise : palette.pink}
                    toneMapped={false}
                    transparent
                    opacity={0.55}
                  />
                </mesh>
              </group>
            ))}

            {panelZs.map((z) => (
              <mesh key={`vert-neon-${side}-${z}`} position={[side * (hx - 0.06), 1.05, z + 1.2]}>
                <boxGeometry args={[0.03, 1.4, 0.04]} />
                <meshBasicMaterial
                  color={side < 0 ? palette.turquoise : palette.purple}
                  toneMapped={false}
                  transparent
                  opacity={0.35}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      <mesh position={[0, wallH / 2, layout.farWallZ]} material={lobbyMat.boundaryFarShell}>
        <boxGeometry args={[floorW, wallH, wallT]} />
      </mesh>
      <mesh position={[0, wallH * 0.55, layout.farWallZ + 0.2]} material={lobbyMat.boundaryFarAccent}>
        <boxGeometry args={[3.2, 1.2, 0.06]} />
      </mesh>
    </>
  );
}

'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import { StyleSheet, View } from 'react-native';

import {
  ChibiMovementRig,
  type ChibiMovementStatus,
} from '@/components/avatar/chibi-movement-rig';
import { palette } from '@/constants/theme';
import { CHIBI_MALE_ANIMATED_GLB } from '@/lib/dev/chibi-male-animated-model';
import {
  DEFAULT_CHIBI_MOVEMENT_RENDER_FLAGS,
  type ChibiMovementRenderFlags,
} from '@/lib/dev/chibi-movement-render-flags';
import { configureDevMovementGlShaderDiagnostics } from '@/lib/dev/expo-gl-shader-diagnostics';
import { DEV_CHIBI_MOVEMENT_ARENA } from '@/lib/lobby/lobby-arena';
import type { MovementControlState } from '@/lib/movement-control-state';

export type { ChibiMovementStatus };

const ARENA_HALF = DEV_CHIBI_MOVEMENT_ARENA.halfExtentX;

type ChibiMovementTestSceneProps = {
  controls: MovementControlState;
  resetKey: number;
  renderFlags?: ChibiMovementRenderFlags;
  onReady?: () => void;
  onStatusChange?: (status: ChibiMovementStatus) => void;
};

function DevMovementEnvironment({ flags }: { flags: ChibiMovementRenderFlags }) {
  return (
    <>
      <color attach="background" args={[palette.navy900]} />
      <ambientLight intensity={0.78} />
      <directionalLight position={[1.8, 5, 2.8]} intensity={1.05} color={palette.white} />
      <directionalLight position={[-2.8, 2.2, -1.2]} intensity={0.55} color={palette.turquoise} />
      <pointLight position={[0.6, 1.35, 2.2]} intensity={0.65} color={palette.white} />
      <pointLight position={[-1.5, 0.8, 1.5]} intensity={0.28} color={palette.purple} />
      {flags.showGround ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshBasicMaterial color={palette.navy800} />
        </mesh>
      ) : null}
      {flags.showGrid ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <planeGeometry args={[24, 24, 24, 24]} />
          <meshBasicMaterial color={palette.navy700} wireframe transparent opacity={0.35} />
        </mesh>
      ) : null}
      {flags.showArenaRing ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[ARENA_HALF - 0.2, ARENA_HALF, 64]} />
          <meshBasicMaterial color={palette.purple} transparent opacity={0.35} />
        </mesh>
      ) : null}
      {flags.showObstacles
        ? DEV_CHIBI_MOVEMENT_ARENA.obstacles.map((obs, index) => (
            <mesh key={index} position={[obs.x, 0.55, obs.z]}>
              <boxGeometry args={[obs.sx, 1.1, obs.sz]} />
              <meshBasicMaterial color={palette.navy700} />
            </mesh>
          ))
        : null}
    </>
  );
}

export function ChibiMovementTestScene({
  controls,
  resetKey,
  renderFlags = DEFAULT_CHIBI_MOVEMENT_RENDER_FLAGS,
  onReady,
  onStatusChange,
}: ChibiMovementTestSceneProps) {
  return (
    <View style={styles.canvasHost}>
      <Canvas
        style={styles.canvas}
        pointerEvents="none"
        camera={{ position: [0, 4, 7], fov: 55, near: 0.1, far: 120 }}
        frameloop="always"
        onCreated={(state) => {
          configureDevMovementGlShaderDiagnostics(state.gl);
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <DevMovementEnvironment flags={renderFlags} />
        {renderFlags.showCharacter ? (
          <ChibiMovementRig
            glbModule={CHIBI_MALE_ANIMATED_GLB}
            arena={DEV_CHIBI_MOVEMENT_ARENA}
            controls={controls}
            resetKey={resetKey}
            onStatusChange={onStatusChange}
          />
        ) : null}
      </Canvas>
    </View>
  );
}

export function preloadChibiMovementAsset(): void {
  useGLTF.preload(CHIBI_MALE_ANIMATED_GLB as unknown as string, false, false);
}

const styles = StyleSheet.create({
  canvasHost: {
    ...StyleSheet.absoluteFill,
  },
  canvas: {
    flex: 1,
  },
});

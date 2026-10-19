'use no memo';

import '@/lib/r3f-native-bootstrap';
import { Canvas } from '@react-three/fiber/native';
import { StyleSheet, View } from 'react-native';

import { ChibiMovementRig } from '@/components/avatar/chibi-movement-rig';
import { LobbyClubEnvironment } from '@/components/lobby/lobby-club-environment';
import { palette } from '@/constants/theme';
import { configureDevMovementGlShaderDiagnostics } from '@/lib/dev/expo-gl-shader-diagnostics';
import type { LobbyArenaConfig } from '@/lib/lobby/lobby-arena';
import type { MovementControlState } from '@/lib/movement-control-state';
import type { AvatarAnimatedGlbModule } from '@/lib/profile/resolve-avatar-model';

type PersonalLobbySceneProps = {
  glbModule: AvatarAnimatedGlbModule;
  arena: LobbyArenaConfig;
  controls: MovementControlState;
  resetKey: number;
  onReady?: () => void;
};

/** Same Canvas + rig camera as {@link ChibiMovementTestScene}. */
export function PersonalLobbyScene({
  glbModule,
  arena,
  controls,
  resetKey,
  onReady,
}: PersonalLobbySceneProps) {
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
        <LobbyClubEnvironment arena={arena} />
        <ChibiMovementRig
          glbModule={glbModule}
          arena={arena}
          controls={controls}
          resetKey={resetKey}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasHost: {
    ...StyleSheet.absoluteFill,
  },
  canvas: {
    flex: 1,
  },
});

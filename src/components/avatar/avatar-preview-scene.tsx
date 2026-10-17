'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Suspense, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { Group } from 'three';

import { ChibiAvatar } from '@/components/avatar/chibi-avatar';
import { palette } from '@/constants/theme';
import type { AvatarCustomization } from '@/lib/profile/avatar-customization';

type AvatarPreviewSceneProps = {
  customization: AvatarCustomization;
  spinYRef: React.RefObject<number>;
  onReady?: () => void;
};

function PreviewRig({
  customization,
  spinYRef,
}: {
  customization: AvatarCustomization;
  spinYRef: React.RefObject<number>;
}) {
  const bodyRef = useRef<Group>(null);

  useFrame(() => {
    if (bodyRef.current) {
      bodyRef.current.rotation.y = spinYRef.current ?? 0;
    }
  });

  return <ChibiAvatar rootRef={bodyRef} customization={customization} previewIdle />;
}

export function AvatarPreviewScene({ customization, spinYRef, onReady }: AvatarPreviewSceneProps) {
  return (
    <View style={styles.host}>
      <Canvas
        style={styles.canvas}
        camera={{ position: [0, 1.05, 3.35], fov: 42, near: 0.1, far: 50 }}
        frameloop="always"
        onCreated={(state) => {
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <color attach="background" args={[palette.navy900]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 4, 3]} intensity={1.1} color={palette.white} />
        <pointLight position={[-2, 2, -1]} intensity={0.45} color={palette.turquoise} />
        <Suspense fallback={null}>
          <PreviewRig customization={customization} spinYRef={spinYRef} />
        </Suspense>
      </Canvas>
      <View style={styles.loading} pointerEvents="none">
        <ActivityIndicator color={palette.turquoise} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    minHeight: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(155, 93, 229, 0.25)',
    backgroundColor: palette.navy900,
  },
  canvas: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
});

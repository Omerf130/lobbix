'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Mesh } from 'three';

import { palette } from '@/constants/theme';

function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.8;
    mesh.rotation.x += delta * 0.25;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.55, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={palette.purple} emissive={palette.purple} emissiveIntensity={0.15} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color={palette.navy800} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function SceneContents() {
  return (
    <>
      <color attach="background" args={[palette.navy900]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} color={palette.white} />
      <pointLight position={[-3, 2, -2]} intensity={0.6} color={palette.turquoise} />
      <Floor />
      <RotatingCube />
    </>
  );
}

type ThreeTestSceneProps = {
  onReady?: () => void;
};

export function ThreeTestScene({ onReady }: ThreeTestSceneProps) {
  return (
    <View style={styles.canvasHost}>
      <Canvas
        style={styles.canvas}
        camera={{ position: [2.8, 2.4, 4.2], fov: 52, near: 0.1, far: 100 }}
        frameloop="always"
        onCreated={(state) => {
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <SceneContents />
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

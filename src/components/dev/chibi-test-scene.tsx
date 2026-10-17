'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { useGLTF } from '@react-three/drei/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Box3, Group, Mesh, Vector3 } from 'three';
import type { GLTF } from 'three-stdlib';

import { palette } from '@/constants/theme';
import { CHIBI_MALE_GLB } from '@/lib/dev/chibi-male-model';

export type ChibiMaleRuntimeReport = {
  animationClipNames: string[];
  skinnedMeshCount: number;
  meshCount: number;
  materialCount: number;
  textureCount: number;
};

type ChibiTestSceneProps = {
  spinYRef: React.RefObject<number>;
  onReady?: () => void;
  onRuntimeReport?: (report: ChibiMaleRuntimeReport) => void;
};

function fitModelToPreview(scene: GLTF['scene']): { model: GLTF['scene']; scale: number } {
  const model = scene.clone(true);
  model.updateMatrixWorld(true);

  const box = new Box3().setFromObject(model);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  model.position.set(-center.x, -box.min.y, -center.z);

  const targetHeight = 1.05;
  const scale = size.y > 1e-6 ? targetHeight / size.y : 1;
  model.scale.setScalar(scale);

  return { model, scale };
}

function ChibiMaleModel({
  spinYRef,
  onRuntimeReport,
}: {
  spinYRef: React.RefObject<number>;
  onRuntimeReport?: (report: ChibiMaleRuntimeReport) => void;
}) {
  const pivotRef = useRef<Group>(null);
  const gltf = useGLTF(CHIBI_MALE_GLB as unknown as string, false, false) as GLTF;
  const { model } = useMemo(() => fitModelToPreview(gltf.scene), [gltf.scene]);

  useEffect(() => {
    const animationClipNames = gltf.animations.map((clip) => clip.name);
    let skinnedMeshCount = 0;
    let meshCount = 0;
    const materials = new Set<number>();
    const textures = new Set<string>();

    model.traverse((node) => {
      if (node instanceof Mesh) {
        meshCount += 1;
        if ('isSkinnedMesh' in node && (node as Mesh & { isSkinnedMesh?: boolean }).isSkinnedMesh) {
          skinnedMeshCount += 1;
        }
        const mat = node.material;
        const mats = Array.isArray(mat) ? mat : [mat];
        for (const entry of mats) {
          if (!entry) continue;
          materials.add(entry.id);
          const maps = [
            entry.map,
            entry.normalMap,
            entry.metalnessMap,
            entry.roughnessMap,
            entry.emissiveMap,
          ];
          for (const tex of maps) {
            if (tex?.uuid) textures.add(tex.uuid);
          }
        }
      }
    });

    onRuntimeReport?.({
      animationClipNames,
      skinnedMeshCount,
      meshCount,
      materialCount: materials.size,
      textureCount: textures.size,
    });
  }, [gltf.animations, model, onRuntimeReport]);

  useFrame(() => {
    if (pivotRef.current) {
      pivotRef.current.rotation.y = spinYRef.current ?? 0;
    }
  });

  return (
    <group ref={pivotRef}>
      <primitive object={model} />
    </group>
  );
}

function SceneContents({
  spinYRef,
  onRuntimeReport,
}: {
  spinYRef: React.RefObject<number>;
  onRuntimeReport?: (report: ChibiMaleRuntimeReport) => void;
}) {
  return (
    <>
      <color attach="background" args={[palette.navy900]} />
      <ambientLight intensity={0.62} />
      <directionalLight position={[2.2, 4.5, 2.5]} intensity={1.25} color={palette.white} />
      <directionalLight position={[-2.5, 2, -1.5]} intensity={0.35} color={palette.turquoise} />
      <pointLight position={[0, 1.5, 2]} intensity={0.45} color={palette.purple} />
      <ChibiMaleModel spinYRef={spinYRef} onRuntimeReport={onRuntimeReport} />
    </>
  );
}

export function ChibiTestScene({ spinYRef, onReady, onRuntimeReport }: ChibiTestSceneProps) {
  return (
    <View style={styles.host}>
      <Canvas
        style={styles.canvas}
        pointerEvents="none"
        camera={{ position: [0, 0.58, 2.45], fov: 40, near: 0.05, far: 50 }}
        frameloop="always"
        onCreated={(state) => {
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <SceneContents spinYRef={spinYRef} onRuntimeReport={onRuntimeReport} />
      </Canvas>
    </View>
  );
}

export function preloadChibiMaleAsset(): void {
  useGLTF.preload(CHIBI_MALE_GLB as unknown as string, false, false);
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    minHeight: 280,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(155, 93, 229, 0.25)',
    backgroundColor: palette.navy900,
  },
  canvas: {
    flex: 1,
  },
});

'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { useGLTF } from '@react-three/drei/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { AnimationClip } from 'three';
import {
  AnimationAction,
  AnimationMixer,
  Box3,
  Group,
  LoopRepeat,
  Object3D,
  Vector3,
} from 'three';
import { SkeletonUtils, type GLTF } from 'three-stdlib';

import { palette } from '@/constants/theme';
import {
  CHIBI_ANIMATED_CLIP_BY_MODE,
  CHIBI_MALE_ANIMATED_GLB,
  type ChibiAnimatedPreviewMode,
} from '@/lib/dev/chibi-male-animated-model';

/** After fit (feet y≈0, height≈1.05), aim at upper-torso — not origin/feet. */
const PREVIEW_CAMERA = {
  position: [0, 0.48, 2.52] as const,
  lookAt: [0, 0.56, 0] as const,
  fov: 38,
};

type ChibiAnimatedTestSceneProps = {
  animMode: ChibiAnimatedPreviewMode;
  spinYRef: React.RefObject<number>;
  onReady?: () => void;
  onClipError?: (message: string) => void;
};

function fitSkinnedClone(scene: GLTF['scene']): Object3D {
  const model = SkeletonUtils.clone(scene);
  model.updateMatrixWorld(true);

  const box = new Box3().setFromObject(model);
  const center = new Vector3();
  const size = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  model.position.set(-center.x, -box.min.y, -center.z);

  const targetHeight = 1.05;
  if (size.y > 1e-6) {
    model.scale.setScalar(targetHeight / size.y);
  }

  return model;
}

function AnimatedChibiCharacter({
  animMode,
  spinYRef,
  onClipError,
}: {
  animMode: ChibiAnimatedPreviewMode;
  spinYRef: React.RefObject<number>;
  onClipError?: (message: string) => void;
}) {
  const pivotRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(
    CHIBI_MALE_ANIMATED_GLB as unknown as string,
    false,
    false,
  ) as GLTF;
  const model = useMemo(() => fitSkinnedClone(scene), [scene]);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const activeActionRef = useRef<AnimationAction | null>(null);
  const basePositionRef = useRef(new Vector3());

  useEffect(() => {
    model.updateMatrixWorld(true);
    basePositionRef.current.copy(model.position);
    const mixer = new AnimationMixer(model);
    mixerRef.current = mixer;

    return () => {
      activeActionRef.current = null;
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      mixerRef.current = null;
    };
  }, [model]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    const clipName = CHIBI_ANIMATED_CLIP_BY_MODE[animMode];
    const clip = animations.find((entry: AnimationClip) => entry.name === clipName);
    if (!clip) {
      onClipError?.(`Clip "${clipName}" not found in GLB.`);
      return;
    }

    const nextAction = mixer.clipAction(clip);
    nextAction.setLoop(LoopRepeat, Infinity);

    const previous = activeActionRef.current;
    if (previous && previous !== nextAction) {
      previous.fadeOut(0.25);
      nextAction.reset().fadeIn(0.25).play();
    } else {
      nextAction.reset().fadeIn(0.15).play();
    }
    activeActionRef.current = nextAction;
  }, [animMode, animations, onClipError]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

    if (pivotRef.current) {
      pivotRef.current.rotation.y = spinYRef.current ?? 0;
    }

    model.position.x = basePositionRef.current.x;
    model.position.z = basePositionRef.current.z;
  });

  return (
    <group ref={pivotRef}>
      <primitive object={model} />
    </group>
  );
}

function SceneContents({
  animMode,
  spinYRef,
  onClipError,
}: {
  animMode: ChibiAnimatedPreviewMode;
  spinYRef: React.RefObject<number>;
  onClipError?: (message: string) => void;
}) {
  return (
    <>
      <color attach="background" args={[palette.navy900]} />
      <ambientLight intensity={0.78} />
      <directionalLight position={[1.8, 5, 2.8]} intensity={1.05} color={palette.white} />
      <directionalLight position={[-2.8, 2.2, -1.2]} intensity={0.55} color={palette.turquoise} />
      <pointLight position={[0.6, 1.35, 2.2]} intensity={0.65} color={palette.white} />
      <pointLight position={[-1.5, 0.8, 1.5]} intensity={0.28} color={palette.purple} />
      <AnimatedChibiCharacter
        animMode={animMode}
        spinYRef={spinYRef}
        onClipError={onClipError}
      />
    </>
  );
}

export function ChibiAnimatedTestScene({
  animMode,
  spinYRef,
  onReady,
  onClipError,
}: ChibiAnimatedTestSceneProps) {
  return (
    <View style={styles.host}>
      <Canvas
        style={styles.canvas}
        pointerEvents="none"
        camera={{
          position: [...PREVIEW_CAMERA.position],
          fov: PREVIEW_CAMERA.fov,
          near: 0.05,
          far: 50,
        }}
        frameloop="always"
        onCreated={(state) => {
          state.camera.lookAt(
            PREVIEW_CAMERA.lookAt[0],
            PREVIEW_CAMERA.lookAt[1],
            PREVIEW_CAMERA.lookAt[2],
          );
          state.camera.updateProjectionMatrix();
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <SceneContents animMode={animMode} spinYRef={spinYRef} onClipError={onClipError} />
      </Canvas>
    </View>
  );
}

export function preloadChibiMaleAnimatedAsset(): void {
  useGLTF.preload(CHIBI_MALE_ANIMATED_GLB as unknown as string, false, false);
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

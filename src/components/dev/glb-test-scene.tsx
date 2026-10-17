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
  Group,
  LoopRepeat,
  Vector3,
} from 'three';
import { SkeletonUtils, type GLTF } from 'three-stdlib';

import { palette } from '@/constants/theme';
import {
  GLB_POC_IDLE_CLIP,
  GLB_POC_WALK_CLIP,
  GLB_POC_SKELETON_SUMMARY,
  QUATERNIUS_GLB_POC,
  type GlbPocAnimMode,
} from '@/lib/dev/quaternius-glb-poc';

const MODEL_SCALE = 0.95;
const MODEL_Y_OFFSET = -0.02;

type GlbTestSceneProps = {
  animMode: GlbPocAnimMode;
  spinYRef: React.RefObject<number>;
  onReady?: () => void;
  onClipError?: (message: string) => void;
};

function RiggedPocCharacter({
  animMode,
  spinYRef,
  onClipError,
}: {
  animMode: GlbPocAnimMode;
  spinYRef: React.RefObject<number>;
  onClipError?: (message: string) => void;
}) {
  const pivotRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(
    QUATERNIUS_GLB_POC as unknown as string,
    false,
    false,
  ) as GLTF;
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene]);
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

  const clipNames = useMemo(
    () => ({
      idle: GLB_POC_IDLE_CLIP,
      walk: GLB_POC_WALK_CLIP,
    }),
    [],
  );

  useEffect(() => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    const clipName = animMode === 'walk' ? clipNames.walk : clipNames.idle;
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
  }, [animMode, animations, clipNames, onClipError]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

    if (pivotRef.current) {
      pivotRef.current.rotation.y = spinYRef.current ?? 0;
    }

    // Keep preview anchored: undo horizontal drift from walk root motion on the rig root.
    model.position.x = basePositionRef.current.x;
    model.position.z = basePositionRef.current.z;
  });

  return (
    <group ref={pivotRef}>
      <primitive object={model} scale={MODEL_SCALE} position={[0, MODEL_Y_OFFSET, 0]} />
    </group>
  );
}

function SceneContents({
  animMode,
  spinYRef,
  onClipError,
}: {
  animMode: GlbPocAnimMode;
  spinYRef: React.RefObject<number>;
  onClipError?: (message: string) => void;
}) {
  return (
    <>
      <color attach="background" args={[palette.navy900]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 4, 2]} intensity={1.15} color={palette.white} />
      <pointLight position={[-2, 2.5, -1.5]} intensity={0.5} color={palette.turquoise} />
      <RiggedPocCharacter animMode={animMode} spinYRef={spinYRef} onClipError={onClipError} />
    </>
  );
}

export function GlbTestScene({ animMode, spinYRef, onReady, onClipError }: GlbTestSceneProps) {
  return (
    <View style={styles.host}>
      <Canvas
        style={styles.canvas}
        pointerEvents="none"
        camera={{ position: [0, 1.05, 3.35], fov: 42, near: 0.1, far: 50 }}
        frameloop="always"
        onCreated={(state) => {
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <SceneContents animMode={animMode} spinYRef={spinYRef} onClipError={onClipError} />
      </Canvas>
    </View>
  );
}

/** Preload PoC asset when the dev screen mounts (Suspense). */
export function preloadGlbPocAsset(): void {
  useGLTF.preload(QUATERNIUS_GLB_POC as unknown as string, false, false);
}

export function glbPocSkeletonReport(): typeof GLB_POC_SKELETON_SUMMARY {
  return GLB_POC_SKELETON_SUMMARY;
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

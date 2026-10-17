'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { useGLTF } from '@react-three/drei/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AnimationAction,
  AnimationMixer,
  Box3,
  Group,
  LoopRepeat,
  MathUtils,
  Object3D,
  Vector3,
} from 'three';
import { SkeletonUtils, type GLTF } from 'three-stdlib';

import { palette } from '@/constants/theme';
import { headingYFromMovementDirection, lerpHeadingY } from '@/lib/avatar-heading';
import {
  CHIBI_ANIMATED_FACING_Y_OFFSET,
  CHIBI_ANIMATED_LOOK_AT_HEIGHT,
  CHIBI_MALE_ANIMATED_GLB,
  CHIBI_MOVEMENT_IDLE_CLIP,
  CHIBI_MOVEMENT_WALK_CLIP,
} from '@/lib/dev/chibi-male-animated-model';
import {
  DEFAULT_CHIBI_MOVEMENT_RENDER_FLAGS,
  type ChibiMovementRenderFlags,
} from '@/lib/dev/chibi-movement-render-flags';
import { CHIBI_MOVEMENT_WORLD_SPEED_METERS_PER_SEC } from '@/lib/dev/chibi-movement-world-speed';
import { configureDevMovementGlShaderDiagnostics } from '@/lib/dev/expo-gl-shader-diagnostics';
import type { MovementControlState } from '@/lib/movement-control-state';

const ARENA_HALF = 11;
const CHARACTER_RADIUS = 0.45;

const OBSTACLES = [
  { x: -4, z: -3, sx: 1.2, sz: 1.2 },
  { x: 3, z: -5, sx: 1.6, sz: 0.9 },
  { x: -2, z: 4, sx: 0.9, sz: 1.4 },
  { x: 5, z: 3, sx: 1.1, sz: 1.1 },
] as const;

export type ChibiMovementStatus = {
  moving: boolean;
  activeClip: string;
  positionX: number;
  positionZ: number;
};

type ChibiMovementTestSceneProps = {
  controls: MovementControlState;
  resetKey: number;
  renderFlags?: ChibiMovementRenderFlags;
  onReady?: () => void;
  onStatusChange?: (status: ChibiMovementStatus) => void;
};

/** Keep lowest skinned vertices on y=0 without freezing bone animation. */
const FOOT_GROUND_SMOOTH = 14;

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

function Environment({ flags }: { flags: ChibiMovementRenderFlags }) {
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
        ? OBSTACLES.map((obs, index) => (
            <mesh key={index} position={[obs.x, 0.55, obs.z]}>
              <boxGeometry args={[obs.sx, 1.1, obs.sz]} />
              <meshBasicMaterial color={palette.navy700} />
            </mesh>
          ))
        : null}
    </>
  );
}

function AnimatedChibiMovementRig({
  controls,
  resetKey,
  onStatusChange,
}: {
  controls: MovementControlState;
  resetKey: number;
  onStatusChange?: (status: ChibiMovementStatus) => void;
}) {
  const bodyRef = useRef<Group>(null);
  const gltf = useGLTF(CHIBI_MALE_ANIMATED_GLB as unknown as string, false, false) as GLTF;
  const model = useMemo(() => fitSkinnedClone(gltf.scene), [gltf.scene]);

  const mixerRef = useRef<AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, AnimationAction>>({});
  const activeActionRef = useRef<AnimationAction | null>(null);
  const basePositionRef = useRef(new Vector3());
  const wasMovingRef = useRef(false);
  const activeClipRef = useRef<string>(CHIBI_MOVEMENT_IDLE_CLIP);

  const position = useRef(new Vector3(0, 0, 0));
  const facing = useRef(0);
  const moveDir = useRef(new Vector3());
  const camLook = useRef(new Vector3());
  const moveForward = useRef(new Vector3());
  const moveRight = useRef(new Vector3());
  const desiredCam = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const footBounds = useRef(new Box3());
  const bodyGroundY = useRef(0);

  const reportStatus = useRef((moving: boolean) => {
    onStatusChange?.({
      moving,
      activeClip: activeClipRef.current,
      positionX: Math.round(position.current.x * 100) / 100,
      positionZ: Math.round(position.current.z * 100) / 100,
    });
  });

  useEffect(() => {
    reportStatus.current = (moving: boolean) => {
      onStatusChange?.({
        moving,
        activeClip: activeClipRef.current,
        positionX: Math.round(position.current.x * 100) / 100,
        positionZ: Math.round(position.current.z * 100) / 100,
      });
    };
  }, [onStatusChange]);

  useEffect(() => {
    model.updateMatrixWorld(true);
    basePositionRef.current.copy(model.position);

    const mixer = new AnimationMixer(model);
    mixerRef.current = mixer;
    actionsRef.current = {};

    for (const clip of gltf.animations) {
      const action = mixer.clipAction(clip);
      action.setLoop(LoopRepeat, Infinity);
      actionsRef.current[clip.name] = action;
    }

    const idle = actionsRef.current[CHIBI_MOVEMENT_IDLE_CLIP];
    if (idle) {
      idle.reset().fadeIn(0.15).play();
      activeActionRef.current = idle;
      activeClipRef.current = CHIBI_MOVEMENT_IDLE_CLIP;
    }

    reportStatus.current(false);

    return () => {
      activeActionRef.current = null;
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      mixerRef.current = null;
      actionsRef.current = {};
    };
  }, [gltf.animations, model]);

  useEffect(() => {
    position.current.set(0, 0, 0);
    facing.current = 0;
    wasMovingRef.current = false;
    bodyGroundY.current = 0;

    const mixer = mixerRef.current;
    if (mixer) {
      for (const action of Object.values(actionsRef.current)) {
        action.stop();
      }
      const idle = actionsRef.current[CHIBI_MOVEMENT_IDLE_CLIP];
      if (idle) {
        idle.reset().fadeIn(0.15).play();
        activeActionRef.current = idle;
        activeClipRef.current = CHIBI_MOVEMENT_IDLE_CLIP;
      }
    }

    reportStatus.current(false);
  }, [resetKey]);

  const crossfadeTo = useRef((clipName: string) => {
    const next = actionsRef.current[clipName];
    if (!next || activeActionRef.current === next) return;
    activeActionRef.current?.fadeOut(0.22);
    next.reset().fadeIn(0.22).play();
    activeActionRef.current = next;
    activeClipRef.current = clipName;
  });

  useFrame((state, delta) => {
    const input = controls;
    const body = bodyRef.current;
    const mixer = mixerRef.current;
    if (!body || !mixer) return;

    const mx = input.moveX;
    const my = input.moveY;
    const moving = mx !== 0 || my !== 0;

    if (moving !== wasMovingRef.current) {
      wasMovingRef.current = moving;
      crossfadeTo.current(moving ? CHIBI_MOVEMENT_WALK_CLIP : CHIBI_MOVEMENT_IDLE_CLIP);
      reportStatus.current(moving);
    }

    mixer.update(delta);

    model.position.x = basePositionRef.current.x;
    model.position.z = basePositionRef.current.z;

    model.updateMatrixWorld(true);
    footBounds.current.setFromObject(model);
    const targetBodyY = -footBounds.current.min.y;
    const groundBlend = 1 - Math.exp(-FOOT_GROUND_SMOOTH * delta);
    bodyGroundY.current += (targetBodyY - bodyGroundY.current) * groundBlend;

    if (moving) {
      state.camera.getWorldDirection(camLook.current);
      moveForward.current.copy(camLook.current);
      moveForward.current.y = 0;
      if (moveForward.current.lengthSq() > 1e-6) {
        moveForward.current.normalize();
      } else {
        moveForward.current
          .set(Math.sin(input.cameraYaw), 0, Math.cos(input.cameraYaw))
          .normalize();
      }

      moveRight.current.setFromMatrixColumn(state.camera.matrix, 0);
      moveRight.current.y = 0;
      if (moveRight.current.lengthSq() > 1e-6) {
        moveRight.current.normalize();
      } else {
        moveRight.current.set(moveForward.current.z, 0, -moveForward.current.x);
      }

      moveDir.current
        .copy(moveForward.current)
        .multiplyScalar(-my)
        .addScaledVector(moveRight.current, mx);
      if (moveDir.current.lengthSq() > 0.0001) {
        moveDir.current.normalize();
        position.current.x += moveDir.current.x * CHIBI_MOVEMENT_WORLD_SPEED_METERS_PER_SEC * delta;
        position.current.z += moveDir.current.z * CHIBI_MOVEMENT_WORLD_SPEED_METERS_PER_SEC * delta;
        const targetFacing = headingYFromMovementDirection(
          moveDir.current.x,
          moveDir.current.z,
        );
        facing.current = lerpHeadingY(
          facing.current,
          targetFacing,
          1 - Math.exp(-10 * delta),
        );
      }
    }

    position.current.x = MathUtils.clamp(
      position.current.x,
      -ARENA_HALF + CHARACTER_RADIUS,
      ARENA_HALF - CHARACTER_RADIUS,
    );
    position.current.z = MathUtils.clamp(
      position.current.z,
      -ARENA_HALF + CHARACTER_RADIUS,
      ARENA_HALF - CHARACTER_RADIUS,
    );

    for (const obs of OBSTACLES) {
      const halfW = obs.sx / 2 + CHARACTER_RADIUS;
      const halfD = obs.sz / 2 + CHARACTER_RADIUS;
      const dx = position.current.x - obs.x;
      const dz = position.current.z - obs.z;
      if (Math.abs(dx) < halfW && Math.abs(dz) < halfD) {
        const overlapX = halfW - Math.abs(dx);
        const overlapZ = halfD - Math.abs(dz);
        if (overlapX < overlapZ) {
          position.current.x += dx > 0 ? overlapX : -overlapX;
        } else {
          position.current.z += dz > 0 ? overlapZ : -overlapZ;
        }
      }
    }

    body.position.set(position.current.x, bodyGroundY.current, position.current.z);
    body.rotation.y = facing.current;

    const dist = 5.8;
    const pitch = input.cameraPitch;
    const yaw = input.cameraYaw;
    desiredCam.current.set(
      position.current.x - Math.sin(yaw) * Math.cos(pitch) * dist,
      position.current.y + Math.sin(pitch) * dist + 1.2,
      position.current.z - Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    lookTarget.current.set(
      position.current.x,
      CHIBI_ANIMATED_LOOK_AT_HEIGHT,
      position.current.z,
    );

    const lerpFactor = 1 - Math.exp(-6 * delta);
    state.camera.position.lerp(desiredCam.current, lerpFactor);
    state.camera.lookAt(lookTarget.current);
  });

  return (
    <group ref={bodyRef}>
      <group rotation={[0, CHIBI_ANIMATED_FACING_Y_OFFSET, 0]}>
        <primitive object={model} />
      </group>
    </group>
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
        <Environment flags={renderFlags} />
        {renderFlags.showCharacter ? (
          <AnimatedChibiMovementRig
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

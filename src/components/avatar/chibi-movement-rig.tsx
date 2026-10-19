'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import { useGLTF } from '@react-three/drei/native';
import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import {
  AnimationAction,
  AnimationMixer,
  Box3,
  Group,
  LoopRepeat,
  MathUtils,
  Vector3,
} from 'three';
import type { GLTF } from 'three-stdlib';

import { fitSkinnedChibiClone } from '@/lib/avatar/fit-skinned-chibi-clone';
import { headingYFromMovementDirection, lerpHeadingY } from '@/lib/avatar-heading';
import {
  CHIBI_ANIMATED_FACING_Y_OFFSET,
  CHIBI_ANIMATED_LOOK_AT_HEIGHT,
  CHIBI_MOVEMENT_IDLE_CLIP,
  CHIBI_MOVEMENT_WALK_CLIP,
} from '@/lib/dev/chibi-male-animated-model';
import { CHIBI_MOVEMENT_WORLD_SPEED_METERS_PER_SEC } from '@/lib/dev/chibi-movement-world-speed';
import type { LobbyArenaConfig } from '@/lib/lobby/lobby-arena';
import { writeLobbySceneFrameSnapshot } from '@/lib/lobby/lobby-scene-frame-snapshot';
import type { AvatarAnimatedGlbModule } from '@/lib/profile/resolve-avatar-model';
import { CAMERA_FOLLOW_DISTANCE_DEFAULT } from '@/lib/camera-follow-distance';
import type { MovementControlState } from '@/lib/movement-control-state';

const CHARACTER_RADIUS = 0.45;
const FOOT_GROUND_SMOOTH = 14;
const CAMERA_DISTANCE_SMOOTH = 14;
const CAMERA_Y_ANCHOR = 1.2;

export type ChibiMovementStatus = {
  moving: boolean;
  activeClip: string;
  positionX: number;
  positionZ: number;
};

type ChibiMovementRigProps = {
  glbModule: AvatarAnimatedGlbModule;
  arena: LobbyArenaConfig;
  controls: MovementControlState;
  resetKey: number;
  onStatusChange?: (status: ChibiMovementStatus) => void;
};

export function ChibiMovementRig({
  glbModule,
  arena,
  controls,
  resetKey,
  onStatusChange,
}: ChibiMovementRigProps) {
  const bodyRef = useRef<Group>(null);
  const gltf = useGLTF(glbModule as unknown as string, false, false) as GLTF;
  const model = useMemo(() => fitSkinnedChibiClone(gltf.scene), [gltf.scene]);

  const mixerRef = useRef<AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, AnimationAction>>({});
  const activeActionRef = useRef<AnimationAction | null>(null);
  const basePositionRef = useRef(new Vector3());
  const wasMovingRef = useRef(false);
  const activeClipRef = useRef<string>(CHIBI_MOVEMENT_IDLE_CLIP);

  const position = useRef(new Vector3(arena.spawnX, 0, arena.spawnZ));
  const facing = useRef(0);
  const moveDir = useRef(new Vector3());
  const camLook = useRef(new Vector3());
  const moveForward = useRef(new Vector3());
  const moveRight = useRef(new Vector3());
  const desiredCam = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const footBounds = useRef(new Box3());
  const bodyGroundY = useRef(0);
  const cameraDistanceSmoothed = useRef(CAMERA_FOLLOW_DISTANCE_DEFAULT);

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
    position.current.set(arena.spawnX, 0, arena.spawnZ);
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

    cameraDistanceSmoothed.current = controls.cameraDistance;

    reportStatus.current(false);
  }, [arena.spawnX, arena.spawnZ, controls, resetKey]);

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
        const targetFacing = headingYFromMovementDirection(moveDir.current.x, moveDir.current.z);
        facing.current = lerpHeadingY(facing.current, targetFacing, 1 - Math.exp(-10 * delta));
      }
    }

    const maxX = arena.halfExtentX - CHARACTER_RADIUS;
    const maxZ = arena.halfExtentZ - CHARACTER_RADIUS;
    position.current.x = MathUtils.clamp(position.current.x, -maxX, maxX);
    position.current.z = MathUtils.clamp(position.current.z, -maxZ, maxZ);

    for (const obs of arena.obstacles) {
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

    const pitch = input.cameraPitch;
    const yaw = input.cameraYaw;
    const distanceBlend = 1 - Math.exp(-CAMERA_DISTANCE_SMOOTH * delta);
    cameraDistanceSmoothed.current +=
      (input.cameraDistance - cameraDistanceSmoothed.current) * distanceBlend;
    const dist = cameraDistanceSmoothed.current;

    desiredCam.current.set(
      position.current.x - Math.sin(yaw) * Math.cos(pitch) * dist,
      position.current.y + Math.sin(pitch) * dist + CAMERA_Y_ANCHOR,
      position.current.z - Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    lookTarget.current.set(position.current.x, CHIBI_ANIMATED_LOOK_AT_HEIGHT, position.current.z);

    const lerpFactor = 1 - Math.exp(-6 * delta);
    state.camera.position.lerp(desiredCam.current, lerpFactor);
    state.camera.lookAt(lookTarget.current);

    writeLobbySceneFrameSnapshot(
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z,
      lookTarget.current.x,
      lookTarget.current.y,
      lookTarget.current.z,
    );
  });

  return (
    <group ref={bodyRef}>
      <group rotation={[0, CHIBI_ANIMATED_FACING_Y_OFFSET, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}

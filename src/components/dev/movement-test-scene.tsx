'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import '@/lib/r3f-native-bootstrap';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Group, MathUtils, Vector3 } from 'three';

import { ChibiAvatar, CHIBI_LOOK_AT_HEIGHT, type ChibiAnimState } from '@/components/avatar/chibi-avatar';
import { palette } from '@/constants/theme';
import { headingYFromMovementDirection, lerpHeadingY } from '@/lib/avatar-heading';
import type { MovementControlState } from '@/lib/movement-control-state';

const ARENA_HALF = 11;
const MOVE_SPEED = 4.2;
const CHARACTER_RADIUS = 0.45;

const OBSTACLES = [
  { x: -4, z: -3, sx: 1.2, sz: 1.2 },
  { x: 3, z: -5, sx: 1.6, sz: 0.9 },
  { x: -2, z: 4, sx: 0.9, sz: 1.4 },
  { x: 5, z: 3, sx: 1.1, sz: 1.1 },
] as const;

type MovementTestSceneProps = {
  controls: MovementControlState;
  onReady?: () => void;
};

function Environment() {
  return (
    <>
      <color attach="background" args={[palette.navy900]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[6, 10, 4]} intensity={1.05} color={palette.white} />
      <pointLight position={[-4, 3, -2]} intensity={0.55} color={palette.turquoise} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color={palette.navy800} roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[ARENA_HALF - 0.2, ARENA_HALF, 64]} />
        <meshBasicMaterial color={palette.purple} transparent opacity={0.35} />
      </mesh>
      {OBSTACLES.map((obs, index) => (
        <mesh key={index} position={[obs.x, 0.55, obs.z]}>
          <boxGeometry args={[obs.sx, 1.1, obs.sz]} />
          <meshStandardMaterial color={palette.navy700} emissive={palette.purple} emissiveIntensity={0.08} />
        </mesh>
      ))}
    </>
  );
}

function MovementRig({ controls }: { controls: MovementControlState }) {
  const bodyRef = useRef<Group>(null);
  const animState = useMemo<ChibiAnimState>(() => ({ moving: false, phase: 0 }), []);
  const position = useRef(new Vector3(0, 0, 0));
  const facing = useRef(0);
  const moveDir = useRef(new Vector3());
  const camLook = useRef(new Vector3());
  const moveForward = useRef(new Vector3());
  const moveRight = useRef(new Vector3());
  const desiredCam = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());

  useFrame((state, delta) => {
    const input = controls;
    const body = bodyRef.current;
    if (!body) return;

    const mx = input.moveX;
    const my = input.moveY;
    const moving = mx !== 0 || my !== 0;
    animState.moving = moving;
    if (moving) {
      animState.phase += delta * 9;
    }

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
        position.current.x += moveDir.current.x * MOVE_SPEED * delta;
        position.current.z += moveDir.current.z * MOVE_SPEED * delta;
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

    body.position.set(position.current.x, 0, position.current.z);
    body.rotation.y = facing.current;

    const dist = 5.8;
    const pitch = input.cameraPitch;
    const yaw = input.cameraYaw;
    desiredCam.current.set(
      position.current.x - Math.sin(yaw) * Math.cos(pitch) * dist,
      position.current.y + Math.sin(pitch) * dist + 1.2,
      position.current.z - Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    lookTarget.current.set(position.current.x, CHIBI_LOOK_AT_HEIGHT, position.current.z);

    const lerpFactor = 1 - Math.exp(-6 * delta);
    state.camera.position.lerp(desiredCam.current, lerpFactor);
    state.camera.lookAt(lookTarget.current);
  });

  return <ChibiAvatar rootRef={bodyRef} anim={animState} />;
}

export function MovementTestScene({ controls, onReady }: MovementTestSceneProps) {
  return (
    <View style={styles.canvasHost}>
      <Canvas
        style={styles.canvas}
        camera={{ position: [0, 4, 7], fov: 55, near: 0.1, far: 120 }}
        frameloop="always"
        onCreated={(state) => {
          state.gl.setClearColor(palette.navy900);
          onReady?.();
        }}>
        <Environment />
        <MovementRig controls={controls} />
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

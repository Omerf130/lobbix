'use no memo';

/* eslint-disable react/no-unknown-property -- R3F uses Three.js JSX props */
import { useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';
import type { Group } from 'three';
import { MathUtils, MeshStandardMaterial } from 'three';

import { palette } from '@/constants/theme';

/** Eye height for third-person lookAt (world units, feet at y=0). */
export const CHIBI_LOOK_AT_HEIGHT = 1.2;

export type ChibiAnimState = {
  moving: boolean;
  phase: number;
};

type ChibiAvatarProps = {
  rootRef: React.RefObject<Group | null>;
  anim?: ChibiAnimState;
};

const matSkin = new MeshStandardMaterial({
  color: '#EAC7BC',
  roughness: 0.62,
  metalness: 0.02,
});

const matHoodie = new MeshStandardMaterial({
  color: palette.navy700,
  roughness: 0.72,
  metalness: 0.05,
});

const matHoodieTrim = new MeshStandardMaterial({
  color: palette.purple,
  roughness: 0.55,
  emissive: palette.purple,
  emissiveIntensity: 0.12,
});

const matPants = new MeshStandardMaterial({
  color: '#151C30',
  roughness: 0.78,
  metalness: 0.03,
});

const matShoe = new MeshStandardMaterial({
  color: palette.navy800,
  roughness: 0.65,
  metalness: 0.08,
});

const matSole = new MeshStandardMaterial({
  color: palette.turquoise,
  roughness: 0.45,
  emissive: palette.turquoise,
  emissiveIntensity: 0.08,
});

const matHair = new MeshStandardMaterial({
  color: '#2A2040',
  roughness: 0.82,
  metalness: 0.02,
});

const matEyeWhite = new MeshStandardMaterial({ color: '#F8FAFC', roughness: 0.35 });
const matEyeIris = new MeshStandardMaterial({
  color: palette.turquoise,
  roughness: 0.3,
  emissive: palette.turquoise,
  emissiveIntensity: 0.18,
});
const matEyePupil = new MeshStandardMaterial({ color: palette.navy900, roughness: 0.4 });

const LEG_SWING = 0.52;
const ARM_SWING = 0.38;

export function ChibiAvatar({ rootRef, anim }: ChibiAvatarProps) {
  const torsoBob = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const walkBlend = useRef(0);
  const armLeftX = useRef(0);
  const armRightX = useRef(0);
  const legLeftX = useRef(0);
  const legRightX = useRef(0);
  const bobY = useRef(0);

  useFrame((_, delta) => {
    const targetBlend = anim?.moving ? 1 : 0;
    walkBlend.current = MathUtils.lerp(
      walkBlend.current,
      targetBlend,
      1 - Math.exp(-14 * delta),
    );
    const w = walkBlend.current;
    const phase = anim?.phase ?? 0;
    const legSwing = Math.sin(phase) * LEG_SWING * w;
    const armSwing = Math.sin(phase) * ARM_SWING * w;

    const targetLegL = legSwing;
    const targetLegR = -legSwing;
    const targetArmL = -armSwing;
    const targetArmR = armSwing;
    const targetBob = Math.abs(Math.sin(phase * 2)) * 0.012 * w;

    const smooth = 1 - Math.exp(-18 * delta);
    legLeftX.current = MathUtils.lerp(legLeftX.current, targetLegL, smooth);
    legRightX.current = MathUtils.lerp(legRightX.current, targetLegR, smooth);
    armLeftX.current = MathUtils.lerp(armLeftX.current, targetArmL, smooth);
    armRightX.current = MathUtils.lerp(armRightX.current, targetArmR, smooth);
    bobY.current = MathUtils.lerp(bobY.current, targetBob, smooth);

    if (leftLeg.current) leftLeg.current.rotation.x = legLeftX.current;
    if (rightLeg.current) rightLeg.current.rotation.x = legRightX.current;
    if (leftArm.current) leftArm.current.rotation.x = armLeftX.current;
    if (rightArm.current) rightArm.current.rotation.x = armRightX.current;
    if (torsoBob.current) torsoBob.current.position.y = bobY.current;
  });

  return (
    <group ref={rootRef}>
      <group ref={torsoBob}>
        {/* Legs (pivot at hip; swing ±X = forward/back on local -Z) */}
        <group ref={leftLeg} position={[-0.11, 0.24, 0]}>
          <mesh position={[0, -0.1, 0]} material={matPants}>
            <capsuleGeometry args={[0.065, 0.12, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.2, 0.02]} material={matShoe}>
            <boxGeometry args={[0.13, 0.06, 0.19]} />
          </mesh>
          <mesh position={[0, -0.22, 0.09]} material={matSole}>
            <boxGeometry args={[0.12, 0.028, 0.055]} />
          </mesh>
          <mesh position={[0.04, -0.205, 0.05]} rotation={[0, 0, -0.35]} material={matSole}>
            <boxGeometry args={[0.04, 0.012, 0.07]} />
          </mesh>
        </group>
        <group ref={rightLeg} position={[0.11, 0.24, 0]}>
          <mesh position={[0, -0.1, 0]} material={matPants}>
            <capsuleGeometry args={[0.065, 0.12, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.2, 0.02]} material={matShoe}>
            <boxGeometry args={[0.13, 0.06, 0.19]} />
          </mesh>
          <mesh position={[0, -0.22, 0.09]} material={matSole}>
            <boxGeometry args={[0.12, 0.028, 0.055]} />
          </mesh>
          <mesh position={[-0.04, -0.205, 0.05]} rotation={[0, 0, 0.35]} material={matSole}>
            <boxGeometry args={[0.04, 0.012, 0.07]} />
          </mesh>
        </group>

        {/* Torso / hoodie */}
        <mesh position={[0, 0.4, 0]} material={matHoodie}>
          <capsuleGeometry args={[0.2, 0.24, 5, 10]} />
        </mesh>
        <mesh position={[0, 0.54, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={matHoodieTrim}>
          <torusGeometry args={[0.175, 0.028, 8, 16, Math.PI]} />
        </mesh>
        <mesh position={[0, 0.36, 0.16]} rotation={[Math.PI / 2, 0, 0]} material={matHoodie}>
          <circleGeometry args={[0.11, 12]} />
        </mesh>
        <mesh position={[0.07, 0.44, 0.175]} rotation={[Math.PI / 2, 0, 0.12]} material={matSole}>
          <circleGeometry args={[0.04, 10]} />
        </mesh>

        {/* Arms */}
        <group ref={leftArm} position={[-0.27, 0.44, 0]}>
          <mesh material={matHoodie}>
            <capsuleGeometry args={[0.055, 0.11, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.13, 0]} material={matSkin}>
            <sphereGeometry args={[0.05, 8, 8]} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.27, 0.44, 0]}>
          <mesh material={matHoodie}>
            <capsuleGeometry args={[0.055, 0.11, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.13, 0]} material={matSkin}>
            <sphereGeometry args={[0.05, 8, 8]} />
          </mesh>
        </group>

        {/* Head */}
        <mesh position={[0, 0.86, 0]} scale={[1.02, 0.94, 1]} material={matSkin}>
          <sphereGeometry args={[0.3, 16, 16]} />
        </mesh>
        <mesh position={[0, 1.03, -0.03]} scale={[1.04, 0.72, 1.06]} material={matHair}>
          <sphereGeometry args={[0.28, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        </mesh>
        <mesh position={[0, 1.06, 0.06]} rotation={[0.22, 0, 0]} material={matHair}>
          <boxGeometry args={[0.2, 0.055, 0.1]} />
        </mesh>

        {/* Face on local -Z (front) */}
        <group position={[0, 0.84, -0.27]}>
          <mesh position={[-0.095, 0.025, 0]} material={matEyeWhite}>
            <sphereGeometry args={[0.058, 10, 10]} />
          </mesh>
          <mesh position={[0.095, 0.025, 0]} material={matEyeWhite}>
            <sphereGeometry args={[0.058, 10, 10]} />
          </mesh>
          <mesh position={[-0.095, 0.012, -0.032]} material={matEyeIris}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.095, 0.012, -0.032]} material={matEyeIris}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[-0.095, 0.008, -0.048]} material={matEyePupil}>
            <sphereGeometry args={[0.015, 6, 6]} />
          </mesh>
          <mesh position={[0.095, 0.008, -0.048]} material={matEyePupil}>
            <sphereGeometry args={[0.015, 6, 6]} />
          </mesh>
          <mesh position={[0, -0.04, -0.02]} material={matSkin}>
            <sphereGeometry args={[0.028, 8, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

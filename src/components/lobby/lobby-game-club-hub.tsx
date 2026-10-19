'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useLoader } from '@react-three/fiber/native';
import { AdditiveBlending, TextureLoader } from 'three';

import { lobbyMat } from '@/components/lobby/lobby-shared-materials';
import { palette } from '@/constants/theme';
import { GAME_CLUB_NEON_SIGN_TEXTURE } from '@/lib/lobby/game-club-sign-model';
import logoGlow from '@/assets/images/logo-glow.png';

/** Billboard size in meters — readable from spawn with three portals below. */
const SIGN_PLANE_SIZE = 2.35;

type LobbyGameClubHubProps = {
  signZ: number;
};

export function LobbyGameClubHub({ signZ }: LobbyGameClubHubProps) {
  return (
    <group position={[0, 0, signZ]}>
      <LobbyGameClubSignBay />
      <GameClubNeonSignBillboard />
    </group>
  );
}

function LobbyGameClubSignBay() {
  const bayW = 4.05;
  const wallH = 2.65;
  const wallY = wallH / 2 + 0.35;

  return (
    <group>
      <mesh position={[0, wallY, -0.12]} material={lobbyMat.hubRecess}>
        <boxGeometry args={[bayW, wallH, 0.22]} />
      </mesh>
      <mesh position={[0, wallY, -0.04]}>
        <boxGeometry args={[bayW * 0.92, wallH * 0.88, 0.06]} />
        <meshLambertMaterial color="#080c14" emissive={palette.purple} emissiveIntensity={0.16} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`sign-trim-${side}`} position={[side * (bayW / 2 + 0.04), wallY, 0.02]}>
          <boxGeometry args={[0.05, wallH * 0.92, 0.04]} />
          <meshBasicMaterial
            color={side < 0 ? palette.turquoise : palette.pink}
            toneMapped={false}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
      <mesh position={[0, wallH + 0.22, 0.04]}>
        <boxGeometry args={[bayW + 0.15, 0.07, 0.05]} />
        <meshBasicMaterial color={palette.purple} toneMapped={false} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function GameClubNeonSignBillboard() {
  const signTex = useLoader(TextureLoader, GAME_CLUB_NEON_SIGN_TEXTURE as unknown as string);
  const glowTex = useLoader(TextureLoader, logoGlow as unknown as string);

  return (
    <group position={[0, 2.42, 0.22]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[SIGN_PLANE_SIZE * 1.12, SIGN_PLANE_SIZE * 1.12]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          toneMapped={false}
          blending={AdditiveBlending}
          depthWrite={false}
          opacity={0.32}
          color={palette.purple}
        />
      </mesh>
      <mesh>
        <planeGeometry args={[SIGN_PLANE_SIZE, SIGN_PLANE_SIZE]} />
        <meshBasicMaterial
          map={signTex}
          transparent
          toneMapped={false}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useLoader } from '@react-three/fiber/native';
import { AdditiveBlending, TextureLoader } from 'three';

import { lobbyMat } from '@/components/lobby/lobby-shared-materials';
import { palette } from '@/constants/theme';
import { GAME_CLUB_NEON_SIGN_TEXTURE } from '@/lib/lobby/game-club-sign-model';
import logoGlow from '@/assets/images/logo-glow.png';

/** Billboard size in meters — tuned for spawn readability. */
const SIGN_PLANE_SIZE = 2.55;

type LobbyGameClubHubProps = {
  signZ: number;
  corridorHalfWidth: number;
};

export function LobbyGameClubHub({ signZ, corridorHalfWidth }: LobbyGameClubHubProps) {
  const bayHalfW = Math.min(2.45, corridorHalfWidth + 0.05);

  return (
    <group position={[0, 0, signZ]}>
      <LobbyHubPlaza bayHalfW={bayHalfW} />
      <LobbyGameClubFeatureWall bayHalfW={bayHalfW} />
      <GameClubNeonSignBillboard />
    </group>
  );
}

function LobbyGameClubFeatureWall({ bayHalfW }: { bayHalfW: number }) {
  const wallH = 3.05;
  const wallY = wallH / 2;

  return (
    <group>
      {/* Outer frame */}
      <mesh position={[0, wallY, -0.18]} material={lobbyMat.hubRecess}>
        <boxGeometry args={[bayHalfW * 2 + 1.35, wallH, 0.28]} />
      </mesh>

      {/* Side vertical panels */}
      {[-1, 1].map((side) => (
        <group key={`bay-side-${side}`}>
          <mesh position={[side * (bayHalfW + 0.42), wallY, -0.08]} material={lobbyMat.hubPillar}>
            <boxGeometry args={[0.22, wallH * 0.92, 0.14]} />
          </mesh>
          <mesh position={[side * (bayHalfW + 0.38), wallY, -0.02]}>
            <boxGeometry args={[0.06, wallH * 0.85, 0.04]} />
            <meshBasicMaterial
              color={side < 0 ? palette.turquoise : palette.pink}
              toneMapped={false}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      ))}

      {/* Recessed sign bay (dark navy) */}
      <mesh position={[0, 1.55, -0.06]}>
        <boxGeometry args={[bayHalfW * 2 + 0.35, 2.35, 0.12]} />
        <meshLambertMaterial color="#080c14" emissive={palette.purple} emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[0, 1.55, -0.01]}>
        <boxGeometry args={[bayHalfW * 2 + 0.12, 2.05, 0.04]} />
        <meshBasicMaterial color="#050810" toneMapped={false} />
      </mesh>

      {/* Header trim + subtle panel lines */}
      <mesh position={[0, 2.78, 0.02]}>
        <boxGeometry args={[bayHalfW * 2 + 0.5, 0.08, 0.05]} />
        <meshBasicMaterial color="#1a2238" toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.78, 0.05]}>
        <boxGeometry args={[bayHalfW * 2 + 0.2, 0.035, 0.025]} />
        <meshBasicMaterial color={palette.purple} toneMapped={false} transparent opacity={0.45} />
      </mesh>
      {[-0.9, 0.9].map((yOff) => (
        <mesh key={`panel-line-${yOff}`} position={[0, 1.55 + yOff, 0.04]}>
          <boxGeometry args={[bayHalfW * 2 + 0.05, 0.025, 0.012]} />
          <meshBasicMaterial color="#252f48" toneMapped={false} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Walk-through portal — open center below sign */}
      <pointLight position={[0, 2.45, 0.55]} intensity={0.7} color={palette.turquoise} distance={7} />
      <pointLight position={[0, 1.4, 0.45]} intensity={0.28} color={palette.purple} distance={5} />
    </group>
  );
}

function GameClubNeonSignBillboard() {
  const signTex = useLoader(TextureLoader, GAME_CLUB_NEON_SIGN_TEXTURE as unknown as string);
  const glowTex = useLoader(TextureLoader, logoGlow as unknown as string);

  return (
    <group position={[0, 2.38, 0.28]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[SIGN_PLANE_SIZE * 1.15, SIGN_PLANE_SIZE * 1.15]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          toneMapped={false}
          blending={AdditiveBlending}
          depthWrite={false}
          opacity={0.35}
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

function LobbyHubPlaza({ bayHalfW }: { bayHalfW: number }) {
  const plazaW = bayHalfW * 2 + 0.55;
  const approachDepth = 2.1;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0.45]} material={lobbyMat.hubPlaza}>
        <planeGeometry args={[plazaW, approachDepth]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, -0.25]}>
        <ringGeometry args={[0.95, plazaW * 0.46, 32]} />
        <meshBasicMaterial
          color={palette.turquoise}
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0.45]} material={lobbyMat.floorHubLine}>
        <planeGeometry args={[0.08, approachDepth * 0.88]} />
      </mesh>
    </group>
  );
}

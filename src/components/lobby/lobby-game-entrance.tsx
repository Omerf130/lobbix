'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { LobbyDotMatrixSign } from '@/components/lobby/lobby-dot-matrix-sign';
import type { GameEntranceTheme } from '@/lib/lobby/lobby-club-layout';

type LobbyGameEntranceProps = {
  entrance: GameEntranceTheme;
  wallX: number;
};

/**
 * Recessed game alcove with neon frame + dot-matrix title (no logos / textures).
 */
export function LobbyGameEntrance({ entrance, wallX }: LobbyGameEntranceProps) {
  const signX = entrance.side === 'left' ? wallX + 0.95 : wallX - 0.95;
  const facing = entrance.side === 'left' ? Math.PI / 2 : -Math.PI / 2;
  const alcoveDepth = 1.05;
  const alcoveCenterX = entrance.side === 'left' ? wallX + alcoveDepth / 2 : wallX - alcoveDepth / 2;

  return (
    <group position={[0, 0, entrance.z]}>
      <mesh position={[alcoveCenterX, 1.05, 0]}>
        <boxGeometry args={[alcoveDepth, 2.15, 2.35]} />
        <meshLambertMaterial color="#0A1020" emissive={entrance.accentDim} emissiveIntensity={0.22} />
      </mesh>

      <mesh position={[alcoveCenterX, 0.06, 0]}>
        <boxGeometry args={[alcoveDepth + 0.05, 0.08, 2.45]} />
        <meshBasicMaterial color={entrance.accent} toneMapped={false} transparent opacity={0.4} />
      </mesh>

      <mesh position={[signX, 2.05, 0]} rotation={[0, facing, 0]}>
        <boxGeometry args={[2.5, 0.55, 0.08]} />
        <meshLambertMaterial color="#121829" emissive={entrance.accent} emissiveIntensity={0.25} />
      </mesh>

      <group position={[signX, 2.05, 0.06]} rotation={[0, facing, 0]}>
        <LobbyDotMatrixSign text={entrance.label} color={entrance.glow} scale={0.85} />
      </group>

      <mesh position={[signX, 1.05, 0.02]} rotation={[0, facing, 0]}>
        <boxGeometry args={[1.55, 2.05, 0.12]} />
        <meshBasicMaterial color={entrance.accentDim} toneMapped={false} transparent opacity={0.85} />
      </mesh>

      <mesh position={[signX, 1.05, -0.08]} rotation={[0, facing, 0]}>
        <boxGeometry args={[1.75, 2.25, 0.06]} />
        <meshBasicMaterial color={entrance.glow} toneMapped={false} />
      </mesh>

      <mesh position={[signX, 1.05, -0.2]} rotation={[0, facing, 0]}>
        <boxGeometry args={[1.35, 1.65, 0.04]} />
        <meshBasicMaterial color="#050810" toneMapped={false} />
      </mesh>
    </group>
  );
}

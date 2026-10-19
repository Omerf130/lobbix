'use no memo';

/* eslint-disable react/no-unknown-property -- R3F JSX */
import { useMemo } from 'react';

/** 5×7 dot patterns (rows top→bottom, bits left→right). */
const GLYPH: Record<string, number[]> = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '2': [0b01110, 0b00001, 0b00110, 0b01000, 0b01111, 0, 0],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0],
  B: [0b11110, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110, 0],
  C: [0b01111, 0b10000, 0b10000, 0b10000, 0b10000, 0b01111, 0],
  E: [0b11111, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111, 0],
  F: [0b11111, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000, 0],
  G: [0b01111, 0b10000, 0b10011, 0b10001, 0b10001, 0b01111, 0],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111, 0],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111, 0],
  M: [0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b10001, 0],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110, 0],
  R: [0b11110, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001, 0],
  S: [0b01111, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110, 0],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110, 0],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100, 0],
};

const DOT = 0.11;
const GAP = 0.13;

type LobbyDotMatrixSignProps = {
  text: string;
  color: string;
  position?: [number, number, number];
  scale?: number;
};

export function LobbyDotMatrixSign({
  text,
  color,
  position = [0, 0, 0],
  scale = 1,
}: LobbyDotMatrixSignProps) {
  const dots = useMemo(() => {
    const upper = text.toUpperCase();
    const out: { x: number; y: number; key: string }[] = [];
    let cursorX = 0;
    for (let ci = 0; ci < upper.length; ci += 1) {
      const ch = upper[ci] ?? ' ';
      const rows = GLYPH[ch] ?? GLYPH[' '];
      for (let row = 0; row < 7; row += 1) {
        const bits = rows[row] ?? 0;
        for (let col = 0; col < 5; col += 1) {
          if (bits & (1 << (4 - col))) {
            out.push({
              x: cursorX + col * GAP,
              y: (6 - row) * GAP,
              key: `${ci}-${row}-${col}`,
            });
          }
        }
      }
      cursorX += 6 * GAP;
    }
    const width = cursorX;
    return out.map((d) => ({
      ...d,
      x: d.x - width / 2,
    }));
  }, [text]);

  return (
    <group position={position} scale={scale}>
      {dots.map((d) => (
        <mesh key={d.key} position={[d.x, d.y, 0]}>
          <boxGeometry args={[DOT, DOT, DOT * 0.6]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

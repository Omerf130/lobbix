import { MeshBasicMaterial, MeshLambertMaterial, MeshStandardMaterial } from 'three';

import { palette } from '@/constants/theme';

/** Reused materials — fewer GPU program switches on mobile. */
export const lobbyMat = {
  floorA: new MeshStandardMaterial({
    color: '#1a2540',
    roughness: 0.34,
    metalness: 0.3,
    emissive: '#121828',
    emissiveIntensity: 0.1,
  }),
  floorB: new MeshStandardMaterial({
    color: '#141e34',
    roughness: 0.3,
    metalness: 0.32,
    emissive: '#0e1424',
    emissiveIntensity: 0.11,
  }),
  floorHubLine: new MeshBasicMaterial({
    color: palette.turquoise,
    transparent: true,
    opacity: 0.14,
    toneMapped: false,
  }),
  floorHubGlow: new MeshBasicMaterial({
    color: palette.purple,
    transparent: true,
    opacity: 0.08,
    toneMapped: false,
  }),
  wall: new MeshLambertMaterial({
    color: palette.navy800,
    emissive: palette.purple,
    emissiveIntensity: 0.16,
  }),
  wallDeep: new MeshLambertMaterial({
    color: '#0F1628',
    emissive: '#2A1848',
    emissiveIntensity: 0.12,
  }),
  /** Boundary shells — opacity driven by camera occlusion fade. */
  boundaryLeftShell: new MeshLambertMaterial({
    color: '#0F1628',
    emissive: '#2A1848',
    emissiveIntensity: 0.12,
    transparent: true,
    opacity: 1,
  }),
  boundaryRightShell: new MeshLambertMaterial({
    color: '#0F1628',
    emissive: '#2A1848',
    emissiveIntensity: 0.12,
    transparent: true,
    opacity: 1,
  }),
  boundaryFarShell: new MeshLambertMaterial({
    color: palette.navy800,
    emissive: palette.purple,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity: 1,
  }),
  boundaryLeftPanel: new MeshLambertMaterial({
    color: '#151d30',
    emissive: '#1a1040',
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 1,
  }),
  boundaryRightPanel: new MeshLambertMaterial({
    color: '#151d30',
    emissive: '#1a1040',
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 1,
  }),
  boundaryLeftTrim: new MeshBasicMaterial({
    color: '#252f48',
    toneMapped: false,
    transparent: true,
    opacity: 1,
  }),
  boundaryRightTrim: new MeshBasicMaterial({
    color: '#252f48',
    toneMapped: false,
    transparent: true,
    opacity: 1,
  }),
  boundaryFarAccent: new MeshBasicMaterial({
    color: palette.purple,
    toneMapped: false,
    transparent: true,
    opacity: 0.25,
  }),
  wallPanel: new MeshLambertMaterial({
    color: '#151d30',
    emissive: '#1a1040',
    emissiveIntensity: 0.1,
  }),
  wallTrim: new MeshBasicMaterial({ color: '#252f48', toneMapped: false }),
  beam: new MeshLambertMaterial({
    color: palette.navy700,
    emissive: palette.purple,
    emissiveIntensity: 0.1,
  }),
  archFrame: new MeshLambertMaterial({
    color: '#0E1424',
    emissive: palette.purple,
    emissiveIntensity: 0.22,
  }),
  hubPillar: new MeshLambertMaterial({
    color: '#121a2c',
    emissive: '#2a1848',
    emissiveIntensity: 0.14,
  }),
  hubRecess: new MeshLambertMaterial({
    color: '#0a0e18',
    emissive: palette.purple,
    emissiveIntensity: 0.12,
  }),
  hubPlaza: new MeshStandardMaterial({
    color: '#1e2844',
    roughness: 0.36,
    metalness: 0.28,
    emissive: '#141c38',
    emissiveIntensity: 0.11,
  }),
  desk: new MeshLambertMaterial({
    color: palette.navy700,
    emissive: palette.navy700,
    emissiveIntensity: 0.05,
  }),
  monitor: new MeshBasicMaterial({ color: '#0A0E18' }),
  monitorGlow: new MeshBasicMaterial({
    color: palette.turquoise,
    transparent: true,
    opacity: 0.55,
  }),
  bench: new MeshLambertMaterial({
    color: '#1E2844',
    emissive: palette.purple,
    emissiveIntensity: 0.06,
  }),
  plantPot: new MeshLambertMaterial({ color: palette.navy800 }),
  plant: new MeshLambertMaterial({
    color: '#2D6B4F',
    emissive: '#1F4A38',
    emissiveIntensity: 0.12,
  }),
  warmAccent: new MeshBasicMaterial({ color: '#FFB86A', toneMapped: false }),
} as const;

export function neonBasic(hex: string, opacity = 1): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: hex,
    transparent: opacity < 1,
    opacity,
    toneMapped: false,
  });
}

import { useGLTF } from '@react-three/drei/native';

import gamingStationGlb from '@/assets/lobby/gaming/gaming-station.glb';

/** Metro asset module — Meshy stylized gaming station (4B.2B). */
export const LOBBY_GAMING_STATION_GLB: number = gamingStationGlb;

export function preloadLobbyGamingStationGlb(): void {
  useGLTF.preload(LOBBY_GAMING_STATION_GLB as unknown as string, false, false);
}

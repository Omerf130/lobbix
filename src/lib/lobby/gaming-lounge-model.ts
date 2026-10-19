import { useGLTF } from '@react-three/drei/native';

import gamingLoungeGlb from '@/assets/lobby/lounge/gaming-lounge.glb';

export const LOBBY_GAMING_LOUNGE_GLB: number = gamingLoungeGlb;

export function preloadLobbyGamingLoungeGlb(): void {
  useGLTF.preload(LOBBY_GAMING_LOUNGE_GLB as unknown as string, false, false);
}

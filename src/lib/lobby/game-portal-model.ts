import { useGLTF } from '@react-three/drei/native';

import gamePortalGlb from '@/assets/lobby/lounge/game-portal.glb';

export const LOBBY_GAME_PORTAL_GLB: number = gamePortalGlb;

export function preloadLobbyGamePortalGlb(): void {
  useGLTF.preload(LOBBY_GAME_PORTAL_GLB as unknown as string, false, false);
}

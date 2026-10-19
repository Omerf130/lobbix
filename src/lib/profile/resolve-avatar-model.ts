import { useGLTF } from '@react-three/drei/native';

import { CHIBI_MALE_ANIMATED_GLB } from '@/lib/dev/chibi-male-animated-model';
import {
  AVATAR_ID_CHIBI_MALE_V1,
  DEFAULT_AVATAR_ID,
  isKnownAvatarId,
  type AvatarId,
} from '@/lib/profile/avatar-catalog';

/** Metro asset module for animated GLB (Expo `require` id). */
export type AvatarAnimatedGlbModule = typeof CHIBI_MALE_ANIMATED_GLB;

export function resolveAvatarIdFromProfile(stored: string | undefined | null): AvatarId {
  return isKnownAvatarId(stored) ? stored : DEFAULT_AVATAR_ID;
}

/** Maps persisted avatar id → animated GLB module for R3F `useGLTF`. */
export function resolveAvatarAnimatedGlbModule(avatarId: AvatarId): AvatarAnimatedGlbModule {
  switch (avatarId) {
    case AVATAR_ID_CHIBI_MALE_V1:
      return CHIBI_MALE_ANIMATED_GLB;
    default: {
      const exhaustive: never = avatarId;
      return exhaustive;
    }
  }
}

export function preloadAvatarAnimatedGlbModule(module: AvatarAnimatedGlbModule): void {
  useGLTF.preload(module as unknown as string, false, false);
}

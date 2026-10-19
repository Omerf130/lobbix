/** Stable IDs for persisted avatar selection (no runtime GLB URLs). */
export const AVATAR_ID_CHIBI_MALE_V1 = 'chibi-male-v1' as const;

export type AvatarId = typeof AVATAR_ID_CHIBI_MALE_V1;

export const DEFAULT_AVATAR_ID: AvatarId = AVATAR_ID_CHIBI_MALE_V1;

export function isKnownAvatarId(value: string | undefined | null): value is AvatarId {
  return value === AVATAR_ID_CHIBI_MALE_V1;
}

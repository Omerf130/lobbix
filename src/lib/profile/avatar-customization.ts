import { palette } from '@/constants/theme';

export const HAIR_COLOR_OPTIONS = ['darkBrown', 'lightBrown', 'blonde', 'purple'] as const;
export type HairColorId = (typeof HAIR_COLOR_OPTIONS)[number];

export const CLOTHING_COLOR_OPTIONS = ['navy', 'purple', 'turquoise', 'pink'] as const;
export type ClothingColorId = (typeof CLOTHING_COLOR_OPTIONS)[number];

export const SHOES_COLOR_OPTIONS = ['turquoise', 'white', 'purple', 'black'] as const;
export type ShoesColorId = (typeof SHOES_COLOR_OPTIONS)[number];

export type AvatarCustomization = {
  hairColor: HairColorId;
  clothingColor: ClothingColorId;
  shoesColor: ShoesColorId;
};

export const DEFAULT_AVATAR_CUSTOMIZATION: AvatarCustomization = {
  hairColor: 'darkBrown',
  clothingColor: 'navy',
  shoesColor: 'turquoise',
};

const HAIR_HEX: Record<HairColorId, string> = {
  darkBrown: '#3D2914',
  lightBrown: '#8B6914',
  blonde: '#D4A574',
  purple: palette.purple,
};

const CLOTHING_HEX: Record<ClothingColorId, string> = {
  navy: palette.navy700,
  purple: palette.purple,
  turquoise: palette.turquoise,
  pink: palette.pink,
};

const SHOES_HEX: Record<ShoesColorId, string> = {
  turquoise: palette.turquoise,
  white: palette.white,
  purple: palette.purple,
  black: palette.navy900,
};

export function resolveHairHex(id: HairColorId): string {
  return HAIR_HEX[id];
}

export function resolveClothingHex(id: ClothingColorId): string {
  return CLOTHING_HEX[id];
}

export function resolveShoesHex(id: ShoesColorId): string {
  return SHOES_HEX[id];
}

export function normalizeAvatarCustomization(
  value: Partial<AvatarCustomization> | undefined | null,
): AvatarCustomization {
  return {
    hairColor:
      value?.hairColor && HAIR_COLOR_OPTIONS.includes(value.hairColor)
        ? value.hairColor
        : DEFAULT_AVATAR_CUSTOMIZATION.hairColor,
    clothingColor:
      value?.clothingColor && CLOTHING_COLOR_OPTIONS.includes(value.clothingColor)
        ? value.clothingColor
        : DEFAULT_AVATAR_CUSTOMIZATION.clothingColor,
    shoesColor:
      value?.shoesColor && SHOES_COLOR_OPTIONS.includes(value.shoesColor)
        ? value.shoesColor
        : DEFAULT_AVATAR_CUSTOMIZATION.shoesColor,
  };
}

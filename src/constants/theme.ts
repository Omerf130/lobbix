/**
 * LOBBIX design tokens — premium dark gaming baseline (Checkpoint 1).
 */

export const palette = {
  navy900: '#0B1020',
  navy800: '#121829',
  navy700: '#1A2238',
  purple: '#9B5DE5',
  turquoise: '#00F5D4',
  pink: '#F15BB5',
  white: '#F4F7FB',
  muted: '#8B95A8',
  border: 'rgba(155, 93, 229, 0.25)',
} as const;

export const Colors = {
  dark: {
    text: palette.white,
    textSecondary: palette.muted,
    background: palette.navy900,
    backgroundElement: palette.navy800,
    backgroundSelected: palette.navy700,
    accentPurple: palette.purple,
    accentTurquoise: palette.turquoise,
    accentPink: palette.pink,
    border: palette.border,
  },
} as const;

export type ThemeColor = keyof typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Typography = {
  hero: { fontSize: 40, lineHeight: 48, fontWeight: '700' as const },
  title: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  subtitle: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
  badge: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const },
} as const;

/** Max readable width for Hebrew body copy on large phones / web. */
export const MaxContentWidth = 420;

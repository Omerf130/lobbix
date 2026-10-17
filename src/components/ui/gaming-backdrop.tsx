import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { WelcomeImages } from '@/constants/welcome-images';
import { palette } from '@/constants/theme';

type GamingBackdropProps = {
  /** 0–1 navy overlay on top of the background image. */
  dim?: number;
};

export function GamingBackdrop({ dim = 0.68 }: GamingBackdropProps) {
  return (
    <>
      <Image
        source={WelcomeImages.background}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(11, 16, 32, ${dim})` }]}
      />
      <View pointerEvents="none" style={styles.glowPurple} />
      <View pointerEvents="none" style={styles.glowTurquoise} />
    </>
  );
}

const styles = StyleSheet.create({
  glowPurple: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    end: -60,
    top: -30,
    backgroundColor: palette.purple,
    opacity: 0.12,
  },
  glowTurquoise: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    start: -40,
    bottom: 120,
    backgroundColor: palette.turquoise,
    opacity: 0.08,
  },
});

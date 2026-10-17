import { Image, type ImageStyle } from 'expo-image';
import { StyleSheet, View, type StyleProp } from 'react-native';

import { WelcomeImages } from '@/constants/welcome-images';

type LobbixLogoProps = {
  width: number;
  style?: StyleProp<ImageStyle>;
};

/** PNG logo — opaque black matte behind the neon mark (not transparent). */
export function LobbixLogo({ width, style }: LobbixLogoProps) {
  const height = width * 0.42;

  return (
    <View style={[styles.frame, { width, height }]}>
      <Image
        source={WelcomeImages.logo}
        style={[styles.image, { width, height }, style]}
        contentFit="contain"
        accessibilityLabel="LOBBIX"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: 'transparent',
  },
});

import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { palette, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { openDevMenu } from '@/lib/dev/open-dev-menu';
import { PHYSICAL_LTR_OVERLAY } from '@/lib/touch-control-layout';

/** __DEV__ only — opens LOBBIX `/dev` tools (not the Expo Go dev menu). Render last in SafeAreaView. */
export function DevMenuGear() {
  const strings = getStrings();

  const handlePress = useCallback(() => {
    openDevMenu();
  }, []);

  if (!__DEV__) {
    return null;
  }

  return (
    <View style={[styles.row, PHYSICAL_LTR_OVERLAY]} pointerEvents="box-none" collapsable={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={strings.devMenuOpen}
        accessibilityHint={strings.devMenuHint}
        hitSlop={12}
        onPress={handlePress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <ThemedText type="subtitle" themeColor="textSecondary" style={styles.icon}>
          ⚙
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.md,
    zIndex: 200,
    elevation: 200,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 24, 41, 0.92)',
    borderWidth: 1,
    borderColor: palette.turquoise,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  icon: {
    lineHeight: 28,
    fontSize: 22,
  },
});

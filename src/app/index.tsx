import Constants from 'expo-constants';
import { useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';

export default function WelcomeScreen() {
  const strings = getStrings();
  const { width, height } = useWindowDimensions();

  const layout = useMemo(() => {
    const isCompact = height < 700 || width < 360;
    const horizontalPadding = Math.max(Spacing.md, Math.min(width * 0.08, Spacing.xl));

    return {
      isCompact,
      horizontalPadding,
      heroSize: isCompact ? 32 : width > 400 ? 44 : 40,
      contentMaxWidth: Math.min(width - horizontalPadding * 2, MaxContentWidth),
    };
  }, [width, height]);

  const expoSdk = Constants.expoConfig?.sdkVersion ?? '58';

  return (
    <ThemedView style={styles.root}>
      <View
        pointerEvents="none"
        style={[styles.glowPurple, { top: layout.isCompact ? -80 : -40 }]}
      />
      <View
        pointerEvents="none"
        style={[styles.glowTurquoise, { bottom: layout.isCompact ? -100 : -60 }]}
      />

      <SafeAreaView style={[styles.safeArea, { paddingHorizontal: layout.horizontalPadding }]}>
        <View style={[styles.content, { maxWidth: layout.contentMaxWidth }]}>
          <View style={styles.badge}>
            <ThemedText type="badge" themeColor="accentTurquoise">
              {strings.baselineBadge}
            </ThemedText>
          </View>

          <ThemedText
            type="hero"
            style={[styles.brand, { fontSize: layout.heroSize, lineHeight: layout.heroSize + 8 }]}
            accessibilityRole="header">
            LOBBIX
          </ThemedText>

          <ThemedText type="subtitle" themeColor="accentPurple" style={styles.tagline}>
            {strings.tagline}
          </ThemedText>

          <ThemedText type="body" themeColor="textSecondary" style={styles.description}>
            {strings.description}
          </ThemedText>

          <View style={styles.footer}>
            <ThemedText type="caption" themeColor="textSecondary">
              {strings.sdkLabel} {expoSdk}
              {Platform.OS !== 'web' ? ` · ${Platform.OS}` : ''}
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.navy800,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  brand: {
    alignSelf: 'stretch',
    textAlign: 'right',
    letterSpacing: 2,
  },
  tagline: {
    alignSelf: 'stretch',
    textAlign: 'right',
  },
  description: {
    alignSelf: 'stretch',
    textAlign: 'right',
  },
  footer: {
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
  },
  glowPurple: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    end: -80,
    backgroundColor: palette.purple,
    opacity: 0.12,
  },
  glowTurquoise: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    start: -60,
    backgroundColor: palette.turquoise,
    opacity: 0.08,
  },
});

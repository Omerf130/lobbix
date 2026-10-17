import { Link, Redirect, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GamingBackdrop } from '@/components/ui/gaming-backdrop';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';

export default function DevMenuScreen() {
  const strings = getStrings();

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ThemedView style={styles.root}>
      <GamingBackdrop dim={0.82} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>
            {strings.devSectionLabel}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.subtitle}>
            {strings.devMenuSubtitle}
          </ThemedText>
          <Link href={'/dev/3d-test' as Href} asChild>
            <LobbixButton label={strings.dev3dButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/dev/movement-test' as Href} asChild>
            <LobbixButton label={strings.devMovementButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/dev/glb-test' as Href} asChild>
            <LobbixButton label={strings.devGlbTestButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/dev/chibi-test' as Href} asChild>
            <LobbixButton label={strings.devChibiTestButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/dev/chibi-animated-test' as Href} asChild>
            <LobbixButton label={strings.devChibiAnimatedTestButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/dev/chibi-movement-test' as Href} asChild>
            <LobbixButton label={strings.devChibiMovementButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/onboarding/avatar' as Href} asChild>
            <LobbixButton label={strings.devAvatarCustomizeButton} variant="secondary" fullWidth />
          </Link>
          <Link href={'/' as Href} asChild>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.backLink, pressed && styles.backLinkPressed]}>
              <ThemedText type="caption" themeColor="accentTurquoise">
                {strings.backToWelcome}
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.9)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  title: {
    textAlign: 'right',
  },
  subtitle: {
    textAlign: 'right',
  },
  backLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  backLinkPressed: {
    opacity: 0.85,
  },
});

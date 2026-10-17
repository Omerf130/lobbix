import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';

export default function TemporaryHomeScreen() {
  const strings = getStrings();

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>
            {strings.homeTitle}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.body}>
            {strings.homeSubtitle}
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.body}>
            {strings.homeContinueHint}
          </ThemedText>
          <Link href="/" asChild>
            <LobbixButton label={strings.backToWelcome} variant="secondary" />
          </Link>
          {__DEV__ ? (
            <View style={styles.devBlock}>
              <ThemedText type="caption" themeColor="accentPurple" style={styles.devLabel}>
                {strings.devSectionLabel}
              </ThemedText>
              <Link href={'/dev/movement-test' as Href} asChild>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.devLink, pressed && styles.devLinkPressed]}>
                  <ThemedText type="caption" themeColor="accentTurquoise">
                    {strings.devMovementButton}
                  </ThemedText>
                </Pressable>
              </Link>
            </View>
          ) : null}
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
    backgroundColor: palette.navy800,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  title: {
    textAlign: 'right',
  },
  body: {
    textAlign: 'right',
  },
  devBlock: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'stretch',
  },
  devLabel: {
    textAlign: 'right',
  },
  devLink: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.navy700,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  devLinkPressed: {
    opacity: 0.88,
  },
});

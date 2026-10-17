import { Image } from 'expo-image';
import { Link, router, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LobbixButton } from '@/components/ui/lobbix-button';
import { LobbixLogo } from '@/components/ui/lobbix-logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WelcomeImages } from '@/constants/welcome-images';
import { palette, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { DevMenuGear } from '@/components/dev/dev-menu-gear';
import { getResumeOnboardingHref } from '@/lib/onboarding/resume-route';

export default function WelcomeScreen() {
  const strings = getStrings();
  const { width, height } = useWindowDimensions();
  const [bootReady, setBootReady] = useState(false);

  const layout = useMemo(() => {
    const isCompact = height < 700 || width < 360;
    const horizontalPadding = Math.max(Spacing.md, Math.min(width * 0.06, Spacing.lg));
    const logoWidth = Math.min(width * 0.58, 280);
    const charactersHeight = Math.min(Math.max(height * (isCompact ? 0.4 : 0.48), 230), 480);

    return {
      horizontalPadding,
      logoWidth,
      charactersHeight,
    };
  }, [width, height]);

  useEffect(() => {
    let active = true;
    getResumeOnboardingHref().then((href) => {
      if (!active) return;
      if (href) router.replace(href);
      setBootReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!bootReady) {
    return <ThemedView style={styles.root} />;
  }

  return (
    <ThemedView style={styles.root}>
      <Image
        source={WelcomeImages.background}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <View pointerEvents="none" style={styles.screenScrim} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: layout.horizontalPadding, minHeight: height - Spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topBrand}>
            <LobbixLogo width={layout.logoWidth} />
            <ThemedText type="subtitle" themeColor="accentPurple" style={styles.tagline}>
              {strings.tagline}
            </ThemedText>
          </View>

          <View style={[styles.charactersStage, { minHeight: layout.charactersHeight }]}>
            <Image
              source={WelcomeImages.characters}
              style={[styles.characters, { height: layout.charactersHeight }]}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
          </View>

          <View style={styles.bottomActions}>
            <Link href={'/register' as Href} asChild>
              <LobbixButton label={strings.welcomePrimaryCta} variant="primary" fullWidth />
            </Link>
            <Link href={'/login' as Href} asChild>
              <LobbixButton label={strings.welcomeSecondaryCta} variant="secondary" fullWidth />
            </Link>
          </View>
        </ScrollView>
        <DevMenuGear />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.navy900,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: 0,
    paddingTop: Spacing.xs,
  },
  screenScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 16, 32, 0.28)',
  },
  topBrand: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: -Spacing.sm,
  },
  tagline: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  charactersStage: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: -Spacing.xs,
    marginBottom: -Spacing.md,
  },
  characters: {
    width: '100%',
    maxWidth: 560,
  },
  bottomActions: {
    width: '100%',
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
});

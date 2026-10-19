import { Link, router, type Href } from 'expo-router';
import { Fragment, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingScreenShell } from '@/components/ui/onboarding-screen-shell';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { openDevMenu } from '@/lib/dev/open-dev-menu';
import { loadLocalProfile } from '@/lib/profile/profile-storage';

export default function GamesOnboardingPlaceholderScreen() {
  const strings = getStrings();

  useEffect(() => {
    loadLocalProfile().then((profile) => {
      if (!profile?.onboarding.profileCompleted) {
        router.replace('/onboarding/profile' as Href);
        return;
      }
      if (!profile.onboarding.avatarStepCompleted) {
        router.replace('/onboarding/avatar' as Href);
        return;
      }
      router.replace('/onboarding/complete' as Href);
    });
  }, []);

  return (
    <OnboardingScreenShell
      step={3}
      stepLabel={strings.onboardingStepLabel.replace('{{current}}', '3').replace('{{total}}', '3')}
      title={strings.gamesPlaceholderTitle}
      subtitle={strings.gamesPlaceholderSubtitle}
      footer={
        <Fragment>
          {__DEV__ ? (
            <LobbixButton
              label={strings.devSectionLabel}
              variant="secondary"
              fullWidth
              onPress={openDevMenu}
              accessibilityHint={strings.devMenuHint}
            />
          ) : null}
          <Link href="/" asChild>
            <LobbixButton label={strings.backToWelcome} variant="ghost" />
          </Link>
        </Fragment>
      }>
      <View style={styles.hintBox}>
        <ThemedText type="body" themeColor="textSecondary" style={styles.body}>
          {strings.gamesPlaceholderBody}
        </ThemedText>
      </View>
    </OnboardingScreenShell>
  );
}

const styles = StyleSheet.create({
  hintBox: {
    borderRadius: Radius.md,
    backgroundColor: palette.navy700,
    padding: Spacing.md,
  },
  body: {
    textAlign: 'right',
  },
});

import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingScreenShell } from '@/components/ui/onboarding-screen-shell';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { completeOnboardingFlow, loadLocalProfile } from '@/lib/profile/profile-storage';

export default function OnboardingCompleteScreen() {
  const strings = getStrings();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocalProfile().then(async (profile) => {
      if (!profile?.onboarding.profileCompleted) {
        router.replace('/onboarding/profile' as Href);
        return;
      }
      if (!profile.onboarding.avatarStepCompleted) {
        router.replace('/onboarding/avatar' as Href);
        return;
      }
      if (profile.onboarding.onboardingCompleted) {
        router.replace('/home' as Href);
        return;
      }
      setUsername(profile.username);
      setDisplayName(profile.displayName);
      setHydrated(true);
      setLoading(true);
      try {
        await completeOnboardingFlow();
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const handleContinue = useCallback(() => {
    router.replace('/home' as Href);
  }, []);

  if (!hydrated) {
    return null;
  }

  const greeting = displayName?.trim() || username;
  const stepLabel = strings.onboardingStepLabel.replace('{{current}}', '2').replace('{{total}}', '2');

  return (
    <OnboardingScreenShell
      step={2}
      stepLabel={stepLabel}
      title={strings.onboardingCompleteTitle}
      subtitle={strings.onboardingCompleteSubtitle}>
      <View style={styles.card}>
        <ThemedText type="subtitle" themeColor="accentTurquoise" style={styles.greeting}>
          {strings.onboardingCompleteGreeting.replace('{{name}}', greeting)}
        </ThemedText>
        <ThemedText type="body" themeColor="textSecondary" style={styles.body}>
          {strings.onboardingCompleteBody}
        </ThemedText>
      </View>
      <LobbixButton
        label={strings.onboardingCompleteContinue}
        onPress={handleContinue}
        loading={loading}
        fullWidth
      />
    </OnboardingScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: palette.navy700,
    padding: Spacing.lg,
  },
  greeting: {
    textAlign: 'right',
  },
  body: {
    textAlign: 'right',
  },
});

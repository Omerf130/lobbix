import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingScreenShell } from '@/components/ui/onboarding-screen-shell';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { LobbixTextField } from '@/components/ui/lobbix-text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { usernameErrorMessage } from '@/lib/i18n/username-errors';
import { completeProfileStep, loadLocalProfile } from '@/lib/profile/profile-storage';
import {
  isUsernameValid,
  normalizeUsername,
  validateDisplayName,
  validateUsername,
} from '@/lib/validation/username';

export default function ProfileCreationScreen() {
  const strings = getStrings();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadLocalProfile().then((profile) => {
      if (profile?.onboarding.profileCompleted) {
        router.replace('/onboarding/avatar' as Href);
        return;
      }
      if (profile && !profile.onboarding.profileCompleted && profile.username) {
        setUsername(profile.username);
        setDisplayName(profile.displayName ?? '');
      }
      setHydrated(true);
    });
  }, []);

  const canContinue = useMemo(() => isUsernameValid(username), [username]);

  const handleSubmit = useCallback(async () => {
    const userCode = validateUsername(username);
    const displayCode = validateDisplayName(displayName);

    setUsernameError(userCode ? usernameErrorMessage(strings, userCode) : null);
    setDisplayNameError(displayCode === 'tooLong' ? strings.displayNameTooLong : null);
    setFormError(null);

    if (userCode || displayCode) {
      setFormError(strings.formFixErrors);
      return;
    }

    setLoading(true);
    try {
      const normalized = normalizeUsername(username);
      const trimmedDisplay = displayName.trim();
      await completeProfileStep(normalized, trimmedDisplay.length > 0 ? trimmedDisplay : null);
      router.replace('/onboarding/avatar' as Href);
    } catch {
      setFormError(strings.profileSaveFailed);
    } finally {
      setLoading(false);
    }
  }, [displayName, strings, username]);

  if (!hydrated) {
    return null;
  }

  return (
    <OnboardingScreenShell
      step={1}
      stepLabel={strings.onboardingStepLabel.replace('{{current}}', '1').replace('{{total}}', '2')}
      title={strings.profileCreateTitle}
      subtitle={strings.profileCreateSubtitle}>
      <LobbixTextField
        label={strings.usernameLabel}
        value={username}
        onChangeText={(text) => {
          setUsername(text.replace(/\s/g, ''));
          setUsernameError(null);
          setFormError(null);
        }}
        autoCapitalize="none"
        autoComplete="username"
        textContentType="username"
        errorMessage={usernameError}
      />
      <ThemedText type="caption" themeColor="textSecondary" style={styles.hint}>
        {strings.usernameHint}
      </ThemedText>
      <LobbixTextField
        label={strings.displayNameLabel}
        value={displayName}
        onChangeText={(text) => {
          setDisplayName(text);
          setDisplayNameError(null);
          setFormError(null);
        }}
        autoCapitalize="words"
        errorMessage={displayNameError}
      />
      {formError ? (
        <ThemedText type="caption" themeColor="accentPink" style={styles.formError}>
          {formError}
        </ThemedText>
      ) : null}
      <View style={styles.submitWrap}>
        <LobbixButton
          label={strings.profileContinue}
          onPress={handleSubmit}
          loading={loading}
          disabled={!canContinue}
          fullWidth
        />
      </View>
    </OnboardingScreenShell>
  );
}

const styles = StyleSheet.create({
  hint: {
    textAlign: 'right',
    marginTop: -Spacing.xs,
  },
  formError: {
    textAlign: 'right',
  },
  submitWrap: {
    marginTop: Spacing.sm,
  },
});

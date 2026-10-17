import { Link, router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthScreenShell } from '@/components/ui/auth-screen-shell';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { LobbixTextField } from '@/components/ui/lobbix-text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { mockRegister } from '@/lib/auth/mock-auth';
import { markOnboardingStarted } from '@/lib/profile/profile-storage';
import { fieldErrorMessage, mockAuthErrorMessage } from '@/lib/i18n/auth-errors';
import {
  AUTH_PASSWORD_MIN_LENGTH,
  validateConfirmPassword,
  validateEmailField,
  validatePasswordField,
} from '@/lib/validation/auth-form';

export default function RegisterScreen() {
  const strings = getStrings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    const nextEmailError = validateEmailField(email);
    const nextPasswordError = validatePasswordField(password, AUTH_PASSWORD_MIN_LENGTH);
    const nextConfirmError = validateConfirmPassword(password, confirmPassword);

    setEmailError(
      nextEmailError ? fieldErrorMessage(strings, nextEmailError, AUTH_PASSWORD_MIN_LENGTH) : null,
    );
    setPasswordError(
      nextPasswordError
        ? fieldErrorMessage(strings, nextPasswordError, AUTH_PASSWORD_MIN_LENGTH)
        : null,
    );
    setConfirmError(
      nextConfirmError ? fieldErrorMessage(strings, nextConfirmError, AUTH_PASSWORD_MIN_LENGTH) : null,
    );
    setFormError(null);

    if (nextEmailError || nextPasswordError || nextConfirmError) {
      setFormError(strings.formFixErrors);
      return;
    }

    setLoading(true);
    const result = await mockRegister(email, password);
    setLoading(false);

    if (!result.ok) {
      setFormError(mockAuthErrorMessage(strings, result.code, 'register'));
      return;
    }

    await markOnboardingStarted();
    router.replace('/onboarding/profile' as Href);
  }, [confirmPassword, email, password, strings]);

  return (
    <AuthScreenShell
      title={strings.registerTitle}
      subtitle={strings.registerSubtitle}
      footer={
        <>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.mockNotice}>
            {strings.mockAuthNotice}
          </ThemedText>
          <Link href={'/login' as Href} asChild>
            <LobbixButton label={strings.goToLogin} variant="ghost" />
          </Link>
          <Link href="/" asChild>
            <LobbixButton label={strings.backToWelcome} variant="ghost" />
          </Link>
        </>
      }>
      <LobbixTextField
        label={strings.emailLabel}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(null);
          setFormError(null);
        }}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        errorMessage={emailError}
      />
      <LobbixTextField
        label={strings.passwordLabel}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(null);
          setConfirmError(null);
          setFormError(null);
        }}
        secureToggle
        textContentType="newPassword"
        autoComplete="password-new"
        errorMessage={passwordError}
      />
      <LobbixTextField
        label={strings.confirmPasswordLabel}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmError(null);
          setFormError(null);
        }}
        secureToggle
        textContentType="newPassword"
        autoComplete="password-new"
        errorMessage={confirmError}
      />
      {formError ? (
        <ThemedText type="caption" themeColor="accentPink" style={styles.formError}>
          {formError}
        </ThemedText>
      ) : null}
      <View style={styles.submitWrap}>
        <LobbixButton
          label={strings.registerSubmit}
          onPress={handleSubmit}
          loading={loading}
          fullWidth
        />
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  submitWrap: {
    marginTop: Spacing.sm,
  },
  formError: {
    textAlign: 'right',
  },
  mockNotice: {
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
});

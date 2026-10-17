import { Link, router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthScreenShell } from '@/components/ui/auth-screen-shell';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { LobbixTextField } from '@/components/ui/lobbix-text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { mockLogin } from '@/lib/auth/mock-auth';
import { fieldErrorMessage, mockAuthErrorMessage } from '@/lib/i18n/auth-errors';
import {
  AUTH_LOGIN_PASSWORD_MIN_LENGTH,
  validateEmailField,
  validatePasswordField,
} from '@/lib/validation/auth-form';

export default function LoginScreen() {
  const strings = getStrings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    const nextEmailError = validateEmailField(email);
    const nextPasswordError = validatePasswordField(password, AUTH_LOGIN_PASSWORD_MIN_LENGTH);

    setEmailError(
      nextEmailError ? fieldErrorMessage(strings, nextEmailError, AUTH_LOGIN_PASSWORD_MIN_LENGTH) : null,
    );
    setPasswordError(
      nextPasswordError
        ? fieldErrorMessage(strings, nextPasswordError, AUTH_LOGIN_PASSWORD_MIN_LENGTH)
        : null,
    );
    setFormError(null);

    if (nextEmailError || nextPasswordError) {
      setFormError(strings.formFixErrors);
      return;
    }

    setLoading(true);
    const result = await mockLogin(email, password);
    setLoading(false);

    if (!result.ok) {
      setFormError(mockAuthErrorMessage(strings, result.code, 'login'));
      return;
    }

    router.replace('/home' as Href);
  }, [email, password, strings]);

  return (
    <AuthScreenShell
      title={strings.loginTitle}
      subtitle={strings.loginSubtitle}
      footer={
        <>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.mockNotice}>
            {strings.mockAuthNotice}
          </ThemedText>
          <Link href={'/register' as Href} asChild>
            <LobbixButton label={strings.goToRegister} variant="ghost" />
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
          setFormError(null);
        }}
        secureToggle
        textContentType="password"
        autoComplete="password"
        errorMessage={passwordError}
      />
      {formError ? (
        <ThemedText type="caption" themeColor="accentPink" style={styles.formError}>
          {formError}
        </ThemedText>
      ) : null}
      <View style={styles.submitWrap}>
        <LobbixButton
          label={strings.loginSubmit}
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

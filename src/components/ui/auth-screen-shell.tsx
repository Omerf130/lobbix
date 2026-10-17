import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GamingBackdrop } from '@/components/ui/gaming-backdrop';
import { LobbixLogo } from '@/components/ui/lobbix-logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';

type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreenShell({ title, subtitle, children, footer }: AuthScreenShellProps) {
  return (
    <ThemedView style={styles.root}>
      <GamingBackdrop dim={0.78} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.logoWrap}>
                <LobbixLogo width={200} />
              </View>
              <View style={styles.card}>
                <View style={styles.header}>
                  <ThemedText type="title" style={styles.title} accessibilityRole="header">
                    {title}
                  </ThemedText>
                  {subtitle ? (
                    <ThemedText type="body" themeColor="textSecondary" style={styles.subtitle}>
                      {subtitle}
                    </ThemedText>
                  ) : null}
                </View>
                <View style={styles.form}>{children}</View>
              </View>
              {footer ? <View style={styles.footer}>{footer}</View> : null}
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Spacing.md,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.md,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(155, 93, 229, 0.28)',
    backgroundColor: 'rgba(18, 24, 41, 0.88)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  title: {
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  subtitle: {
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  form: {
    gap: Spacing.md,
  },
  footer: {
    gap: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
});

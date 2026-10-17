import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { palette, Radius, Spacing } from '@/constants/theme';

type LobbixTextFieldProps = TextInputProps & {
  label: string;
  errorMessage?: string | null;
  secureToggle?: boolean;
};

export function LobbixTextField({
  label,
  errorMessage,
  secureToggle = false,
  secureTextEntry,
  style,
  ...rest
}: LobbixTextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const isSecure = secureToggle ? hidden : secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <View style={[styles.fieldRow, errorMessage ? styles.fieldRowError : null]}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={palette.muted}
          style={[styles.input, style]}
          textAlign="right"
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'הצג סיסמה' : 'הסתר סיסמה'}
            hitSlop={12}
            onPress={() => setHidden((value) => !value)}
            style={styles.toggle}>
            <ThemedText type="caption" themeColor="accentTurquoise" style={styles.toggleLabel}>
              {hidden ? 'הצג' : 'הסתר'}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      {errorMessage ? (
        <ThemedText type="caption" themeColor="accentPink" style={styles.error}>
          {errorMessage}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: Spacing.xs,
  },
  label: {
    textAlign: 'right',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(155, 93, 229, 0.32)',
    backgroundColor: 'rgba(11, 16, 32, 0.65)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  fieldRowError: {
    borderColor: palette.pink,
  },
  input: {
    flex: 1,
    color: palette.white,
    fontSize: 16,
    paddingVertical: Spacing.sm + 2,
    writingDirection: 'rtl',
  },
  toggle: {
    paddingStart: Spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: {
    fontWeight: '600',
  },
  error: {
    textAlign: 'right',
  },
});

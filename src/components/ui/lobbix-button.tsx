import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { palette, Radius, Spacing } from '@/constants/theme';

type LobbixButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  fullWidth?: boolean;
};

export function LobbixButton({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: LobbixButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        state.pressed && !isDisabled && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? palette.navy900 : palette.turquoise} />
      ) : (
        <ThemedText
          type="body"
          themeColor={variant === 'primary' ? undefined : 'accentTurquoise'}
          style={[styles.label, variant === 'primary' && styles.primaryLabel]}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: palette.turquoise,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.55)',
    shadowColor: palette.turquoise,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  secondary: {
    backgroundColor: 'rgba(18, 24, 41, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(155, 93, 229, 0.45)',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 44,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryLabel: {
    color: palette.navy900,
  },
});

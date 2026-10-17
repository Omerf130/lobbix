import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { palette, Radius, Spacing } from '@/constants/theme';

type ColorSwatchRowProps<T extends string> = {
  label: string;
  options: readonly T[];
  selected: T;
  resolveColor: (id: T) => string;
  resolveLabel: (id: T) => string;
  onSelect: (id: T) => void;
};

export function ColorSwatchRow<T extends string>({
  label,
  options,
  selected,
  resolveColor,
  resolveLabel,
  onSelect,
}: ColorSwatchRowProps<T>) {
  return (
    <View style={styles.wrapper}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.row}>
        {options.map((option) => {
          const active = option === selected;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={resolveLabel(option)}
              onPress={() => onSelect(option)}
              style={[
                styles.swatch,
                { backgroundColor: resolveColor(option) },
                active && styles.swatchActive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  label: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'flex-start',
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: palette.turquoise,
    shadowColor: palette.turquoise,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});

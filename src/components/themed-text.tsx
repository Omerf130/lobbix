import { StyleSheet, Text, type TextProps } from 'react-native';

import { ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'badge';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[{ color: theme[themeColor ?? 'text'], writingDirection: 'rtl' }, styles[type], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  hero: Typography.hero,
  title: Typography.title,
  subtitle: Typography.subtitle,
  body: Typography.body,
  caption: Typography.caption,
  badge: {
    ...Typography.badge,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

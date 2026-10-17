import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { palette, Spacing } from '@/constants/theme';

type Props = {
  children: ReactNode;
  onError?: (message: string) => void;
};

type State = {
  error: string | null;
};

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error: error.message || 'Unknown rendering error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error.message);
    if (__DEV__) {
      console.error('[SceneErrorBoundary]', error, info.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorBox}>
          <ThemedText type="subtitle" themeColor="accentPink">
            שגיאת רינדור תלת־ממד
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.errorDetail}>
            {this.state.error}
          </ThemedText>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: palette.navy900,
  },
  errorDetail: {
    textAlign: 'center',
  },
});

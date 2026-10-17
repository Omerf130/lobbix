'use no memo';

import { router } from 'expo-router';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraDragZone } from '@/components/dev/camera-drag-zone';
import { MovementTestScene } from '@/components/dev/movement-test-scene';
import { SceneErrorBoundary } from '@/components/dev/scene-error-boundary';
import { VirtualJoystick } from '@/components/dev/virtual-joystick';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette, Radius, Spacing } from '@/constants/theme';
import { createMovementControlState, resetMovementControlState } from '@/lib/movement-control-state';

export default function MovementTestScreen() {
  const [controls] = useState(createMovementControlState);
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      resetMovementControlState(controls);
      setIsLoading(true);
      setFatalError(null);
    };
  }, [controls]);

  const handleReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleGlError = useCallback((message: string) => {
    setFatalError(message);
    setIsLoading(false);
  }, []);

  return (
    <ThemedView style={styles.root}>
      {!fatalError ? (
        <SceneErrorBoundary onError={handleGlError}>
          <Suspense
            fallback={
              <View style={styles.loading}>
                <ActivityIndicator color={palette.turquoise} size="large" />
              </View>
            }>
            <MovementTestScene controls={controls} onReady={handleReady} />
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <View style={styles.loading}>
          <ThemedText type="subtitle" themeColor="accentPink">
            לא ניתן להציג את הסצנה
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.errorText}>
            {fatalError}
          </ThemedText>
        </View>
      )}

      {isLoading && !fatalError ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={palette.turquoise} />
        </View>
      ) : null}

      {!fatalError ? (
        <>
          <CameraDragZone controls={controls} />
          <VirtualJoystick controls={controls} />
        </>
      ) : null}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.overlayTop} pointerEvents="none">
          <ThemedText type="caption" themeColor="textSecondary" style={styles.overlayLabel}>
            LOBBIX — בדיקת תנועה
          </ThemedText>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.instructions}>
            גויסטיק שמאל: תנועה · גרירה ימין: סיבוב מצלמה
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
          <ThemedText type="caption" themeColor="accentTurquoise">
            חזרה
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.navy900,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: palette.navy900,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 16, 32, 0.35)',
  },
  errorText: {
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 30,
    elevation: 30,
  },
  overlayTop: {
    alignItems: 'flex-end',
    paddingTop: Spacing.xs,
    gap: Spacing.xs,
  },
  overlayLabel: {
    backgroundColor: 'rgba(18, 24, 41, 0.75)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  instructions: {
    textAlign: 'right',
    backgroundColor: 'rgba(18, 24, 41, 0.55)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    maxWidth: 280,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  backButtonPressed: {
    opacity: 0.85,
  },
});

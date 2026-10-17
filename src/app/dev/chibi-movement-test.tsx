'use no memo';

import { Redirect, router } from 'expo-router';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChibiMovementTestScene,
  preloadChibiMovementAsset,
  type ChibiMovementStatus,
} from '@/components/dev/chibi-movement-test-scene';
import { MovementTouchControls } from '@/components/dev/movement-touch-controls';
import { SceneErrorBoundary } from '@/components/dev/scene-error-boundary';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { CHIBI_MOVEMENT_IDLE_CLIP } from '@/lib/dev/chibi-male-animated-model';
import {
  DEFAULT_CHIBI_MOVEMENT_RENDER_FLAGS,
  type ChibiMovementRenderFlags,
} from '@/lib/dev/chibi-movement-render-flags';
import { createMovementControlState, resetMovementControlState } from '@/lib/movement-control-state';

const INITIAL_STATUS: ChibiMovementStatus = {
  moving: false,
  activeClip: CHIBI_MOVEMENT_IDLE_CLIP,
  positionX: 0,
  positionZ: 0,
};

export default function ChibiMovementTestScreen() {
  const strings = getStrings();
  const [controls] = useState(createMovementControlState);
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState<ChibiMovementStatus>(INITIAL_STATUS);
  const [renderFlags, setRenderFlags] = useState<ChibiMovementRenderFlags>(
    DEFAULT_CHIBI_MOVEMENT_RENDER_FLAGS,
  );

  const toggleRenderFlag = useCallback((key: keyof ChibiMovementRenderFlags) => {
    setRenderFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  useEffect(() => {
    preloadChibiMovementAsset();
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

  const handleStatusChange = useCallback((next: ChibiMovementStatus) => {
    setStatus(next);
  }, []);

  const handleResetPosition = useCallback(() => {
    setResetKey((key) => key + 1);
    resetMovementControlState(controls);
    setStatus(INITIAL_STATUS);
  }, [controls]);

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ThemedView style={styles.root}>
      {!fatalError ? (
        <SceneErrorBoundary onError={handleGlError}>
          <Suspense
            fallback={
              <View style={styles.loading}>
                <ActivityIndicator color={palette.turquoise} size="large" />
                <ThemedText type="caption" themeColor="textSecondary">
                  {strings.devChibiMovementLoading}
                </ThemedText>
              </View>
            }>
            <ChibiMovementTestScene
              controls={controls}
              resetKey={resetKey}
              renderFlags={renderFlags}
              onReady={handleReady}
              onStatusChange={handleStatusChange}
            />
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <View style={styles.loading}>
          <ThemedText type="subtitle" themeColor="accentPink">
            {strings.devChibiMovementErrorTitle}
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

      {!fatalError && renderFlags.enableTouchControls ? (
        <MovementTouchControls controls={controls} />
      ) : null}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.overlayTop} pointerEvents="box-none">
          <View style={styles.actionsColumn} pointerEvents="auto">
            <LobbixButton
              label={strings.devChibiMovementReset}
              variant="secondary"
              onPress={handleResetPosition}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
              <ThemedText type="caption" themeColor="accentTurquoise">
                {strings.backToWelcome}
              </ThemedText>
            </Pressable>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.isolateTitle}>
              {strings.devChibiMovementIsolateTitle}
            </ThemedText>
            <View style={styles.toggleRow}>
              {(
                [
                  ['showCharacter', strings.devChibiMovementToggleCharacter],
                  ['showGround', strings.devChibiMovementToggleGround],
                  ['showGrid', strings.devChibiMovementToggleGrid],
                  ['showObstacles', strings.devChibiMovementToggleObstacles],
                  ['showArenaRing', strings.devChibiMovementToggleRing],
                  ['enableTouchControls', strings.devChibiMovementToggleTouch],
                ] as const
              ).map(([key, label]) => (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  onPress={() => toggleRenderFlag(key)}
                  style={({ pressed }) => [
                    styles.toggleChip,
                    renderFlags[key] && styles.toggleChipOn,
                    pressed && styles.toggleChipPressed,
                  ]}>
                  <ThemedText type="caption" themeColor={renderFlags[key] ? 'accentTurquoise' : 'textSecondary'}>
                    {label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <View pointerEvents="none">
            <ThemedText type="caption" themeColor="textSecondary" style={styles.overlayLabel}>
              {strings.devChibiMovementTitle}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.instructions}>
              {strings.devChibiMovementInstructions}
            </ThemedText>
            <View style={styles.statusBox}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.statusLine}>
                {strings.devChibiMovementStatusAnim}: {status.activeClip}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.statusLine}>
                {strings.devChibiMovementStatusMove}:{' '}
                {status.moving ? strings.devChibiMovementMoving : strings.devChibiMovementIdle}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.statusLine}>
                X: {status.positionX.toFixed(2)} · Z: {status.positionZ.toFixed(2)}
              </ThemedText>
            </View>
          </View>
        </View>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 30,
    elevation: 30,
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Spacing.xs,
    gap: Spacing.sm,
  },
  actionsColumn: {
    gap: Spacing.sm,
    maxWidth: 220,
  },
  isolateTitle: {
    marginTop: Spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  toggleChip: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(18, 24, 41, 0.75)',
  },
  toggleChipOn: {
    borderColor: palette.turquoise,
  },
  toggleChipPressed: {
    opacity: 0.85,
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
    maxWidth: 300,
  },
  statusBox: {
    gap: 2,
    backgroundColor: 'rgba(18, 24, 41, 0.65)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    maxWidth: 300,
  },
  statusLine: {
    textAlign: 'right',
  },
  backButton: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.85,
  },
});

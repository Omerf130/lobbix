'use no memo';

import { Redirect, router } from 'expo-router';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChibiTestScene,
  preloadChibiMaleAsset,
  type ChibiMaleRuntimeReport,
} from '@/components/dev/chibi-test-scene';
import { SceneErrorBoundary } from '@/components/dev/scene-error-boundary';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { CHIBI_MALE_INSPECT_SUMMARY } from '@/lib/dev/chibi-male-model';

export default function ChibiTestScreen() {
  const strings = getStrings();
  const { height } = useWindowDimensions();
  const spinYRef = useRef(0);
  const lastPanXRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [runtimeReport, setRuntimeReport] = useState<ChibiMaleRuntimeReport | null>(null);

  const previewHeight = useMemo(() => Math.min(Math.max(height * 0.52, 300), 440), [height]);

  useEffect(() => {
    preloadChibiMaleAsset();
  }, []);

  const handleReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleGlError = useCallback((message: string) => {
    setFatalError(message);
    setIsLoading(false);
  }, []);

  const handleRuntimeReport = useCallback((report: ChibiMaleRuntimeReport) => {
    setRuntimeReport(report);
  }, []);

  const resetPreviewPan = useCallback(() => {
    lastPanXRef.current = 0;
  }, []);

  const applySpinDelta = useCallback((deltaX: number) => {
    if (deltaX === 0) return;
    spinYRef.current += deltaX * 0.012;
  }, []);

  const applyPreviewPan = useCallback(
    (translationX: number) => {
      const dx = translationX - lastPanXRef.current;
      lastPanXRef.current = translationX;
      applySpinDelta(dx);
    },
    [applySpinDelta],
  );

  const resetRotation = useCallback(() => {
    spinYRef.current = 0;
  }, []);

  const previewPan = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(1)
        .maxPointers(1)
        .onBegin(() => {
          runOnJS(resetPreviewPan)();
        })
        .onUpdate((event) => {
          runOnJS(applyPreviewPan)(event.translationX);
        })
        .onFinalize(() => {
          runOnJS(resetPreviewPan)();
        }),
    [applyPreviewPan, resetPreviewPan],
  );

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  const clipSummary =
    runtimeReport && runtimeReport.animationClipNames.length > 0
      ? runtimeReport.animationClipNames.join(', ')
      : strings.devChibiTestNoAnimations;

  return (
    <ThemedView style={styles.root}>
      {!fatalError ? (
        <SceneErrorBoundary onError={handleGlError}>
          <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <View style={styles.header} pointerEvents="none">
              <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
                {strings.devChibiTestTitle}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.hint}>
                {strings.devChibiTestRotateHint}
              </ThemedText>
            </View>

            <GestureDetector gesture={previewPan}>
              <View style={[styles.preview, { height: previewHeight }]}>
                <Suspense
                  fallback={
                    <View style={styles.loading}>
                      <ActivityIndicator color={palette.turquoise} size="large" />
                      <ThemedText type="caption" themeColor="textSecondary">
                        {strings.devChibiTestLoading}
                      </ThemedText>
                    </View>
                  }>
                  <ChibiTestScene
                    spinYRef={spinYRef}
                    onReady={handleReady}
                    onRuntimeReport={handleRuntimeReport}
                  />
                </Suspense>
              </View>
            </GestureDetector>

            <LobbixButton
              label={strings.devChibiTestResetRotation}
              variant="secondary"
              fullWidth
              onPress={resetRotation}
            />

            <View style={styles.reportBox} pointerEvents="none">
              <ThemedText type="caption" themeColor="textSecondary" style={styles.reportLine}>
                {strings.devChibiTestTextures}:{' '}
                {runtimeReport
                  ? `${runtimeReport.textureCount} (${CHIBI_MALE_INSPECT_SUMMARY.textureSlots.join(', ')})`
                  : strings.devChibiTestPending}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.reportLine}>
                {strings.devChibiTestSkeleton}:{' '}
                {runtimeReport
                  ? runtimeReport.skinnedMeshCount > 0
                    ? strings.devChibiTestSkeletonYes
                    : strings.devChibiTestSkeletonNo
                  : strings.devChibiTestPending}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.reportLine}>
                {strings.devChibiTestClips}: {clipSummary}
              </ThemedText>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
              <ThemedText type="caption" themeColor="accentTurquoise">
                {strings.backToWelcome}
              </ThemedText>
            </Pressable>
          </SafeAreaView>
        </SceneErrorBoundary>
      ) : (
        <View style={styles.loading}>
          <ThemedText type="subtitle" themeColor="accentPink">
            {strings.devChibiTestErrorTitle}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.navy900,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  label: {
    backgroundColor: 'rgba(18, 24, 41, 0.75)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  hint: {
    textAlign: 'right',
    maxWidth: 320,
  },
  preview: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  reportBox: {
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.75)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  reportLine: {
    textAlign: 'right',
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
  backButton: {
    alignSelf: 'flex-start',
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

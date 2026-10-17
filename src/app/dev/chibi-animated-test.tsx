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
  ChibiAnimatedTestScene,
  preloadChibiMaleAnimatedAsset,
} from '@/components/dev/chibi-animated-test-scene';
import { SceneErrorBoundary } from '@/components/dev/scene-error-boundary';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import {
  CHIBI_ANIMATED_CLIP_BY_MODE,
  CHIBI_ANIMATED_CLIP_CATALOG,
  type ChibiAnimatedPreviewMode,
} from '@/lib/dev/chibi-male-animated-model';

export default function ChibiAnimatedTestScreen() {
  const strings = getStrings();
  const { height } = useWindowDimensions();
  const spinYRef = useRef(0);
  const lastPanXRef = useRef(0);

  const [animMode, setAnimMode] = useState<ChibiAnimatedPreviewMode>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [clipError, setClipError] = useState<string | null>(null);

  const previewHeight = useMemo(() => Math.min(Math.max(height * 0.48, 280), 420), [height]);

  useEffect(() => {
    preloadChibiMaleAnimatedAsset();
  }, []);

  const handleReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleGlError = useCallback((message: string) => {
    setFatalError(message);
    setIsLoading(false);
  }, []);

  const handleClipError = useCallback((message: string) => {
    setClipError(message);
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

  return (
    <ThemedView style={styles.root}>
      {!fatalError ? (
        <SceneErrorBoundary onError={handleGlError}>
          <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <View style={styles.header} pointerEvents="none">
              <ThemedText type="caption" themeColor="textSecondary" style={styles.label}>
                {strings.devChibiAnimatedTestTitle}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.hint}>
                {strings.devChibiAnimatedTestRotateHint}
              </ThemedText>
            </View>

            <GestureDetector gesture={previewPan}>
              <View style={[styles.preview, { height: previewHeight }]}>
                <Suspense
                  fallback={
                    <View style={styles.loading}>
                      <ActivityIndicator color={palette.turquoise} size="large" />
                      <ThemedText type="caption" themeColor="textSecondary">
                        {strings.devChibiAnimatedTestLoading}
                      </ThemedText>
                    </View>
                  }>
                  <ChibiAnimatedTestScene
                    animMode={animMode}
                    spinYRef={spinYRef}
                    onReady={handleReady}
                    onClipError={handleClipError}
                  />
                </Suspense>
              </View>
            </GestureDetector>

            <View style={styles.toggleRow}>
              {(
                [
                  ['idle', strings.devChibiAnimatedIdle],
                  ['walk', strings.devChibiAnimatedWalk],
                  ['run', strings.devChibiAnimatedRun],
                ] as const
              ).map(([mode, label]) => (
                <Pressable
                  key={mode}
                  accessibilityRole="button"
                  onPress={() => setAnimMode(mode)}
                  style={({ pressed }) => [
                    styles.toggle,
                    animMode === mode && styles.toggleActive,
                    pressed && styles.togglePressed,
                  ]}>
                  <ThemedText
                    type="caption"
                    themeColor={animMode === mode ? 'accentTurquoise' : 'textSecondary'}>
                    {label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <LobbixButton
              label={strings.devChibiTestResetRotation}
              variant="secondary"
              fullWidth
              onPress={resetRotation}
            />

            <View style={styles.clipBox} pointerEvents="none">
              <ThemedText type="caption" themeColor="textSecondary" style={styles.clipLine}>
                {strings.devChibiAnimatedActiveClip}: {CHIBI_ANIMATED_CLIP_BY_MODE[animMode]} (
                {CHIBI_ANIMATED_CLIP_CATALOG[CHIBI_ANIMATED_CLIP_BY_MODE[animMode]].durationSec.toFixed(2)}
                s)
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.clipLine}>
                {strings.devChibiAnimatedAlsoInFile}: Walking (
                {CHIBI_ANIMATED_CLIP_CATALOG.Walking.durationSec.toFixed(2)}s)
              </ThemedText>
            </View>

            {clipError ? (
              <ThemedText type="caption" themeColor="accentPink" style={styles.clipError}>
                {clipError}
              </ThemedText>
            ) : null}

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
            {strings.devChibiAnimatedTestErrorTitle}
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
    gap: Spacing.sm,
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
  toggleRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  toggle: {
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.85)',
    justifyContent: 'center',
  },
  toggleActive: {
    borderColor: palette.turquoise,
  },
  togglePressed: {
    opacity: 0.88,
  },
  clipBox: {
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.75)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  clipLine: {
    textAlign: 'right',
  },
  clipError: {
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

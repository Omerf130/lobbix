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

import { GlbTestScene, preloadGlbPocAsset } from '@/components/dev/glb-test-scene';
import { SceneErrorBoundary } from '@/components/dev/scene-error-boundary';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import type { GlbPocAnimMode } from '@/lib/dev/quaternius-glb-poc';

export default function GlbTestScreen() {
  const strings = getStrings();
  const { height } = useWindowDimensions();
  const spinYRef = useRef(0);
  const lastPanXRef = useRef(0);

  const [animMode, setAnimMode] = useState<GlbPocAnimMode>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [clipError, setClipError] = useState<string | null>(null);

  const previewHeight = useMemo(() => Math.min(Math.max(height * 0.52, 300), 440), [height]);

  useEffect(() => {
    preloadGlbPocAsset();
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
                {strings.devGlbTestTitle}
              </ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.hint}>
                {strings.devGlbTestRotateHint}
              </ThemedText>
            </View>

            <GestureDetector gesture={previewPan}>
              <View style={[styles.preview, { height: previewHeight }]}>
                <Suspense
                  fallback={
                    <View style={styles.loading}>
                      <ActivityIndicator color={palette.turquoise} size="large" />
                      <ThemedText type="caption" themeColor="textSecondary">
                        {strings.devGlbTestLoading}
                      </ThemedText>
                    </View>
                  }>
                  <GlbTestScene
                    animMode={animMode}
                    spinYRef={spinYRef}
                    onReady={handleReady}
                    onClipError={handleClipError}
                  />
                </Suspense>
              </View>
            </GestureDetector>

            <View style={styles.toggleRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAnimMode('idle')}
                style={({ pressed }) => [
                  styles.toggle,
                  animMode === 'idle' && styles.toggleActive,
                  pressed && styles.togglePressed,
                ]}>
                <ThemedText
                  type="caption"
                  themeColor={animMode === 'idle' ? 'accentTurquoise' : 'textSecondary'}>
                  {strings.devGlbTestIdle}
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAnimMode('walk')}
                style={({ pressed }) => [
                  styles.toggle,
                  animMode === 'walk' && styles.toggleActive,
                  pressed && styles.togglePressed,
                ]}>
                <ThemedText
                  type="caption"
                  themeColor={animMode === 'walk' ? 'accentTurquoise' : 'textSecondary'}>
                  {strings.devGlbTestWalk}
                </ThemedText>
              </Pressable>
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
            {strings.devGlbTestErrorTitle}
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
  toggleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  toggle: {
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
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

'use no memo';

import { router, type Href } from 'expo-router';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChibiGlbPreviewFallback,
  ChibiGlbPreviewScene,
  preloadChibiGlbPreviewAsset,
} from '@/components/avatar/chibi-glb-preview-scene';
import { GamingBackdrop } from '@/components/ui/gaming-backdrop';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { AVATAR_ID_CHIBI_MALE_V1 } from '@/lib/profile/avatar-catalog';
import { completeAvatarSelection, loadLocalProfile } from '@/lib/profile/profile-storage';

export default function AvatarSelectionScreen() {
  const strings = getStrings();
  const { height } = useWindowDimensions();
  const spinYRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const previewHeight = useMemo(() => Math.min(Math.max(height * 0.38, 260), 380), [height]);

  useEffect(() => {
    preloadChibiGlbPreviewAsset();
    loadLocalProfile().then((profile) => {
      if (!profile?.onboarding.profileCompleted) {
        router.replace('/onboarding/profile' as Href);
        return;
      }
      if (profile.onboarding.avatarStepCompleted && profile.onboarding.onboardingCompleted) {
        router.replace('/home' as Href);
        return;
      }
      if (profile.onboarding.avatarStepCompleted) {
        router.replace('/onboarding/complete' as Href);
        return;
      }
      setHydrated(true);
    });
  }, []);

  const lastPanXRef = useRef(0);

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

  const handleSelectAvatar = useCallback(async () => {
    setLoading(true);
    setFormError(null);
    try {
      await completeAvatarSelection(AVATAR_ID_CHIBI_MALE_V1);
      router.replace('/onboarding/complete' as Href);
    } catch {
      setFormError(strings.avatarSaveFailed);
    } finally {
      setLoading(false);
    }
  }, [strings.avatarSaveFailed]);

  if (!hydrated) {
    return <ThemedView style={styles.root} />;
  }

  const stepLabel = strings.onboardingStepLabel.replace('{{current}}', '2').replace('{{total}}', '2');

  return (
    <ThemedView style={styles.root}>
      <GamingBackdrop dim={0.82} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.stepBadge}>
              <ThemedText type="badge" themeColor="accentTurquoise">
                {stepLabel}
              </ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              {strings.avatarSelectTitle}
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary" style={styles.subtitle}>
              {strings.avatarSelectSubtitle}
            </ThemedText>
            <ThemedText type="caption" themeColor="accentPurple" style={styles.singleHint}>
              {strings.avatarSelectSingleAvailable}
            </ThemedText>
          </View>

          <GestureDetector gesture={previewPan}>
            <View style={[styles.previewWrap, { height: previewHeight }]}>
              {previewError ? (
                <View style={styles.previewErrorBox}>
                  <ThemedText type="caption" themeColor="accentPink">
                    {previewError}
                  </ThemedText>
                </View>
              ) : (
                <Suspense fallback={<ChibiGlbPreviewFallback />}>
                  <ChibiGlbPreviewScene spinYRef={spinYRef} onError={setPreviewError} />
                </Suspense>
              )}
            </View>
          </GestureDetector>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.rotateHint}>
            {strings.avatarRotateHint}
          </ThemedText>

          {formError ? (
            <ThemedText type="caption" themeColor="accentPink" style={styles.formError}>
              {formError}
            </ThemedText>
          ) : null}

          <LobbixButton
            label={strings.avatarSelectConfirm}
            variant="primary"
            onPress={handleSelectAvatar}
            loading={loading}
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: {
    flexGrow: 1,
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: { gap: Spacing.sm, alignItems: 'center' },
  stepBadge: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', paddingHorizontal: Spacing.sm },
  singleHint: { textAlign: 'center', paddingHorizontal: Spacing.md },
  previewWrap: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  previewErrorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: palette.navy800,
  },
  rotateHint: { textAlign: 'center' },
  formError: { textAlign: 'right' },
});

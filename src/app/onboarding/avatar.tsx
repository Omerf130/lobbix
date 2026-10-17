'use no memo';

import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarPreviewScene } from '@/components/avatar/avatar-preview-scene';
import { DevMenuGear } from '@/components/dev/dev-menu-gear';
import { ColorSwatchRow } from '@/components/ui/color-swatch-row';
import { GamingBackdrop } from '@/components/ui/gaming-backdrop';
import { LobbixButton } from '@/components/ui/lobbix-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import {
  CLOTHING_COLOR_OPTIONS,
  DEFAULT_AVATAR_CUSTOMIZATION,
  HAIR_COLOR_OPTIONS,
  resolveClothingHex,
  resolveHairHex,
  resolveShoesHex,
  SHOES_COLOR_OPTIONS,
  type AvatarCustomization,
} from '@/lib/profile/avatar-customization';
import {
  completeAvatarStep,
  loadLocalProfile,
  saveAvatarCustomizationDraft,
} from '@/lib/profile/profile-storage';

export default function AvatarCustomizationScreen() {
  const strings = getStrings();
  const { height } = useWindowDimensions();
  const spinYRef = useRef(0);
  const [customization, setCustomization] = useState<AvatarCustomization>(
    DEFAULT_AVATAR_CUSTOMIZATION,
  );
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const previewHeight = useMemo(() => Math.min(Math.max(height * 0.36, 240), 360), [height]);

  useEffect(() => {
    loadLocalProfile().then((profile) => {
      const devBypass = __DEV__ && !profile?.onboarding.profileCompleted;
      if (!profile?.onboarding.profileCompleted && !devBypass) {
        router.replace('/onboarding/profile' as Href);
        return;
      }
      if (profile?.onboarding.avatarStepCompleted && !__DEV__) {
        router.replace('/onboarding/games-placeholder' as Href);
        return;
      }
      if (profile?.avatarCustomization) {
        setCustomization(profile.avatarCustomization);
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

  const updateCustomization = useCallback((patch: Partial<AvatarCustomization>) => {
    setCustomization((prev) => {
      const next = { ...prev, ...patch };
      void saveAvatarCustomizationDraft(next);
      return next;
    });
  }, []);

  const handleContinue = useCallback(async () => {
    setLoading(true);
    setFormError(null);
    try {
      await completeAvatarStep(customization);
      router.replace('/onboarding/games-placeholder' as Href);
    } catch {
      setFormError(strings.avatarSaveFailed);
    } finally {
      setLoading(false);
    }
  }, [customization, strings.avatarSaveFailed]);

  if (!hydrated) {
    return <ThemedView style={styles.root} />;
  }

  const stepLabel = strings.onboardingStepLabel.replace('{{current}}', '2').replace('{{total}}', '3');

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
              {strings.avatarCustomizeTitle}
            </ThemedText>
            <ThemedText type="body" themeColor="textSecondary" style={styles.subtitle}>
              {strings.avatarCustomizeSubtitle}
            </ThemedText>
          </View>

          <GestureDetector gesture={previewPan}>
            <View style={[styles.previewWrap, { height: previewHeight }]}>
              <AvatarPreviewScene customization={customization} spinYRef={spinYRef} />
            </View>
          </GestureDetector>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.rotateHint}>
            {strings.avatarRotateHint}
          </ThemedText>

          <View style={styles.controlsCard}>
            <ColorSwatchRow
              label={strings.avatarHairLabel}
              options={HAIR_COLOR_OPTIONS}
              selected={customization.hairColor}
              resolveColor={resolveHairHex}
              resolveLabel={(id) => strings.avatarColorLabels.hair[id]}
              onSelect={(hairColor) => updateCustomization({ hairColor })}
            />
            <ColorSwatchRow
              label={strings.avatarClothingLabel}
              options={CLOTHING_COLOR_OPTIONS}
              selected={customization.clothingColor}
              resolveColor={resolveClothingHex}
              resolveLabel={(id) => strings.avatarColorLabels.clothing[id]}
              onSelect={(clothingColor) => updateCustomization({ clothingColor })}
            />
            <ColorSwatchRow
              label={strings.avatarShoesLabel}
              options={SHOES_COLOR_OPTIONS}
              selected={customization.shoesColor}
              resolveColor={resolveShoesHex}
              resolveLabel={(id) => strings.avatarColorLabels.shoes[id]}
              onSelect={(shoesColor) => updateCustomization({ shoesColor })}
            />
          </View>

          {formError ? (
            <ThemedText type="caption" themeColor="accentPink" style={styles.formError}>
              {formError}
            </ThemedText>
          ) : null}

          <LobbixButton
            label={strings.profileContinue}
            onPress={handleContinue}
            loading={loading}
            fullWidth
          />
        </ScrollView>
        <DevMenuGear />
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
  previewWrap: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  rotateHint: { textAlign: 'center' },
  controlsCard: {
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(155, 93, 229, 0.28)',
    backgroundColor: 'rgba(18, 24, 41, 0.88)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  formError: { textAlign: 'right' },
});

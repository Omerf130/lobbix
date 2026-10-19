'use no memo';

import { router, type Href } from 'expo-router';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MovementTouchControls } from '@/components/dev/movement-touch-controls';
import { PersonalLobbyScene } from '@/components/lobby/personal-lobby-scene';
import { SceneErrorBoundary } from '@/components/dev/scene-error-boundary';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { palette, Radius, Spacing } from '@/constants/theme';
import { getStrings } from '@/i18n';
import { getPostBootNavigationHref } from '@/lib/onboarding/resume-route';
import { PERSONAL_LOBBY_ARENA } from '@/lib/lobby/lobby-arena';
import { preloadLobbyGamePortalGlb } from '@/lib/lobby/game-portal-model';
import { preloadLobbyGamingLoungeGlb } from '@/lib/lobby/gaming-lounge-model';
import { preloadLobbyGamingStationGlb } from '@/lib/lobby/gaming-station-model';
import { loadLocalProfile } from '@/lib/profile/profile-storage';
import {
  preloadAvatarAnimatedGlbModule,
  resolveAvatarAnimatedGlbModule,
  resolveAvatarIdFromProfile,
} from '@/lib/profile/resolve-avatar-model';
import {
  createPersonalLobbyMovementControlState,
  resetPersonalLobbyMovementControlState,
} from '@/lib/movement-control-state';
import {
  MOVEMENT_JOYSTICK_OUTER_SIZE,
  MOVEMENT_TOUCH_MARGIN,
  physicalBottomLeftReserveStyle,
} from '@/lib/touch-control-layout';

export default function PersonalLobbyScreen() {
  const strings = getStrings();
  const insets = useSafeAreaInsets();
  const [controls] = useState(createPersonalLobbyMovementControlState);
  const [resetKey] = useState(0);
  const [gateReady, setGateReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [playerLabel, setPlayerLabel] = useState('');

  const [resolvedGlb, setResolvedGlb] = useState<ReturnType<
    typeof resolveAvatarAnimatedGlbModule
  > | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const href = await getPostBootNavigationHref();
      if (!active) return;
      if (href && href !== '/home') {
        router.replace(href);
        return;
      }

      const profile = await loadLocalProfile();
      if (!active) return;
      if (!profile?.onboarding.onboardingCompleted) {
        router.replace((href ?? '/') as Href);
        return;
      }

      const avatarId = resolveAvatarIdFromProfile(profile.avatarId);
      const module = resolveAvatarAnimatedGlbModule(avatarId);
      setResolvedGlb(module);
      preloadAvatarAnimatedGlbModule(module);
      preloadLobbyGamingStationGlb();
      preloadLobbyGamingLoungeGlb();
      preloadLobbyGamePortalGlb();

      const name = profile.displayName?.trim() || profile.username;
      setPlayerLabel(name);
      setGateReady(true);
    })();

    return () => {
      active = false;
      resetPersonalLobbyMovementControlState(controls);
    };
  }, [controls]);

  const handleReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleGlError = useCallback((message: string) => {
    setFatalError(message);
    setIsLoading(false);
  }, []);

  const bottomInset = MOVEMENT_TOUCH_MARGIN + insets.bottom;
  const actionReserveStyle = useMemo(
    () =>
      physicalBottomLeftReserveStyle(
        MOVEMENT_TOUCH_MARGIN,
        bottomInset,
        MOVEMENT_JOYSTICK_OUTER_SIZE,
        MOVEMENT_JOYSTICK_OUTER_SIZE,
      ),
    [bottomInset],
  );

  if (!gateReady || !resolvedGlb) {
    return (
      <ThemedView style={styles.root}>
        <View style={styles.bootLoading}>
          <ActivityIndicator color={palette.turquoise} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.root}>
      {!fatalError ? (
        <SceneErrorBoundary onError={handleGlError}>
          <Suspense
            fallback={
              <View style={styles.bootLoading}>
                <ActivityIndicator color={palette.turquoise} size="large" />
                <ThemedText type="caption" themeColor="textSecondary">
                  {strings.homeLobbyLoading}
                </ThemedText>
              </View>
            }>
            <PersonalLobbyScene
              glbModule={resolvedGlb}
              arena={PERSONAL_LOBBY_ARENA}
              controls={controls}
              resetKey={resetKey}
              onReady={handleReady}
            />
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <View style={styles.bootLoading}>
          <ThemedText type="subtitle" themeColor="accentPink">
            {strings.homeLobbyErrorTitle}
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

      {!fatalError ? <MovementTouchControls controls={controls} /> : null}

      <SafeAreaView style={styles.hud} pointerEvents="box-none" edges={['top']}>
        <View style={styles.hudTop} pointerEvents="none">
          <ThemedText type="caption" themeColor="textSecondary" style={styles.hudName}>
            {strings.homeLobbyPlayer.replace('{{name}}', playerLabel)}
          </ThemedText>
        </View>
      </SafeAreaView>

      <View style={[styles.actionReserve, actionReserveStyle]} pointerEvents="none" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.navy900,
  },
  bootLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
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
  hud: {
    ...StyleSheet.absoluteFill,
    zIndex: 25,
    elevation: 25,
    paddingHorizontal: Spacing.md,
  },
  hudTop: {
    paddingTop: Spacing.xs,
    alignItems: 'flex-end',
  },
  hudName: {
    textAlign: 'right',
    backgroundColor: 'rgba(11, 16, 32, 0.55)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    maxWidth: '55%',
  },
  actionReserve: {
    zIndex: 5,
    elevation: 5,
  },
});

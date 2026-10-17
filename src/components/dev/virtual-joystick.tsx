'use no memo';

import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, Spacing } from '@/constants/theme';
import type { MovementControlState } from '@/lib/movement-control-state';
import { physicalBottomRightJoystickStyle } from '@/lib/touch-control-layout';

const BASE_SIZE = 128;
const THUMB_SIZE = 52;
const MAX_RADIUS = (BASE_SIZE - THUMB_SIZE) / 2;

type VirtualJoystickProps = {
  controls: MovementControlState;
};

export function VirtualJoystick({ controls }: VirtualJoystickProps) {
  const insets = useSafeAreaInsets();
  const thumbViewRef = useRef<View>(null);

  const margin = Spacing.md;
  const bottom = Spacing.md + insets.bottom;

  const applyTranslation = useCallback((translationX: number, translationY: number) => {
    const dist = Math.hypot(translationX, translationY);
    const clampedDist = Math.min(dist, MAX_RADIUS);
    const scale = dist > 0 ? clampedDist / dist : 0;
    const x = translationX * scale;
    const y = translationY * scale;

    thumbViewRef.current?.setNativeProps({
      style: { transform: [{ translateX: x }, { translateY: y }] },
    });

    const nx = x / MAX_RADIUS;
    const ny = y / MAX_RADIUS;
    const len = Math.hypot(nx, ny);
    if (len > 1) {
      controls.moveX = nx / len;
      controls.moveY = ny / len;
    } else {
      controls.moveX = nx;
      controls.moveY = ny;
    }
  }, [controls]);

  const resetJoystick = useCallback(() => {
    thumbViewRef.current?.setNativeProps({
      style: { transform: [{ translateX: 0 }, { translateY: 0 }] },
    });
    controls.moveX = 0;
    controls.moveY = 0;
  }, [controls]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(1)
        .maxPointers(1)
        .onUpdate((event) => {
          runOnJS(applyTranslation)(event.translationX, event.translationY);
        })
        .onEnd(() => {
          runOnJS(resetJoystick)();
        })
        .onFinalize((event, success) => {
          if (!success) {
            runOnJS(resetJoystick)();
          }
        }),
    [applyTranslation, resetJoystick],
  );

  return (
    <View style={styles.lane} pointerEvents="box-none">
      <View
        style={physicalBottomRightJoystickStyle(margin, bottom, BASE_SIZE)}
        pointerEvents="box-none">
        <GestureDetector gesture={panGesture}>
          <View style={styles.base}>
            <View ref={thumbViewRef} style={styles.thumb} />
          </View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lane: {
    ...StyleSheet.absoluteFill,
    direction: 'ltr',
    zIndex: 20,
    elevation: 20,
  },
  base: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderRadius: BASE_SIZE / 2,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(18, 24, 41, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: palette.turquoise,
    opacity: 0.9,
    elevation: 4,
  },
});

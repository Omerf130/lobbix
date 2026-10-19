'use no memo';

import { useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/theme';
import { useMovementTouchGestures } from '@/lib/dev/movement-touch-gestures';
import type { MovementControlState } from '@/lib/movement-control-state';
import {
  MOVEMENT_JOYSTICK_OUTER_SIZE,
  MOVEMENT_TOUCH_MARGIN,
  physicalBottomRightJoystickStyle,
  physicalCameraPaneStyle,
  physicalJoystickHostStyle,
} from '@/lib/touch-control-layout';

const THUMB_SIZE = 52;

type MovementTouchControlsProps = {
  controls: MovementControlState;
};

/**
 * Independent camera + joystick pointers (RNGH), scoped hit targets, simultaneous pans.
 */
export function MovementTouchControls({ controls }: MovementTouchControlsProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const margin = MOVEMENT_TOUCH_MARGIN;
  const bottom = margin + insets.bottom;
  const thumbViewRef = useRef<View>(null);

  const { cameraGesture, joystickPan } = useMovementTouchGestures({
    controls,
    viewportWidth: width,
    viewportHeight: height,
    thumbViewRef,
  });

  const cameraPaneStyle = useMemo(
    () => physicalCameraPaneStyle(width, margin, insets.bottom, MOVEMENT_JOYSTICK_OUTER_SIZE),
    [insets.bottom, margin, width],
  );

  const joystickStyle = useMemo(
    () => physicalBottomRightJoystickStyle(margin, bottom, MOVEMENT_JOYSTICK_OUTER_SIZE),
    [bottom, margin],
  );

  return (
    <>
      <GestureDetector gesture={cameraGesture}>
        <View style={[styles.cameraPane, cameraPaneStyle]} collapsable={false} />
      </GestureDetector>

      <View style={physicalJoystickHostStyle()} pointerEvents="box-none" collapsable={false}>
        <GestureDetector gesture={joystickPan}>
          <View style={[styles.joystickBase, joystickStyle]}>
            <View ref={thumbViewRef} style={styles.thumb} />
          </View>
        </GestureDetector>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cameraPane: {
    zIndex: 10,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  joystickBase: {
    width: MOVEMENT_JOYSTICK_OUTER_SIZE,
    height: MOVEMENT_JOYSTICK_OUTER_SIZE,
    borderRadius: MOVEMENT_JOYSTICK_OUTER_SIZE / 2,
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

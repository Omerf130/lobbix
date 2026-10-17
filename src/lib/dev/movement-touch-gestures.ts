import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import type { View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { cameraOrbitFromPanDelta } from '@/lib/camera-orbit-drag';
import type { MovementControlState } from '@/lib/movement-control-state';
import { MOVEMENT_JOYSTICK_OUTER_SIZE } from '@/lib/touch-control-layout';

const THUMB_SIZE = 52;
const JOYSTICK_MAX_RADIUS = (MOVEMENT_JOYSTICK_OUTER_SIZE - THUMB_SIZE) / 2;

export type MovementTouchGestures = {
  cameraPan: ReturnType<typeof Gesture.Pan>;
  joystickPan: ReturnType<typeof Gesture.Pan>;
};

type UseMovementTouchGesturesOptions = {
  controls: MovementControlState;
  viewportWidth: number;
  viewportHeight: number;
  thumbViewRef: RefObject<View | null>;
};

export function useMovementTouchGestures({
  controls,
  viewportWidth,
  viewportHeight,
  thumbViewRef,
}: UseMovementTouchGesturesOptions): MovementTouchGestures {
  const cameraLastX = useSharedValue(0);
  const cameraLastY = useSharedValue(0);

  const applyCameraDelta = useCallback(
    (changeX: number, changeY: number) => {
      const next = cameraOrbitFromPanDelta(
        controls.cameraYaw,
        controls.cameraPitch,
        changeX,
        changeY,
        viewportWidth,
        viewportHeight,
      );
      controls.cameraYaw = next.cameraYaw;
      controls.cameraPitch = next.cameraPitch;
    },
    [controls, viewportHeight, viewportWidth],
  );

  const applyJoystickTranslation = useCallback(
    (translationX: number, translationY: number) => {
      const dist = Math.hypot(translationX, translationY);
      const clampedDist = Math.min(dist, JOYSTICK_MAX_RADIUS);
      const scale = dist > 0 ? clampedDist / dist : 0;
      const x = translationX * scale;
      const y = translationY * scale;

      thumbViewRef.current?.setNativeProps({
        style: { transform: [{ translateX: x }, { translateY: y }] },
      });

      const nx = x / JOYSTICK_MAX_RADIUS;
      const ny = y / JOYSTICK_MAX_RADIUS;
      const len = Math.hypot(nx, ny);
      if (len > 1) {
        controls.moveX = nx / len;
        controls.moveY = ny / len;
      } else {
        controls.moveX = nx;
        controls.moveY = ny;
      }
    },
    [controls, thumbViewRef],
  );

  const resetJoystick = useCallback(() => {
    thumbViewRef.current?.setNativeProps({
      style: { transform: [{ translateX: 0 }, { translateY: 0 }] },
    });
    controls.moveX = 0;
    controls.moveY = 0;
  }, [controls, thumbViewRef]);

  const applyCameraDeltaRef = useRef(applyCameraDelta);
  const applyJoystickRef = useRef(applyJoystickTranslation);
  const resetJoystickRef = useRef(resetJoystick);

  useEffect(() => {
    applyCameraDeltaRef.current = applyCameraDelta;
    applyJoystickRef.current = applyJoystickTranslation;
    resetJoystickRef.current = resetJoystick;
  }, [applyCameraDelta, applyJoystickTranslation, resetJoystick]);

  return useMemo(() => {
    const cameraPan = Gesture.Pan()
      .minPointers(1)
      .maxPointers(1)
      .activeOffsetX([-3, 3])
      .activeOffsetY([-3, 3])
      .onStart(() => {
        cameraLastX.value = 0;
        cameraLastY.value = 0;
      })
      .onUpdate((event) => {
        const changeX = event.translationX - cameraLastX.value;
        const changeY = event.translationY - cameraLastY.value;
        cameraLastX.value = event.translationX;
        cameraLastY.value = event.translationY;
        runOnJS(applyCameraDeltaRef.current)(changeX, changeY);
      })
      .onFinalize(() => {
        cameraLastX.value = 0;
        cameraLastY.value = 0;
      });

    const joystickPan = Gesture.Pan()
      .minPointers(1)
      .maxPointers(1)
      .activeOffsetX([-2, 2])
      .activeOffsetY([-2, 2])
      .onUpdate((event) => {
        runOnJS(applyJoystickRef.current)(event.translationX, event.translationY);
      })
      .onEnd(() => {
        runOnJS(resetJoystickRef.current)();
      })
      .onFinalize((_event, success) => {
        if (!success) {
          runOnJS(resetJoystickRef.current)();
        }
      });

    // Separate hit targets — no simultaneousWithExternalGesture (3B.5D.3 Android mount crash).
    return { cameraPan, joystickPan };
  }, [cameraLastX, cameraLastY]);
}

'use no memo';

import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import {
  CAMERA_MAX_PITCH,
  CAMERA_MIN_PITCH,
  CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT,
  CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH,
} from '@/lib/camera-touch-sensitivity';
import type { MovementControlState } from '@/lib/movement-control-state';

type CameraDragZoneProps = {
  controls: MovementControlState;
};

export function CameraDragZone({ controls }: CameraDragZoneProps) {
  const { width, height } = useWindowDimensions();
  const lastTranslationRef = useRef({ x: 0, y: 0 });

  const resetCameraDrag = useCallback(() => {
    lastTranslationRef.current = { x: 0, y: 0 };
  }, []);

  const applyCameraDelta = useCallback(
    (changeX: number, changeY: number) => {
      if (width <= 0 || height <= 0) return;
      if (changeX === 0 && changeY === 0) return;

      controls.cameraYaw -= (changeX / width) * CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH;
      controls.cameraPitch = Math.min(
        CAMERA_MAX_PITCH,
        Math.max(
          CAMERA_MIN_PITCH,
          controls.cameraPitch + (changeY / height) * CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT,
        ),
      );
    },
    [controls, height, width],
  );

  const applyCameraTranslation = useCallback(
    (translationX: number, translationY: number) => {
      const dx = translationX - lastTranslationRef.current.x;
      const dy = translationY - lastTranslationRef.current.y;
      lastTranslationRef.current = { x: translationX, y: translationY };
      applyCameraDelta(dx, dy);
    },
    [applyCameraDelta],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minPointers(1)
        .maxPointers(1)
        .onBegin(() => {
          runOnJS(resetCameraDrag)();
        })
        .onUpdate((event) => {
          runOnJS(applyCameraTranslation)(event.translationX, event.translationY);
        })
        .onFinalize(() => {
          runOnJS(resetCameraDrag)();
        }),
    [applyCameraTranslation, resetCameraDrag],
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.zone, { left: width * 0.42, width: width * 0.58 }]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  zone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
  },
});

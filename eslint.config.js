// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: [
      'src/components/dev/virtual-joystick.tsx',
      'src/components/dev/camera-drag-zone.tsx',
      'src/components/dev/movement-touch-controls.tsx',
      'src/lib/dev/movement-touch-gestures.ts',
      'src/app/onboarding/avatar.tsx',
      'src/app/dev/glb-test.tsx',
      'src/app/dev/chibi-test.tsx',
      'src/app/dev/chibi-animated-test.tsx',
    ],
    rules: {
      // RNGH Pan + mutable MovementControlState; Gesture built in useMemo with runOnJS handlers.
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
  {
    files: ['src/components/dev/movement-test-scene.tsx'],
    rules: {
      // R3F useFrame: movement + shared ChibiAnimState (no per-frame React state).
      'react-hooks/immutability': 'off',
    },
  },
  {
    files: [
      'src/components/dev/glb-test-scene.tsx',
      'src/components/dev/chibi-test-scene.tsx',
      'src/components/dev/chibi-animated-test-scene.tsx',
      'src/components/dev/chibi-movement-test-scene.tsx',
      'src/components/avatar/chibi-movement-rig.tsx',
      'src/components/lobby/personal-lobby-scene.tsx',
      'src/components/lobby/lobby-club-environment.tsx',
      'src/components/lobby/lobby-dot-matrix-sign.tsx',
      'src/components/lobby/lobby-game-entrance.tsx',
      'src/components/avatar/chibi-glb-preview-scene.tsx',
      'src/app/home.tsx',
    ],
    rules: {
      // R3F useFrame: AnimationMixer + counter root-motion on loaded GLTF scene.
      'react-hooks/immutability': 'off',
    },
  },
]);

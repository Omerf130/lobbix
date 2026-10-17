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
      'src/app/onboarding/avatar.tsx',
      'src/app/dev/glb-test.tsx',
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
    files: ['src/components/dev/glb-test-scene.tsx'],
    rules: {
      // R3F useFrame: AnimationMixer + counter root-motion on loaded GLTF scene.
      'react-hooks/immutability': 'off',
    },
  },
]);

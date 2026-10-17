/**
 * Load before `@react-three/fiber/native`.
 * Patches Hermes/Android URL APIs needed by R3F native polyfills.
 * Do not import `three` here — a second entry causes Metro to evaluate Three.js twice
 * and triggers "Multiple instances of Three.js being imported" (window.__THREE__).
 */
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const URLCtor = globalThis.URL;
  if (URLCtor && typeof URLCtor.createObjectURL !== 'function') {
    URLCtor.createObjectURL = () => 'data:application/octet-stream;base64,';
    URLCtor.revokeObjectURL = () => {};
  }
}

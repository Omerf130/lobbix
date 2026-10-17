import { Platform } from 'react-native';
import type { WebGLRenderer } from 'three';

/**
 * Three.js r170 `WebGLProgram.onFirstUse` (see three.module.js ~20319) calls
 * `.trim()` on `gl.getProgramInfoLog()` / `gl.getShaderInfoLog()` when
 * `renderer.debug.checkShaderErrors === true`. Some Android GLES drivers return
 * `undefined` instead of `""` even when `LINK_STATUS` is true — causing
 * `Cannot read property 'trim' of undefined` before uniforms are cached.
 *
 * Disabling the check avoids that broken diagnostics path; it does not patch
 * Three.js and does not catch render errors elsewhere.
 */
export function configureDevMovementGlShaderDiagnostics(renderer: WebGLRenderer): void {
  if (Platform.OS !== 'android') return;
  renderer.debug.checkShaderErrors = false;
}

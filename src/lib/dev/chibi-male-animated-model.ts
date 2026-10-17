import chibiMaleAnimatedGlb from '@/assets/models/chibi-male-animated.glb';

/** Metro asset module — Meshy rigged Chibi (dev test only). */
export const CHIBI_MALE_ANIMATED_GLB: number = chibiMaleAnimatedGlb;

/** Verified clip names + durations (seconds) from GLB JSON chunk. */
export const CHIBI_ANIMATED_CLIP_CATALOG = {
  Idle_3: { durationSec: 9.966667175292969, meshyLabel: 'Idle 3' },
  Casual_Walk: { durationSec: 4.1666669845581055, meshyLabel: 'Casual Walk' },
  Walking: { durationSec: 1.0333329439163208, meshyLabel: 'Walking' },
  Running: { durationSec: 0.6333330273628235, meshyLabel: 'Running' },
} as const;

export type ChibiAnimatedClipName = keyof typeof CHIBI_ANIMATED_CLIP_CATALOG;

export type ChibiAnimatedPreviewMode = 'idle' | 'walk' | 'run';

/** UI modes → exact GLB clip names (discovered in file, not assumed). */
export const CHIBI_ANIMATED_CLIP_BY_MODE: Record<
  ChibiAnimatedPreviewMode,
  ChibiAnimatedClipName
> = {
  idle: 'Idle_3',
  walk: 'Casual_Walk',
  run: 'Running',
};

/** Movement dev test clips (verified in GLB). */
export const CHIBI_MOVEMENT_IDLE_CLIP = 'Idle_3' as const;
export const CHIBI_MOVEMENT_WALK_CLIP = 'Casual_Walk' as const;

/**
 * Mixamo-style export faces +Z at rest; LOBBIX movement heading assumes local -Z forward.
 */
export const CHIBI_ANIMATED_FACING_Y_OFFSET = Math.PI;

/** Third-person lookAt height after ground fit (~1.05m character). */
export const CHIBI_ANIMATED_LOOK_AT_HEIGHT = 0.58;

export const CHIBI_ANIMATED_INSPECT_SUMMARY = {
  fileSizeBytesApprox: 8_957_228,
  sceneCount: 1,
  sceneName: 'Scene',
  rootNodeName: 'target_character',
  skinCount: 1,
  jointCount: 58,
  meshName: 'Mesh_0',
  embeddedTextureCount: 3,
  generator: 'Khronos glTF Blender I/O v4.5.51',
} as const;

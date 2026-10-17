import chibiMaleGlb from '@/assets/models/chibi-male.glb';

/** Metro asset module — Meshy-exported Chibi (dev test only). */
export const CHIBI_MALE_GLB: number = chibiMaleGlb;

/**
 * Static metadata from `@gltf-transform/cli inspect` (no skeleton / no animation clips).
 * Runtime load may still be inspected in the dev screen for confirmation.
 */
export const CHIBI_MALE_INSPECT_SUMMARY = {
  generator: 'pygltflib@v1.16.5',
  meshCount: 1,
  triangleCount: 15736,
  materialCount: 1,
  embeddedTextureCount: 3,
  textureSlots: ['baseColorTexture', 'metallicRoughnessTexture', 'normalTexture'] as const,
  hasSkeleton: false,
  animationClipNames: [] as readonly string[],
} as const;

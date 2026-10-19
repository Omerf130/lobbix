import type { LobbyWallAabb } from '@/lib/lobby/lobby-wall-bounds';

const EPS = 1e-6;

/** Slab test: segment p0→p1 intersects AABB (including endpoints inside). */
export function segmentIntersectsAabb(
  p0x: number,
  p0y: number,
  p0z: number,
  p1x: number,
  p1y: number,
  p1z: number,
  box: LobbyWallAabb,
): boolean {
  const dx = p1x - p0x;
  const dy = p1y - p0y;
  const dz = p1z - p0z;

  let tmin = 0;
  let tmax = 1;

  const axes = [
    { d: dx, minB: box.minX - p0x, maxB: box.maxX - p0x },
    { d: dy, minB: box.minY - p0y, maxB: box.maxY - p0y },
    { d: dz, minB: box.minZ - p0z, maxB: box.maxZ - p0z },
  ];

  for (const { d, minB, maxB } of axes) {
    if (Math.abs(d) < EPS) {
      if (minB > 0 || maxB < 0) return false;
      continue;
    }
    const inv = 1 / d;
    let t1 = minB * inv;
    let t2 = maxB * inv;
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  }

  return tmin <= tmax;
}

export function pointInsideAabb(
  x: number,
  y: number,
  z: number,
  box: LobbyWallAabb,
): boolean {
  return (
    x >= box.minX &&
    x <= box.maxX &&
    y >= box.minY &&
    y <= box.maxY &&
    z >= box.minZ &&
    z <= box.maxZ
  );
}

/** True when the wall blocks camera→focus (segment hit or camera inside shell). */
export function wallObstructsCameraView(
  camX: number,
  camY: number,
  camZ: number,
  focusX: number,
  focusY: number,
  focusZ: number,
  box: LobbyWallAabb,
): boolean {
  if (pointInsideAabb(camX, camY, camZ, box)) {
    return true;
  }
  return segmentIntersectsAabb(camX, camY, camZ, focusX, focusY, focusZ, box);
}

export const BOUNDARY_WALL_VISIBLE_OPACITY = 1;
export const BOUNDARY_WALL_FADED_OPACITY = 0.06;

export function lerpBoundaryWallOpacity(
  current: number,
  obstructed: boolean,
  delta: number,
): number {
  const target = obstructed ? BOUNDARY_WALL_FADED_OPACITY : BOUNDARY_WALL_VISIBLE_OPACITY;
  const speed = obstructed ? 14 : 9;
  const blend = 1 - Math.exp(-speed * delta);
  return current + (target - current) * blend;
}

export function applyMaterialWallFade(
  material: { opacity: number; transparent: boolean; depthWrite: boolean; needsUpdate?: boolean },
  opacity: number,
): void {
  material.transparent = opacity < 0.999;
  material.opacity = opacity;
  material.depthWrite = opacity > 0.35;
  material.needsUpdate = true;
}

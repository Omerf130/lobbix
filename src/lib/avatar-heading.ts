/**
 * Chibi avatar heading on the XZ plane (Three.js Y-up).
 *
 * Convention:
 * - Mesh is built with face/eyes on local **-Z** (Three.js default "forward").
 * - A Y rotation `θ` maps local -Z to world `(-sin(θ), 0, -cos(θ))`.
 * - To align the face with movement `(dx, dz)` (normalized on XZ):
 *     θ = atan2(-dx, -dz)
 *
 * Example: move world +Z → θ = π → local -Z points +Z (walk away from a camera behind -Z).
 */
export function headingYFromMovementDirection(moveX: number, moveZ: number): number {
  return Math.atan2(-moveX, -moveZ);
}

/** Shortest-path interpolation between two Y headings (radians). */
export function lerpHeadingY(current: number, target: number, t: number): number {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * t;
}

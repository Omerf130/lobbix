import assert from 'node:assert/strict';

function segmentIntersectsAabb(p0x, p0y, p0z, p1x, p1y, p1z, box) {
  const dx = p1x - p0x;
  const dy = p1y - p0y;
  const dz = p1z - p0z;
  let tmin = 0;
  let tmax = 1;
  const axes = [
    [dx, box.minX - p0x, box.maxX - p0x],
    [dy, box.minY - p0y, box.maxY - p0y],
    [dz, box.minZ - p0z, box.maxZ - p0z],
  ];
  for (const [d, minB, maxB] of axes) {
    if (Math.abs(d) < 1e-6) {
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

const leftWall = { minX: -6.17, maxX: -5.85, minY: 0, maxY: 3.55, minZ: -8.2, maxZ: 8.2 };

// Camera beside spawn looking at avatar — should hit left/right shell when orbited.
assert.ok(
  segmentIntersectsAabb(-6.0, 2.5, 5.2, 0, 1, 5.2, leftWall),
  'side orbit should intersect left boundary',
);

// Center corridor spawn view should not require far wall between cam and avatar at yaw π.
const farWall = { minX: -6, maxX: 6, minY: 0, maxY: 3.55, minZ: -7.12, maxZ: -6.8 };
assert.ok(
  !segmentIntersectsAabb(0, 3, 10.5, 0, 1, 5.2, farWall),
  'spawn +Z camera to avatar should not cross far wall',
);

console.log('lobby-wall-occlusion-check: ok');

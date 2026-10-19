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

/** Mirrors PERSONAL_LOBBY_CLUB_LAYOUT (4B.3E) — update when arena bounds change. */
const hx = 6.15;
const hz = 4.65;
const wallT = 0.32;
const wallH = 3.55;
const spawnZ = 3.05;
const farWallZ = -hz + 0.58;
const boundaryHx = hx + wallT / 2;
const halfD = hz * 2 + 1.4;
const halfD2 = halfD / 2;

const leftWall = {
  minX: -boundaryHx - wallT / 2,
  maxX: -boundaryHx + wallT / 2,
  minY: 0,
  maxY: wallH,
  minZ: -halfD2,
  maxZ: halfD2,
};

// Camera beside spawn looking at avatar — should hit left/right shell when orbited.
assert.ok(
  segmentIntersectsAabb(-6.5, 2.5, spawnZ, 0, 1, spawnZ, leftWall),
  'side orbit should intersect left boundary',
);

// Center corridor spawn view should not require far wall between cam and avatar at yaw π.
const farWall = {
  minX: -(hx * 2 + 1.4) / 2,
  maxX: (hx * 2 + 1.4) / 2,
  minY: 0,
  maxY: wallH,
  minZ: farWallZ - wallT / 2,
  maxZ: farWallZ + wallT / 2,
};
const camZ = spawnZ + 5.8 * Math.cos(0.35);
assert.ok(
  !segmentIntersectsAabb(0, 3, camZ, 0, 1, spawnZ, farWall),
  'spawn +Z camera to avatar should not cross far wall',
);

console.log('lobby-wall-occlusion-check: ok');

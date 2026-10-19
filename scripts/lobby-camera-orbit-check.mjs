import assert from 'node:assert/strict';

/** Mirrors ChibiMovementRig orbit (no arena clamp — same as dev movement test). */
const CAMERA_FOLLOW_DISTANCE = 5.8;
const CAMERA_Y_ANCHOR = 1.2;

function orbitPosition(targetX, targetZ, yaw, pitch, distance = CAMERA_FOLLOW_DISTANCE) {
  return {
    x: targetX - Math.sin(yaw) * Math.cos(pitch) * distance,
    y: Math.sin(pitch) * distance + CAMERA_Y_ANCHOR,
    z: targetZ - Math.cos(yaw) * Math.cos(pitch) * distance,
  };
}

const targetX = 0;
const targetZ = 5.2;
const pitch = 0.35;
const expectedY = orbitPosition(targetX, targetZ, 0, pitch).y;

{
  let prev = null;
  let maxStep = 0;
  for (let i = 0; i <= 72; i += 1) {
    const yaw = (i / 72) * Math.PI * 2;
    const next = orbitPosition(targetX, targetZ, yaw, pitch);
    assert.ok(Math.abs(next.y - expectedY) < 1e-9, `pitch fixed → constant Y step ${i}`);
    if (prev) {
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const dz = next.z - prev.z;
      maxStep = Math.max(maxStep, Math.sqrt(dx * dx + dy * dy + dz * dz));
      assert.ok(Math.abs(dy) < 1e-9, 'horizontal orbit has no Y drift');
    }
    prev = next;
  }
  assert.ok(maxStep < 1.6, `smooth 360 orbit, max step ${maxStep}`);
}

console.log('lobby-camera-orbit-check: ok');

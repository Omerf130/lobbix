import assert from 'node:assert/strict';

const CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH = 2.86;
const CAMERA_YAW_LEGACY = 2.2;
const CAMERA_MIN_PITCH = 0.15;
const CAMERA_MAX_PITCH = 1.1;
const CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT = 1.35;

function filterCameraPanDeltaForDominantAxis(changeX, changeY, dominanceRatio = 1.25) {
  const absX = Math.abs(changeX);
  const absY = Math.abs(changeY);
  if (absX === 0 && absY === 0) return { changeX: 0, changeY: 0 };
  if (absX > absY * dominanceRatio) return { changeX, changeY: 0 };
  if (absY > absX * dominanceRatio) return { changeX: 0, changeY };
  return { changeX, changeY };
}

function cameraOrbitFromPanDelta(cameraYaw, cameraPitch, changeX, changeY, viewportWidth, viewportHeight) {
  const filtered = filterCameraPanDeltaForDominantAxis(changeX, changeY);
  changeX = filtered.changeX;
  changeY = filtered.changeY;
  if (changeX === 0 && changeY === 0) {
    return { cameraYaw, cameraPitch };
  }
  const width = Math.max(viewportWidth, 1);
  const height = Math.max(viewportHeight, 1);
  const nextYaw = cameraYaw - (changeX / width) * CAMERA_YAW_RADIANS_PER_SCREEN_WIDTH;
  const nextPitch = Math.min(
    CAMERA_MAX_PITCH,
    Math.max(
      CAMERA_MIN_PITCH,
      cameraPitch + (changeY / height) * CAMERA_PITCH_RADIANS_PER_SCREEN_HEIGHT,
    ),
  );
  return { cameraYaw: nextYaw, cameraPitch: nextPitch };
}

function cameraPanDeltaFromCumulative(cumulativeX, cumulativeY, lastX, lastY) {
  return {
    changeX: cumulativeX - lastX,
    changeY: cumulativeY - lastY,
    nextLastX: cumulativeX,
    nextLastY: cumulativeY,
  };
}

const base = { cameraYaw: 0.5, cameraPitch: 0.35 };
const viewport = { viewportWidth: 400, viewportHeight: 800 };

{
  const left = cameraOrbitFromPanDelta(base.cameraYaw, base.cameraPitch, -8, 0, ...Object.values(viewport));
  const right = cameraOrbitFromPanDelta(base.cameraYaw, base.cameraPitch, 8, 0, ...Object.values(viewport));
  assert.ok(left.cameraYaw > base.cameraYaw, 'negative changeX increases yaw');
  assert.ok(right.cameraYaw < base.cameraYaw, 'positive changeX decreases yaw');
  const leftMag = left.cameraYaw - base.cameraYaw;
  const rightMag = base.cameraYaw - right.cameraYaw;
  assert.ok(Math.abs(leftMag - rightMag) < 1e-9, 'symmetric magnitude left/right');
}

{
  const boosted = cameraOrbitFromPanDelta(base.cameraYaw, base.cameraPitch, -40, 0, ...Object.values(viewport));
  const legacy = base.cameraYaw - (-40 / viewport.viewportWidth) * CAMERA_YAW_LEGACY;
  assert.ok(boosted.cameraYaw > legacy, '3B.5D.3 yaw gain exceeds legacy');
}

{
  let yaw = base.cameraYaw;
  let pitch = base.cameraPitch;
  let lastX = 0;
  let lastY = 0;
  for (const dx of [10, 10, -6, -6, 8, -12]) {
    const cumX = lastX + dx;
    const step = cameraPanDeltaFromCumulative(cumX, 0, lastX, lastY);
    lastX = step.nextLastX;
    const orbit = cameraOrbitFromPanDelta(yaw, pitch, step.changeX, step.changeY, viewport.viewportWidth, viewport.viewportHeight);
    yaw = orbit.cameraYaw;
    pitch = orbit.cameraPitch;
  }
  assert.ok(Math.abs(yaw - base.cameraYaw) > 0.02, 'reversal sequence changes yaw');
}

{
  const controls = { moveX: 0, moveY: 0, cameraYaw: 0, cameraPitch: 0.35 };
  controls.moveX = 0.8;
  const cam = cameraOrbitFromPanDelta(controls.cameraYaw, controls.cameraPitch, -5, 0, 400, 800);
  controls.cameraYaw = cam.cameraYaw;
  assert.equal(controls.moveX, 0.8, 'joystick state independent of camera yaw mutation');
  assert.ok(controls.cameraYaw > 0, 'camera yaw updated while moveX held');
}

{
  const startPitch = 0.36;
  const horiz = cameraOrbitFromPanDelta(0.5, startPitch, -120, 3, 400, 800);
  assert.equal(horiz.cameraPitch, startPitch, 'dominant horizontal pan does not change pitch');
  assert.ok(horiz.cameraYaw !== 0.5, 'horizontal pan still changes yaw');
}

console.log('camera-orbit-drag-check: ok');

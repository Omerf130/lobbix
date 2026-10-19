import assert from 'node:assert/strict';

const MIN = 3.5;
const MAX = 8;
const DEFAULT = 5.8;

function clamp(d) {
  return Math.min(MAX, Math.max(MIN, d));
}

function distanceFromPinch(startDistance, scale) {
  return clamp(startDistance / Math.max(scale, 0.05));
}

assert.equal(clamp(DEFAULT), DEFAULT);
assert.equal(clamp(2), MIN);
assert.equal(clamp(10), MAX);

assert.ok(Math.abs(distanceFromPinch(5.8, 1) - 5.8) < 1e-9, 'scale 1 unchanged');
assert.ok(distanceFromPinch(5.8, 2) < 5.8, 'spread → closer');
assert.ok(distanceFromPinch(5.8, 0.5) > 5.8, 'pinch in → farther');
assert.equal(distanceFromPinch(5.8, 0.01), MAX);
assert.equal(distanceFromPinch(5.8, 100), MIN);

console.log('camera-pinch-zoom-check: ok');

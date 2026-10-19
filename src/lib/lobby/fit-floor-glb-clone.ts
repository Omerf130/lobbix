import { Box3, Object3D, Vector3 } from 'three';

const _box = new Box3();
const _size = new Vector3();
const _center = new Vector3();

export type FitFloorGlbOptions = {
  /** Target width (world X after parent rotation). */
  targetSizeX: number;
  /** Target depth (world Z after parent rotation). */
  targetSizeZ: number;
  /** Optional cap so vertical size stays believable (uniform scale). */
  targetMaxHeight?: number;
};

/** Clone a GLB root, uniform-scale to a footprint, pivot bottom-center to y=0. */
export function cloneAndFitFloorGlb(root: Object3D, opts: FitFloorGlbOptions): Object3D {
  const model = root.clone(true);
  model.updateMatrixWorld(true);
  _box.setFromObject(model);
  _box.getSize(_size);

  let scale = Math.min(opts.targetSizeX / _size.x, opts.targetSizeZ / _size.z);
  if (opts.targetMaxHeight !== undefined && _size.y > 1e-6) {
    scale = Math.min(scale, opts.targetMaxHeight / _size.y);
  }

  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);

  _box.setFromObject(model);
  _box.getCenter(_center);
  model.position.set(-_center.x, -_box.min.y, -_center.z);

  return model;
}

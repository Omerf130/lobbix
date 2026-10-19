import { Box3, Object3D, Vector3 } from 'three';
import type { GLTF } from 'three-stdlib';
import { SkeletonUtils } from 'three-stdlib';

/** Ground feet at y=0 and normalize height (~1.05m) for skinned Chibi GLB. */
export function fitSkinnedChibiClone(scene: GLTF['scene']): Object3D {
  const model = SkeletonUtils.clone(scene);
  model.updateMatrixWorld(true);

  const box = new Box3().setFromObject(model);
  const center = new Vector3();
  const size = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  model.position.set(-center.x, -box.min.y, -center.z);

  const targetHeight = 1.05;
  if (size.y > 1e-6) {
    model.scale.setScalar(targetHeight / size.y);
  }

  return model;
}

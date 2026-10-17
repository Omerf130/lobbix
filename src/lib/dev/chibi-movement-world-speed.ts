/**
 * World-space XZ speed (m/s) for `/dev/chibi-movement-test`.
 *
 * Procedural movement test uses ~4.2 m/s for a placeholder capsule; `Casual_Walk`
 * is ~4.17 s per cycle at natural playback (1×). This value is tuned for a ~1.05 m
 * chibi to reduce foot slide without speeding up the clip.
 */
export const CHIBI_MOVEMENT_WORLD_SPEED_METERS_PER_SEC = 1.15;

/** Previous shared constant before 3B.5D.2 (procedural test speed). */
export const CHIBI_MOVEMENT_LEGACY_PROCEDURAL_SPEED = 4.2;

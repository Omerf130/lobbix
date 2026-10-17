/**
 * Compute per-event pan delta from cumulative PanResponder `dx`/`dy`.
 * Keeps direction reversals correct within one touch (no worklet/JS races).
 */
export function cameraPanDeltaFromCumulative(
  cumulativeX: number,
  cumulativeY: number,
  lastCumulativeX: number,
  lastCumulativeY: number,
): { changeX: number; changeY: number; nextLastX: number; nextLastY: number } {
  const changeX = cumulativeX - lastCumulativeX;
  const changeY = cumulativeY - lastCumulativeY;
  return {
    changeX,
    changeY,
    nextLastX: cumulativeX,
    nextLastY: cumulativeY,
  };
}

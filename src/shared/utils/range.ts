/**
 * A pair that specifies the lower (including) and upper (including) bounds of a
 * contiguous subrange of integer values.
 */
export type RangeBounds = [lowerIncl: number, upperIncl: number]

/**
 * The list of values in the subrange defined by a bounding pair.
 * @throws {RangeError} If the upper bound is lower than the lower bound.
 */
export const range = (bounds: RangeBounds): number[] => {
  const [start, end] = bounds

  if (start > end) {
    throw new RangeError("The upper bound must be greater than or equal to the lower bound.")
  }

  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

/**
 * Checks whether the passed `value` is within the range specified by the passed
 * `bounds`.
 */
export const isInRange = (bounds: RangeBounds, value: number): boolean =>
  value >= bounds[0] && value <= bounds[1]

/**
 * Returns the index of a value in a range.
 * @throws {RangeError} If the passed `value` is not within the range specified.
 */
export const indexInRange = (bounds: RangeBounds, value: number) => {
  if (!isInRange(bounds, value)) {
    throw new RangeError(
      `indexInRange: index for ${value} is out of range (${bounds[0]}...${bounds[1]})`,
    )
  }

  return value - bounds[0]
}

/**
 * Returns the size of the range defined by the passed bounds.
 */
export const rangeSize = (bounds: RangeBounds): number =>
  bounds[0] <= bounds[1] ? bounds[1] - bounds[0] + 1 : 0


/**
 * Filters out `null` and `undefined` values from an array.
 */
export const filterNonNullable = <T>(array: T[]): NonNullable<T>[] =>
  array.filter((item): item is NonNullable<T> => item !== null && item !== undefined)

/**
 * Returns a range of numbers from `start` to `end` (inclusive).
 * @param start The first number in the range.
 * @param end The last number in the range.
 * @throws `RangeError` if the upper bound is lower than the lower bound.
 */
export const range = (
  start: number,
  end: number,
): number[] => {
  if (start > end) {
    throw new RangeError("The upper bound must be greater than or equal to the lower bound.")
  }

  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

/**
 * Returns a range of numbers between and including two numbers. The order of
 * the arguments does not matter.
 * @param num1 The first number in the range.
 * @param num2 The last number in the range.
 */
export const rangeSafe = (start: number, end: number): number[] =>
  start > end ? range(end, start) : range(start, end)

/**
 * Returns the sum of all numbers in the given array.
 */
export const sum = (arr: number[]): number =>
  arr.reduce((acc, value) => acc + value, 0)

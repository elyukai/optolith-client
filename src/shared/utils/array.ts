import { isNotNullish } from "./nullable.ts"

/**
 * Filters out `null` and `undefined` values from the arguments and turns them
 * into an array.
 */
export const arrayFromNonNullable = <T>(...args: T[]): NonNullable<T>[] => args.filter(isNotNullish)

/**
 * Filters out `null` and `undefined` values from an array.
 */
export const filterNonNullable = <T>(array: T[]): NonNullable<T>[] => array.filter(isNotNullish)

/**
 * Returns a range of numbers from `start` to `end` (inclusive).
 * @param start The first number in the range.
 * @param end The last number in the range.
 * @throws `RangeError` if the upper bound is lower than the lower bound.
 */
export const range = (start: number, end: number): number[] => {
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
export const sum = (arr: number[]): number => arr.reduce((acc, value) => acc + value, 0)

/**
 * Filters out duplicate values from an array. Objects are not supported, since
 * they don’t provide value equality semantics.
 */
export const unique = <T extends number | boolean | string | null | undefined>(arr: T[]): T[] =>
  Array.from(new Set(arr))

/**
 * Returns `true` if the two arrays are equal, `false` otherwise.
 */
export const arrayEqual = <T extends number | boolean | string | null | undefined>(
  arr1: T[],
  arr2: T[],
): boolean => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])

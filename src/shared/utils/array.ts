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
 * @param start The first number in the range.
 * @param end The last number in the range.
 */
export const rangeSafe = (start: number, end: number): number[] =>
  start > end ? range(end, start) : range(start, end)

/**
 * Returns the sum of all numbers in the given array.
 */
export const sum = (arr: number[]): number => arr.reduce((acc, value) => acc + value, 0)

/**
 * Returns the sum of values returned by applying the given function to each
 * element in the array.
 */
export const sumWith = <T>(arr: T[], fn: (value: T) => number): number =>
  arr.reduce((acc, value) => acc + fn(value), 0)

/**
 * Filters out duplicate values from an array. Objects are not supported, since
 * they don’t provide value equality semantics.
 */
export const unique = <T extends number | boolean | string | symbol | null | undefined>(
  arr: T[],
): T[] => Array.from(new Set(arr))

/**
 * Returns `true` if the two arrays are equal, `false` otherwise.
 */
export const arrayEqual = <T extends number | boolean | string | symbol | null | undefined>(
  arr1: T[],
  arr2: T[],
): boolean => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])

/**
 * Returns `undefined` if the array is empty, otherwise the non-empty array.
 */
export const ensureNonEmpty = <T>(arr: T[]): T[] | undefined => (arr.length > 0 ? arr : undefined)

/**
 * Counts the number of elements in an array that satisfy the given predicate.
 */
export const count = <T>(arr: T[], predicate: (value: T, index: number) => boolean): number =>
  arr.reduce((acc, value, index) => (predicate(value, index) ? acc + 1 : acc), 0)

/**
 * Counts the number of elements the function returns the same value for and
 * returns the count for all returned values as an object.
 */
export const countBy = <T, K extends string | number | symbol>(
  arr: T[],
  fn: (value: T, index: number) => K,
): { [key in K]: number } =>
  arr.reduce((acc, value, index) => {
    const key = fn(value, index)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {} as { [key in K]: number })

/**
 * Counts the number of elements the function returns the same values for and
 * returns the count for all returned values as an object.
 */
export const countByMany = <T, K extends string | number | symbol>(
  arr: T[],
  fn: (value: T, index: number) => K[],
): { [key in K]: number } =>
  arr.reduce((acc, value, index) => {
    const keys = fn(value, index)
    unique(keys).forEach(key => {
      acc[key] = (acc[key] ?? 0) + 1
    })
    return acc
  }, {} as { [key in K]: number })

/**
 * Partitions an array into two arrays based on a predicate.
 * @param arr The array to split.
 * @param predicate The function to apply to each element in the array.
 * @returns An array with two elements, the first one containing all elements
 * that satisfy the predicate, the second one containing all elements that do
 * not satisfy the predicate.
 */
export function partition<T, T1 extends T>(
  arr: T[],
  predicate: (value: T) => value is T1,
): [pos: T1[], neg: T[]]
export function partition<T>(arr: T[], predicate: (value: T) => boolean): [pos: T[], neg: T[]]
/**
 * Partitions an array into two arrays based on a predicate.
 * @param arr The array to split.
 * @param predicate The function to apply to each element in the array.
 * @returns An array with two elements, the first one containing all elements
 * that satisfy the predicate, the second one containing all elements that do
 * not satisfy the predicate.
 */
export function partition<T>(arr: T[], predicate: (value: T) => boolean): [pos: T[], neg: T[]] {
  return arr.reduce<[T[], T[]]>(
    (acc, value) => {
      acc[predicate(value) ? 0 : 1].push(value)
      return acc
    },
    [[], []],
  )
}

/**
 * Reduces an array, but stops as soon as the predicate returns `true` for an
 * accumulated value (including the initial value) and returns the last
 * accumulated value.
 * @param arr The array to reduce.
 * @param fn The function to apply to each element in the array.
 * @param pred The predicate to apply to the initial value and to every result
 * of a call to `fn`, where if it returns `true`, the reduction stops.
 * @param initial The initial value.
 */
export const reduceWhile = <T, U>(
  arr: T[],
  fn: (acc: U, value: T, index: number) => U,
  pred: (acc: U) => boolean,
  initial: U,
): U => {
  let acc = initial
  let index = 0
  while (index < arr.length && !pred(acc)) {
    acc = fn(acc, arr[index]!, index)
    index++
  }
  return acc
}

/**
 * Returns `true` if the array contains at least `minCount` elements that
 * satisfy the given predicate, `false` otherwise.
 */
export const someCount = <T>(
  arr: T[],
  predicate: (value: T) => boolean,
  minCount: number,
): boolean =>
  reduceWhile(
    arr,
    (acc, value) => (predicate(value) ? acc + 1 : acc),
    acc => acc >= minCount,
    0,
  ) >= minCount

/**
 * Returns a new array with all elements from the original array except for the
 * given index.
 */
export const removeIndex = <T>(arr: T[], index: number): T[] => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
]

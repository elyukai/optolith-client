/**
 * Filters out `null` and `undefined` values from an array.
 */
export const filterNonNullable = <T>(array: T[]): NonNullable<T>[] =>
  array.filter((item): item is NonNullable<T> => item !== null && item !== undefined)

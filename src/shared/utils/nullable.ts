/**
 * Checks if a value is `null` or `undefined`.
 */
export const isNullish = <T>(value: T): value is Exclude<T, NonNullable<T>> =>
  value === null || value === undefined

/**
 * Checks if a value is not `null` or `undefined`.
 */
export const isNotNullish = <T>(value: T): value is NonNullable<T> =>
  !isNullish(value)

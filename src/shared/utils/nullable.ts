export type Nullish<T = null | undefined> = Exclude<T, NonNullable<T>>

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

/**
 * Maps a value to another value if it is not `null` or `undefined`, otherwise
 * returns a default value.
 */
export const mapNullableDefault = <T, U>(
  value: T,
  map: (value: NonNullable<T>) => U,
  defaultValue: U,
): U =>
  isNotNullish(value) ? map(value) : defaultValue

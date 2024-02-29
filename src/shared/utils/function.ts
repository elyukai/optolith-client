/**
 * Returns a function that always returns the given value.
 * @param value The value to return from the new function.
 * @returns A new function that always returns the given value.
 */
export const constant =
  <T>(value: T) =>
  () =>
    value

/**
 * Returns a function that applies the given predicates to the given value and
 * returns `true` if all predicates return `true`.
 */
export const andEvery =
  <T>(...predicates: ((value: T) => boolean)[]) =>
  (value: T): boolean =>
    predicates.every(predicate => predicate(value))

export function orSome<T, U extends T, V extends T>(
  f: (value: T) => value is U,
  g: (value: T) => value is V,
): (value: T) => value is U | V
export function orSome<T>(...fns: ((value: T) => boolean)[]): (value: T) => boolean
/**
 * Returns a function that combines predicate functions disjunctionally.
 */
export function orSome<T>(...predicates: ((value: T) => boolean)[]): (value: T) => boolean {
  return value => predicates.some(predicate => predicate(value))
}

/**
 * Returns a function that applies the given predicate to the given value and
 * returns the negated result.
 */
export const not =
  <T>(predicate: (value: T) => boolean) =>
  (value: T): boolean =>
    !predicate(value)

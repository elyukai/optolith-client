/**
 * The type of a compare function that can be used to sort values.
 * @returns A negative number if `a` should be sorted before `b`, a positive
 * number if `a` should be sorted after `b`, or zero if `a` and `b` are equal.
 */
export type Compare<T> = (a: T, b: T) => number

/**
 * Build a compare function for values that are nested inside other values. The
 * nested value is getting extracted by the provided accessor function and then
 * compared using the provided compare function. An optional `reverse` parameter
 * can be used to reverse the sort order.
 */
export const compareAt = <T, U>(
  accessor: (value: T) => U,
  compare: (a: U, b: U) => number,
  reverse = false,
): Compare<T> => (a, b) => {
  const result = compare(accessor(a), accessor(b))
  return reverse ? -result : result
}

/**
 * Build a compare function that nests multiple compare functions. The functions
 * are applied in order, so the first function is the primary sort key, the
 * second function is the secondary sort key, and so on.
 */
export const reduceCompare = <T>(...compares: Compare<T>[]): Compare<T> => (a, b) => {
  for (const compare of compares) {
    const result = compare(a, b)
    if (result !== 0) {
      return result
    }
  }

  return 0
}

/**
 * Compare function for numbers that sorts them in ascending order.
 */
export const numAsc: Compare<number> = (a, b) => a - b

export type Equality<T> = (a: T, b: T) => boolean

/**
 * Build an equality function for values that are nested inside other values.
 * The nested value is getting extracted by the provided accessor function and
 * then compared using the provided equality function.
 */
export const equalityAt = <T, U>(
  accessor: (value: T) => U,
  equality: Equality<U>,
): Equality<T> => (a, b) => equality(accessor(a), accessor(b))

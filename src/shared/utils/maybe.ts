/**
 * A maybe can contain a value or nothing.
 */
export type Maybe<T> = Just<T> | Nothing

/**
 * A maybe that contains a value.
 */
export type Just<T> = { readonly tag: "Just"; readonly value: T }

/**
 * A maybe that contains nothing.
 */
export type Nothing = { readonly tag: "Nothing" }

/**
 * Creates a maybe that contains a value.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Just = <T>(value: T): Maybe<T> => ({ tag: "Just", value })

/**
 * Checks if a maybe contains a value.
 */
export const isJust = <T>(result: Maybe<T>): result is Just<T> => result.tag === "Just"

/**
 * Creates a maybe that contains nothing.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Nothing: Maybe<never> = { tag: "Nothing" }

/**
 * Checks if a maybe contains nothing.
 */
export const isNothing = <T>(result: Maybe<T>): result is Nothing => result.tag === "Nothing"

/**
 * Creates a maybe from a nullable value.
 */
export const fromNullable = <T>(value: T): Maybe<NonNullable<T>> =>
  value === null || value === undefined ? Nothing : Just(value)

/**
 * Reduces a maybe to a value of a common type.
 */
export const reduce = <T, R>(maybe: Maybe<T>, def: R, f: (value: T) => R): R =>
  isJust(maybe) ? f(maybe.value) : def

/**
 * Maps the value of a maybe to a new value.
 */
export const map = <T, U>(maybe: Maybe<T>, f: (value: T) => U): Maybe<U> =>
  isJust(maybe) ? Just(f(maybe.value)) : Nothing

/**
 * Combines two maybes into one maybe. If both maybes contain a value, the
 * values are combined using the provided function. If at least one maybe
 * contains nothing, nothing is returned.
 */
export const combine = <T1, T2, TR>(
  maybe1: Maybe<T1>,
  maybe2: Maybe<T2>,
  f: (value1: T1, value2: T2) => TR,
): Maybe<TR> => (isJust(maybe1) && isJust(maybe2) ? Just(f(maybe1.value, maybe2.value)) : Nothing)

/**
 * A namespace for maybe functions.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Maybe = Object.freeze({
  Just,
  isJust,
  Nothing,
  isNothing,
  fromNullable,
  reduce,
  map,
  combine,
})

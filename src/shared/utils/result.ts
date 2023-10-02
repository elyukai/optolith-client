/**
 * A result is either a value or an error.
 */
export type Result<T, E> = Ok<T> | Error<E>

/**
 * A result that contains a value.
 */
export type Ok<T> = { readonly tag: "Ok"; readonly value: T }

/**
 * A result that contains an error.
 */
export type Error<E> = { readonly tag: "Error"; readonly error: E }

/**
 * Creates a result that contains a value.
 */
export const ok = <T>(value: T): Result<T, never> => ({ tag: "Ok", value })

/**
 * Checks if a result contains a value.
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> => result.tag === "Ok"

/**
 * Creates a result that contains an error.
 */
export const error = <E>(err: E): Result<never, E> => ({ tag: "Error", error: err })

/**
 * Checks if a result contains an error.
 */
export const isError = <T, E>(result: Result<T, E>): result is Error<E> => result.tag === "Error"

/**
 * Reduces a result to a value of a common type.
 */
export const reduce = <T, E, R>(
  result: Result<T, E>,
  fok: (value: T) => R,
  ferror: (error: E) => R,
): R => (isOk(result) ? fok(result.value) : ferror(result.error))

/**
 * Maps the value of a result to a new value.
 */
export const map = <T, U, E>(result: Result<T, E>, f: (value: T) => U): Result<U, E> =>
  isOk(result) ? ok(f(result.value)) : result

/**
 * Maps an error to a new error.
 */
export const mapError = <T, E, F>(result: Result<T, E>, f: (value: E) => F): Result<T, F> =>
  isError(result) ? error(f(result.error)) : result

/**
 * Combines two results into one result. If both results are ok, the values are
 * combined using the provided function. If one result is an error, the error is
 * returned. If both results are errors, the errors are combined using the
 * provided function.
 */
export const combine = <T1, T2, TR, E1, E2, ER>(
  result1: Result<T1, E1>,
  result2: Result<T2, E2>,
  fok: (value1: T1, value2: T2) => TR,
  ferror: (error1: E1, error2: E2) => ER,
): Result<TR, E1 | E2 | ER> =>
  isOk(result1)
    ? isOk(result2)
      ? ok(fok(result1.value, result2.value))
      : result2
    : isOk(result2)
    ? result1
    : error(ferror(result1.error, result2.error))

/**
 * A namespace for result functions.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Result = Object.freeze({
  ok,
  isOk,
  error,
  isError,
  reduce,
  map,
  mapError,
  combine,
})

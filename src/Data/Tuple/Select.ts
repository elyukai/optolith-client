import { Tuple } from "../Tuple"

type FilterNumber<A> = Extract<A, number>

const sel =
  (fname: string) =>
  <A extends any[]>
  (x: Tuple<A>) =>
  <I extends FilterNumber<keyof A>>
  (i: I): A[I] => {
    if (i > x .length - 1 || i < 0) {
      throw new TypeError (
        `${fname}: Tuple is of length ${x .length}, but you tried to access a `
        + `value at position ${i}.`
      )
    }

    return x .values [i as number]
  }

/**
 * `sel1 :: (a, ...) -> a`
 *
 * Returns the first element of a tuple.
 */
export const sel1 =
  <A extends any[]> (x: Tuple<A>): A[0] =>
    sel ("sel1") (x) (0 as FilterNumber<keyof A>)

/**
 * `sel2 :: (a, b, ...) -> b`
 *
 * Returns the second element of a tuple.
 */
export const sel2 =
  <A extends any[]> (x: Tuple<A>): A[1] =>
    sel ("sel1") (x) (1 as FilterNumber<keyof A>)

/**
 * `sel3 :: (a, b, c, ...) -> c`
 *
 * Returns the third element of a tuple.
 */
export const sel3 =
  <A extends any[]> (x: Tuple<A>): A[2] =>
    sel ("sel1") (x) (2 as FilterNumber<keyof A>)

/**
 * `sel4 :: (a, b, c, d, ...) -> d`
 *
 * Returns the 4th element of a tuple.
 */
export const sel4 =
  <A extends any[]> (x: Tuple<A>): A[3] =>
    sel ("sel1") (x) (3 as FilterNumber<keyof A>)

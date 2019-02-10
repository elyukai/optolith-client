/**
 * @module Data.Pair
 *
 * A pair (`(a, b)`) is a simple flat data structure for lists of values of
 * different types but constant length.
 *
 * @author Lukas Obermann
 */


// CONSTRUCTOR

interface PairPrototype<A> {
  readonly isPair: true
}

export interface Pair<A, B> extends PairPrototype<A> {
  readonly first: A
  readonly second: B
  readonly prototype: PairPrototype<A>
}

const PairPrototype =
  Object.freeze<PairPrototype<any>> ({
    isPair: true,
  })

/**
 * `fromBoth :: a -> b -> (a, b)`
 *
 * Creates a new `Pair` instance from the passed arguments.
 */
export const fromBoth =
  <A, B> (firstValue: A) => (secondValue: B): Pair<A, B> =>
    Object.create (
      PairPrototype,
      {
        first: {
          value: firstValue,
          enumerable: true,
        },
        second: {
          value: secondValue,
          enumerable: true,
        },
      }
    )

/**
 * `fromBinary :: (a, b) -> (a, b)`
 *
 * Creates a new `Pair` instance from the passed arguments.
 */
export const fromBinary =
  <A, B> (firstValue: A, secondValue: B): Pair<A, B> =>
    fromBoth<A, B> (firstValue) (secondValue)


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> (a, c) -> (b, d)`
 */
export const bimap =
  <A, B, C, D>
  (fFirst: (first: A) => B) =>
  (fSecond: (second: C) => D) =>
  (x: Pair<A, C>): Pair<B, D> =>
    fromBoth<B, D> (fFirst (x .first)) (fSecond (x .second))

/**
* `first :: (a -> b) -> (a, c) -> (b, c)`
*/
export const first =
  <A, B>
  (f: (first: A) => B) =>
  <C>
  (x: Pair<A, C>): Pair<B, C> =>
    fromBoth<B, C> (f (x .first)) (x .second)

/**
* `second :: (b -> c) -> (a, b) -> (a, c)`
*/
export const second =
  <A, B, C>
  (f: (second: B) => C) => (x: Pair<A, B>): Pair<A, C> =>
    fromBoth<A, C> (x .first) (f (x .second))


// PAIR FUNCTIONS

/**
 * `fst :: (a, b) -> a`
 *
 * Extract the first component of a pair.
 */
export const fst = <A> (x: Pair<A, any>): A => x .first

/**
 * `snd :: (a, b) -> b`
 *
 * Extract the second component of a pair.
 */
export const snd = <B> (x: Pair<any, B>): B => x .second

/**
 * `curry :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curry` converts an uncurried function to a curried function.
 */
export const curry =
  <A, B, C> (f: (x: Pair<A, B>) => C) => (a: A) => (b: B): C =>
    f (fromBinary (a, b))

/**
 * `uncurry :: (a -> b -> c) -> (a, b) -> c`
 *
 * `uncurry` converts a curried function to a function on pairs.
 */
export const uncurry =
  <A, B, C> (f: (a: A) => (b: B) => C) => (x: Pair<A, B>): C =>
    f (x .first) (x .second)

/**
 * `swap :: (a, b) -> (b, a)`
 *
 * Swap the components of a pair.
 */
export const swap =
  <A, B> (x: Pair<A, B>): Pair<B, A> =>
    fromBinary (x .second, x .first)


// CUSTOM FUNCTIONS

/**
 * `toArray :: (a, b) -> Array (b | a)`
 *
 * Converts the pair to a native `Array`.
 */
export const toArray = <A, B> (x: Pair<A, B>): [A, B] => [x .first, x .second]

/**
 * `fromArray :: (a, b) -> Array (b | a)`
 *
 * Creates a pair from a native `Array` of length `2`.
 */
export const fromArray = <A, B> (x: [A, B]): Pair<A, B> => fromBinary (...x)

/**
 * `isPair :: a -> Bool`
 *
 * Return `True` if the given value is an pair.
 */
export const isPair =
  (x: any): x is Pair<any, any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === PairPrototype


// NAMESPACED FUNCTIONS

export const Pair = {
  fromBoth,
  fromBinary,

  bimap,
  first,
  second,

  fst,
  snd,
  curry,
  uncurry,
  swap,

  toArray,
  fromArray,
  isPair,
}

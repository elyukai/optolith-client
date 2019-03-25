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

const _Pair =
  <A, B> (firstValue: A, secondValue: B): Pair<A, B> =>
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

export type PairP1 = <A> (first: A) => <B> (second: B) => Pair<A, B>
export type PairP1_ = <A, B> (first: A) => (second: B) => Pair<A, B>
export type PairP2 = <A, B> (first: A, second: B) => Pair<A, B>

interface PairConstructor {
  <A> (first: A): <B> (second: B) => Pair<A, B>
  <A, B> (first: A, second: B): Pair<A, B>

  bimap:
  <A, B, C, D>
  (fFirst: (first: A) => B) =>
  (fSecond: (second: C) => D) =>
  (x: Pair<A, C>) =>
  Pair<B, D>

  first: <A, B> (f: (first: A) => B) => <C> (x: Pair<A, C>) => Pair<B, C>
  second: <A, B, C>(f: (second: B) => C) => (x: Pair<A, B>) => Pair<A, C>

  fst: <A>(x: Pair<A, any>) => A
  snd: <B>(x: Pair<any, B>) => B
  curry: <A, B, C>(f: (x: Pair<A, B>) => C) => (a: A) => (b: B) => C
  uncurry: <A, B, C>(f: (a: A) => (b: B) => C) => (x: Pair<A, B>) => C
  swap: <A, B>(x: Pair<A, B>) => Pair<B, A>

  toArray: <A, B>(x: Pair<A, B>) => [A, B]
  fromArray: <A, B>(x: [A, B]) => Pair<A, B>
  isPair: (x: any) => x is Pair<any, any>
}

export const Pair =
  ((...args: [any] | [any, any]) => {
    if (args.length === 1) {
      return (b: any) => _Pair (args [0], b)
    }

    return _Pair (args [0], args [1])
  }) as PairConstructor


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> (a, c) -> (b, d)`
 */
export const bimap =
  <A, B, C, D>
  (fFirst: (first: A) => B) =>
  (fSecond: (second: C) => D) =>
  (x: Pair<A, C>): Pair<B, D> =>
    Pair (fFirst (x .first)) (fSecond (x .second))

/**
* `first :: (a -> b) -> (a, c) -> (b, c)`
*/
export const first =
  <A, B>
  (f: (first: A) => B) =>
  <C>
  (x: Pair<A, C>): Pair<B, C> =>
    Pair (f (x .first)) (x .second)

/**
* `second :: (b -> c) -> (a, b) -> (a, c)`
*/
export const second =
  <A, B, C>
  (f: (second: B) => C) => (x: Pair<A, B>): Pair<A, C> =>
    Pair (x .first) (f (x .second))


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
    f (Pair (a, b))

/**
 * `curryN :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curryN` converts an uncurried function to a curried function.
 */
export const curryN =
  <A, B, C> (f: (x: A, y: B) => C) => (a: A) => (b: B): C =>
    f (a, b)

/**
 * `uncurry :: (a -> b -> c) -> (a, b) -> c`
 *
 * `uncurry` converts a curried function to a function on pairs.
 */
export const uncurry =
  <A, B, C> (f: (a: A) => (b: B) => C) => (x: Pair<A, B>): C =>
    f (x .first) (x .second)

/**
 * `uncurryN :: (a -> b -> c) -> (a, b) -> c`
 *
 * `uncurryN` converts a curried function to a function on pairs.
 */
export const uncurryN =
  <A, B, C> (f: (a: A) => (b: B) => C) => (x: A, y: B): C =>
    f (x) (y)

/**
 * `uncurryN3 :: (a -> b -> c -> d) -> (a, b, c) -> d`
 *
 * `uncurryN3` converts a curried function to a function on pairs.
 */
export const uncurryN3 =
  <A, B, C, D> (f: (a: A) => (b: B) => (c: C) => D) => (x: A, y: B, z: C): D =>
    f (x) (y) (z)

/**
 * `swap :: (a, b) -> (b, a)`
 *
 * Swap the components of a pair.
 */
export const swap =
  <A, B> (x: Pair<A, B>): Pair<B, A> =>
    Pair (x .second, x .first)


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
export const fromArray = <A, B> (x: [A, B]): Pair<A, B> => Pair (...x)

/**
 * `isPair :: a -> Bool`
 *
 * Return `True` if the given value is an pair.
 */
export const isPair =
  (x: any): x is Pair<any, any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === PairPrototype


// NAMESPACED FUNCTIONS

Pair.bimap = bimap
Pair.first = first
Pair.second = second

Pair.fst = fst
Pair.snd = snd
Pair.curry = curry
Pair.uncurry = uncurry
Pair.swap = swap

Pair.toArray = toArray
Pair.fromArray = fromArray
Pair.isPair = isPair

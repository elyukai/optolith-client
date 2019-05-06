/**
 * @module Data.Tuple
 *
 * A tuple (`(a, b)`) is a simple flat data structure for lists of values of
 * different types but constant length.
 *
 * @author Lukas Obermann
 */

import { Internals } from "./Internals";


// CONSTRUCTOR

export interface Tuple<A extends any[]> extends Internals.TuplePrototype {
  readonly phantom: A
  readonly values: { [index: number]: any }
  readonly length: number
  readonly prototype: Internals.TuplePrototype
}

interface TupleConstructor {
  <A extends any[]> (...values: A): Tuple<A>

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
  isTuple: (x: any) => x is Tuple<any[]>
}

export const Tuple =
  ((...args: any[]) => {
    return Internals._Tuple (...args)
  }) as TupleConstructor


// CONSTRUCTOR SPECIFIED ON PAIRS

export type Pair<A, B> = Tuple<[A, B]>

export type PairP1 = <A> (first: A) => <B> (second: B) => Pair<A, B>
export type PairP1_ = <A, B> (first: A) => (second: B) => Pair<A, B>
export type PairP2 = <A, B> (first: A, second: B) => Pair<A, B>

interface PairConstructor {
  <A> (first: A): <B> (second: B) => Pair<A, B>
  <A, B> (first: A, second: B): Pair<A, B>
}

export const Pair =
  ((...args: [any] | [any, any]) => {
    if (args.length === 1) {
      return (b: any) => Tuple (args [0], b)
    }

    return Tuple (args [0], args [1])
  }) as PairConstructor


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> (a, c) -> (b, d)`
 */
export const bimap =
  <A, B>
  (fFirst: (first: A) => B) =>
  <C, D>
  (fSecond: (second: C) => D) =>
  (x: Tuple<[A, C]>): Tuple<[B, D]> => {
    if (x .length !== 2) {
      throw new TypeError (`bimap: Tuple is of length ${x .length} instead of length 2.`)
    }

    return Tuple (fFirst (x .values [0]), fSecond (x .values [1]))
  }

/**
* `first :: (a -> b) -> (a, c) -> (b, c)`
*/
export const first =
  <A, B>
  (f: (first: A) => B) =>
  <C>
  (x: Pair<A, C>): Pair<B, C> => {
    if (x .length !== 2) {
      throw new TypeError (`first: Tuple is of length ${x .length} instead of length 2.`)
    }

    return Tuple (f (x .values [0]), x .values [1])
  }

/**
* `second :: (b -> c) -> (a, b) -> (a, c)`
*/
export const second =
  <B, C>
  (f: (second: B) => C) =>
  <A>
  (x: Pair<A, B>): Pair<A, C> => {
    if (x .length !== 2) {
      throw new TypeError (`second: Tuple is of length ${x .length} instead of length 2.`)
    }

    return Tuple (x .values [0], f (x .values [1]))
  }


// PAIR FUNCTIONS

/**
 * `fst :: (a, b) -> a`
 *
 * Extract the first component of a pair.
 */
export const fst = <A> (x: Pair<A, any>): A => {
  if (x .length !== 2) {
    throw new TypeError (`fst: Tuple is of length ${x .length} instead of length 2.`)
  }

  return x .values [0]
}

/**
 * `snd :: (a, b) -> b`
 *
 * Extract the second component of a pair.
 */
export const snd = <B> (x: Pair<any, B>): B => {
  if (x .length !== 2) {
    throw new TypeError (`snd: Tuple is of length ${x .length} instead of length 2.`)
  }

  return x .values [1]
}

/**
 * `curry :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curry` converts an uncurried function to a curried function.
 */
export const curry =
  <A, B, C> (f: (x: Pair<A, B>) => C) => (a: A) => (b: B): C =>
    f (Tuple (a, b))

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
  <A, B, C> (f: (a: A) => (b: B) => C) => (x: Pair<A, B>): C => {
    if (x .length !== 2) {
      throw new TypeError (`uncurry: Tuple is of length ${x .length} instead of length 2.`)
    }

    return f (x .values [0]) (x .values [1])
  }

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
 * `uncurryN4 :: (a -> b -> c -> d -> e) -> (a, b, c, d) -> e`
 *
 * `uncurryN4` converts a curried function to a function on pairs.
 */
export const uncurryN4 =
  <A, B, C, D, E>
  (f: (a: A) => (b: B) => (c: C) => (c: D) => E) =>
  (x: A, y: B, z: C, a: D): E =>
    f (x) (y) (z) (a)

/**
 * `uncurryN5 :: (a -> b -> c -> d -> e -> f) -> (a, b, c, d, e) -> f`
 *
 * `uncurryN5` converts a curried function to a function on pairs.
 */
export const uncurryN5 =
  <A, B, C, D, E, F>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) =>
  (x: A, y: B, z: C, a: D, b: E): F =>
    f (x) (y) (z) (a) (b)

/**
 * `uncurryN6 :: (a -> b -> c -> d -> e -> f -> g) -> (a, b, c, d, e, f) -> g`
 *
 * `uncurryN6` converts a curried function to a function on pairs.
 */
export const uncurryN6 =
  <A, B, C, D, E, F, G>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => G) =>
  (x: A, y: B, z: C, a: D, b: E, c: F): G =>
    f (x) (y) (z) (a) (b) (c)

/**
 * `uncurryN7 :: (a -> b -> c -> d -> e -> f -> g -> h) -> (a, b, c, d, e, f, g) -> h`
 *
 * `uncurryN7` converts a curried function to a function on pairs.
 */
export const uncurryN7 =
  <A, B, C, D, E, F, G, H>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => H) =>
  (x: A, y: B, z: C, a: D, b: E, c: F, d: G): H =>
    f (x) (y) (z) (a) (b) (c) (d)

/**
 * `uncurryN8 :: (a -> b -> c -> d -> e -> f -> g -> h -> i) -> (a, b, c, d, e, f, g, h) -> i`
 *
 * `uncurryN8` converts a curried function to a function on pairs.
 */
export const uncurryN8 =
  <A, B, C, D, E, F, G, H, I>
  (f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => (f: F) => (g: G) => (h: H) => I) =>
  (x: A, y: B, z: C, a: D, b: E, c: F, d: G, e: H): I =>
    f (x) (y) (z) (a) (b) (c) (d) (e)

/**
 * `swap :: (a, b) -> (b, a)`
 *
 * Swap the components of a pair.
 */
export const swap =
  <A, B> (x: Pair<A, B>): Pair<B, A> => {
    if (x .length !== 2) {
      throw new TypeError (`swap: Tuple is of length ${x .length} instead of length 2.`)
    }

    return Tuple (x .values [1], x .values [0])
  }


// CUSTOM FUNCTIONS

/**
 * `toArray :: (a, b) -> Array (b | a)`
 *
 * Converts the pair to a native `Array`.
 */
export const toArray =
  <A extends any[]> (x: Tuple<A>): A => {
    const arr: A = [] as unknown as A

    for (let i = 0; i < x .length; i++) {
      const e = x .values [i]
      arr .push (e)
    }

    return arr
  }

/**
 * `fromArray :: (a, b) -> Array (b | a)`
 *
 * Creates a pair from a native `Array` of length `2`.
 */
export const fromArray = <A extends any[]> (x: A): Tuple<A> => Tuple (...x)

export import isTuple = Internals.isTuple


// NAMESPACED FUNCTIONS

Tuple.bimap = bimap
Tuple.first = first
Tuple.second = second

Tuple.fst = fst
Tuple.snd = snd
Tuple.curry = curry
Tuple.uncurry = uncurry
Tuple.swap = swap

Tuple.toArray = toArray
Tuple.fromArray = fromArray
Tuple.isTuple = isTuple

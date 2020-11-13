/**
 * @module Data.Tuple
 *
 * A tuple (`(a, b)`) is a simple flat data structure for lists of values of
 * different types but constant length.
 *
 * @author Lukas Obermann
 */

import * as ReTuple from "./Ley_Tuple.gen"


// CONSTRUCTOR SPECIFIED ON PAIRS

export type Pair<A, B> = [A, B]

export type PairP1 = <A> (first: A) => <B> (second: B) => Pair<A, B>
export type PairP1_ = <A, B> (first: A) => (second: B) => Pair<A, B>
export type PairP2 = <A, B> (first: A, second: B) => Pair<A, B>

interface PairConstructor {
  <A> (first: A): <B> (second: B) => Pair<A, B>
  <A, B> (first: A, second: B): Pair<A, B>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Pair =
  ((...args: [any] | [any, any]) => {
    if (args.length === 1) {
      return (b: any) => [ args [0], b ]
    }

    return [ args [0], args [1] ]
  }) as PairConstructor

export const PairF = <B> (second: B) => <A> (first: A): Pair<A, B> => [ first, second ]


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> (a, c) -> (b, d)`
 */
export const bimap =
  <A, B>
  (fFirst: (first: A) => B) =>
  <C, D>
  (fSecond: (second: C) => D) =>
  (x: Pair<A, C>): Pair<B, D> =>
    ReTuple.Bifunctor_bimap (fFirst, fSecond, x)

/**
* `first :: (a -> b) -> (a, c) -> (b, c)`
*/
export const first =
  <A, B>
  (f: (fst: A) => B) =>
  <C>
  (x: Pair<A, C>): Pair<B, C> =>
    ReTuple.Bifunctor_first (f, x)

/**
* `second :: (b -> c) -> (a, b) -> (a, c)`
*/
export const second =
  <B, C>
  (f: (fst: B) => C) =>
  <A>
  (x: Pair<A, B>): Pair<A, C> =>
    ReTuple.Bifunctor_second (f, x)


// PAIR FUNCTIONS

/**
 * `fst :: (a, b) -> a`
 *
 * Extract the first component of a pair.
 */
export const fst = <A> (x: Pair<A, any>): A =>
  ReTuple.fst (x)

/**
 * `snd :: (a, b) -> b`
 *
 * Extract the second component of a pair.
 */
export const snd = <B> (x: Pair<any, B>): B =>
  ReTuple.snd (x)

/**
 * `curry :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curry` converts an uncurried function to a curried function.
 */
export const curry =
  <A, B, C> (f: (x: Pair<A, B>) => C) => (a: A) => (b: B): C =>
    f ([ a, b ])

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

    return f (x[0]) (x[1])
  }

/**
 * `swap :: (a, b) -> (b, a)`
 *
 * Swap the components of a pair.
 */
export const swap =
  <A, B> (x: Pair<A, B>): Pair<B, A> =>
    ReTuple.swap (x)


// CUSTOM FUNCTIONS

// NAMESPACED FUNCTIONS

export const Tuple = {
  bimap,
  first,
  second,

  fst,
  snd,
  curry,
  uncurry,
  swap,
}

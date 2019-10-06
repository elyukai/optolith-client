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
  <A, B>
  (fFirst: (first: A) => B) =>
  <C, D>
  (fSecond: (second: C) => D) =>
  (x: Pair<A, C>) =>
  Pair<B, D>

  first: <A, B> (f: (first: A) => B) => <C> (x: Pair<A, C>) => Pair<B, C>
  second: <B, C> (f: (second: B) => C) => <A> (x: Pair<A, B>) => Pair<A, C>

  fst: <A>(x: Pair<A, any>) => A
  snd: <B>(x: Pair<any, B>) => B
  curry: <A, B, C>(f: (x: Pair<A, B>) => C) => (a: A) => (b: B) => C
  uncurry: <A, B, C>(f: (a: A) => (b: B) => C) => (x: Pair<A, B>) => C
  swap: <A, B>(x: Pair<A, B>) => Pair<B, A>

  toArray: <A extends any[]>(x: Tuple<A>) => A
  fromArray: <A extends any[]>(x: A) => Tuple<A>
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

export const PairF = <B> (second: B) => <A> (first: A): Pair<A, B> => Tuple (first, second)


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

/**
 * @module Pair
 *
 * A pair (`(a, b)`) is a simple flat data structure for lists of values of
 * different types but constant length.
 *
 * @author Lukas Obermann
 */

import { cnst } from './combinators';
import { Some } from './Maybe';


// CONSTRUCTOR

interface PairPrototype<A> {
  readonly isPair: true;
}

export interface Pair<A extends Some, B extends Some> extends PairPrototype<A> {
  readonly first: A;
  readonly second: B;
  readonly prototype: PairPrototype<A>;
}

const PairPrototype: PairPrototype<Some> =
  Object.create (
    Object.prototype,
    { isPair: { value: true }}
  );

/**
 * `fromBoth :: a -> b -> (a, b)`
 *
 * Creates a new `Pair` instance from the passed arguments.
 */
export const fromBoth =
  <A extends Some, B extends Some> (firstValue: A) => (secondValue: B): Pair<A, B> =>
    Object.create (
      PairPrototype,
      {
        first: { value: firstValue, enumerable: true },
        second: { value: secondValue, enumerable: true },
      }
    );


// FUNCTOR

/**
 * `fmap :: (a0 -> b) -> (a, a0) -> (a, b)`
 */
export const fmap =
  <A extends Some, A0 extends Some, B extends Some>
  (f: (value: A0) => B) => (x: Pair<A, A0>): Pair<A, B> =>
    fromBoth<A, B> (x .first) (f (x .second));

/**
 * `(<$) :: a0 -> (a, b) -> (a, a0)`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A extends Some, A0 extends Some> (x: A0) => fmap<A, Some, A0> (cnst (x));


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> (a, c) -> (b, d)`
 */
export const bimap =
  <A extends Some, B extends Some, C extends Some, D extends Some>
  (fFirst: (first: A) => B) => (fSecond: (second: C) => D) => (x: Pair<A, C>): Pair<B, D> =>
    fromBoth<B, D> (fFirst (x .first)) (fSecond (x .second));

/**
* `first :: (a -> b) -> (a, c) -> (b, c)`
*/
export const first =
  <A extends Some, B extends Some, C extends Some>
  (f: (first: A) => B) => (x: Pair<A, C>): Pair<B, C> =>
    fromBoth<B, C> (f (x .first)) (x .second);

/**
* `second :: (b -> c) -> (a, b) -> (a, c)`
*/
export const second =
  <A extends Some, B extends Some, C extends Some>
  (f: (second: B) => C) => (x: Pair<A, B>): Pair<A, C> =>
    fromBoth<A, C> (x .first) (f (x .second));


// PAIR FUNCTIONS

/**
 * `fst :: (a, b) -> a`
 *
 * Extract the first component of a pair.
 */
export const fst = <A> (x: Pair<A, any>): A => x .first;

/**
 * `snd :: (a, b) -> b`
 *
 * Extract the second component of a pair.
 */
export const snd = <B> (x: Pair<any, B>): B => x .second;

/**
 * `swap :: (a, b) -> (b, a)`
 *
 * Swap the components of a pair.
 */
export const swap = <A, B> (x: Pair<A, B>): Pair<B, A> => fromBoth<B, A> (x .second) (x .first);


// CUSTOM FUNCTIONS

/**
 * `toArray :: (a, b) -> Array (b | a)`
 *
 * Converts the pair to a native `Array`.
 */
export const toArray = <A, B> (x: Pair<A, B>): [A, B] => [x .first, x .second];

/**
 * `isPair :: a -> Bool`
 *
 * Return `True` if the given value is an pair.
 */
export const isPair =
  (x: any): x is Pair<any, any> =>
    typeof x === 'object' && x !== null && x.isPair;


// NAMESPACED FUNCTIONS

export const Pair = {
  fromBoth,

  fmap,
  mapReplace,

  bimap,
  first,
  second,

  fst,
  snd,
  swap,

  toArray,
};

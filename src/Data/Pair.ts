/**
 * @module Data.Pair
 *
 * A pair (`(a, b)`) is a simple flat data structure for lists of values of
 * different types but constant length.
 *
 * @author Lukas Obermann
 */

import { Internals } from "./Internals";
import { Tuple } from "./Tuple";
import * as Curry from "./Tuple/Curry";


// CONSTRUCTOR

export { Pair } from "./Tuple";


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> (a, c) -> (b, d)`
 *
 * @deprecated use Tuple.bimap
 */
export const bimap = Tuple.bimap

/**
* `first :: (a -> b) -> (a, c) -> (b, c)`
 *
 * @deprecated use Tuple.first
*/
export const first = Tuple.first

/**
* `second :: (b -> c) -> (a, b) -> (a, c)`
 *
 * @deprecated use Tuple.second
*/
export const second = Tuple.second


// PAIR FUNCTIONS

/**
 * `fst :: (a, b) -> a`
 *
 * Extract the first component of a pair.
 *
 * @deprecated use Tuple.fst
 */
export const fst = Tuple.fst

/**
 * `snd :: (a, b) -> b`
 *
 * Extract the second component of a pair.
 *
 * @deprecated use Tuple.snd
 */
export const snd = Tuple.snd

/**
 * `curry :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curry` converts an uncurried function to a curried function.
 *
 * @deprecated use Tuple.curry
 */
export const curry = Tuple.curry

/**
 * `curryN :: ((a, b) -> c) -> a -> b -> c`
 *
 * `curryN` converts an uncurried function to a curried function.
 *
 * @deprecated use Tuple.Curry.curryN
 */
export const curryN = Curry.curryN

/**
 * `uncurry :: (a -> b -> c) -> (a, b) -> c`
 *
 * `uncurry` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.uncurry
 */
export const uncurry = Tuple.uncurry

/**
 * `uncurryN :: (a -> b -> c) -> (a, b) -> c`
 *
 * `uncurryN` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN
 */
export const uncurryN = Curry.uncurryN

/**
 * `uncurryN3 :: (a -> b -> c -> d) -> (a, b, c) -> d`
 *
 * `uncurryN3` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN3
 */
export const uncurryN3 = Curry.uncurryN3

/**
 * `uncurryN4 :: (a -> b -> c -> d -> e) -> (a, b, c, d) -> e`
 *
 * `uncurryN4` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN4
 */
export const uncurryN4 = Curry.uncurryN4

/**
 * `uncurryN5 :: (a -> b -> c -> d -> e -> f) -> (a, b, c, d, e) -> f`
 *
 * `uncurryN5` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN5
 */
export const uncurryN5 = Curry.uncurryN5

/**
 * `uncurryN6 :: (a -> b -> c -> d -> e -> f -> g) -> (a, b, c, d, e, f) -> g`
 *
 * `uncurryN6` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN6
 */
export const uncurryN6 = Curry.uncurryN6

/**
 * `uncurryN7 :: (a -> b -> c -> d -> e -> f -> g -> h) -> (a, b, c, d, e, f, g) -> h`
 *
 * `uncurryN7` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN7
 */
export const uncurryN7 = Curry.uncurryN7

/**
 * `uncurryN8 :: (a -> b -> c -> d -> e -> f -> g -> h -> i) -> (a, b, c, d, e, f, g, h) -> i`
 *
 * `uncurryN8` converts a curried function to a function on pairs.
 *
 * @deprecated use Tuple.Curry.uncurryN8
 */
export const uncurryN8 = Curry.uncurryN8

/**
 * `swap :: (a, b) -> (b, a)`
 *
 * Swap the components of a pair.
 *
 * @deprecated use Tuple.swap
 */
export const swap = Tuple.swap


// CUSTOM FUNCTIONS

/**
 * `toArray :: (a, b) -> Array (b | a)`
 *
 * Converts the pair to a native `Array`.
 *
 * @deprecated use Tuple.toArray
 */
export const toArray = Tuple.toArray

/**
 * `fromArray :: (a, b) -> Array (b | a)`
 *
 * Creates a pair from a native `Array` of length `2`.
 *
 * @deprecated use Tuple.fromArray
 */
export const fromArray = Tuple.fromArray

/**
 * @deprecated use Tuple.isTuple
 */
export import isPair = Internals.isTuple

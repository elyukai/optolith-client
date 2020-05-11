/**
 * @module Data.Ix
 *
 * The `Ix` class is used to map a contiguous subrange of values in type onto
 * integers.
 *
 * @author Lukas Obermann
 */

import * as ReIx from "./Ley_Ix.gen"
import { List } from "./List"
import { Pair } from "./Tuple"


/**
 * `range :: Int a => (a, a) -> [a]`
 *
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const range =
  (b: Pair<number, number>): List<number> =>
    ReIx.range (b)


/**
 * `rangeN :: Int a => (a, a) -> [a]`
 *
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 *
 * Native version of `range`.
 */
export const rangeN =
  (l: number, u: number): List<number> =>
    ReIx.range ([ l, u ])


/**
 * `inRange :: Int a => (a, a) -> a -> Bool`
 *
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const inRange =
  (b: Pair<number, number>) => (x: number): boolean =>
    ReIx.inRange (b, x)


/**
 * `index :: Int a => (a, a) -> a -> Int`
 *
 * The position of a subscript in the subrange.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const index =
  (b: Pair<number, number>) => (x: number): number =>
    ReIx.index (b, x)


/**
 * `inRangeN :: Int a => (a, a) -> a -> Bool`
 *
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 *
 * Native version of `inRange`.
 */
export const inRangeN =
  (l: number, u: number) => (x: number): boolean =>
    ReIx.inRange ([ l, u ], x)


/**
 * `rangeSize :: Int a => (a, a) -> Int`
 *
 * The size of the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const rangeSize =
  (b: Pair<number, number>): number =>
    ReIx.rangeSize (b)


// NAMESPACED FUNCTIONS

export const Ix = {
  range,
  index,
  inRange,
  rangeSize,
}

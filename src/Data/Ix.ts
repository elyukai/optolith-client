/**
 * @module Data.Ix
 *
 * The `Ix` class is used to map a contiguous subrange of values in type onto
 * integers.
 *
 * @author Lukas Obermann
 */

import { inc } from "../App/Utils/mathUtils";
import { cons, List, Nil } from "./List";
import { fst, Pair, snd } from "./Pair";
import { show } from "./Show";

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
    buildRangeList (snd (b)) (fst (b)) (Nil)

/**
 * `index :: Int a => (a, a) -> a -> Int`
 *
 * The position of a subscript in the subrange.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 */
export const index =
  (b: Pair<number, number>) => (x: number): number => {
    if (inRange (b) (x)) {
      return x - fst (b)
    }

    throw new RangeError (
      `Ix.index: Index (${show (x)}) out of range (${show (b)}`
    )
  }

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
    x >= fst (b) && x <= snd (b)

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
    fst (b) <= snd (b) ? snd (b) - fst (b) + 1 : 0


// MODULE HELPER FUNCTIONS

const buildRangeList =
  (u: number) => (x: number) => (xs: List<number>): List<number> =>
    x > u ? xs : cons (buildRangeList (u) (inc (x)) (xs)) (x)


// NAMESPACED FUNCTIONS

export const Ix = {
  range,
  index,
  inRange,
  rangeSize,
}

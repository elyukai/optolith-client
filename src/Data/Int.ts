/**
 * @module Data.Int
 *
 * @author Lukas Obermann
 */

import { EQ, GT, LT, Ordering } from "./Ord";

/**
 * `compare :: Int -> Int -> Ordering`
 *
 * `compare a b` compares the two integers `a` and `b` and returns `LT` if `a`
 * is lower than `b`, `GT` if `a` is greater than `b` and `EQ` if both are
 * equal.
 */
export const compare =
  (a: number) => (b: number): Ordering => a < b ? LT : a > b ? GT : EQ

export const Int = {
  compare,
}

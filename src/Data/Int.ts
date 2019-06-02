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
  (x: number) => (y: number): Ordering => x < y ? LT : x > y ? GT : EQ

export const Int = {
  compare,
}

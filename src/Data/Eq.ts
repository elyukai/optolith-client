/**
 * @module Data.Eq
 *
 * @author Lukas Obermann
 */

import * as ReEq from "./Ley_Eq.gen"

/**
 * `(==) :: a -> a -> Bool`
 *
 * Returns if both given values are equal.
 */
export const equals =
  <A> (x1: A) => (x2: A): boolean =>
    ReEq.equals (x1, x2)

export type equals<A> = (x1: A) => (x2: A) => boolean

/**
 * `(!=) :: a -> a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A> (m1: A) => (m2: A): boolean =>
    ReEq.notEquals (m1, m2)


// NAMESPACED FUNCTIONS

export const Eq = {
  equals,
  notEquals,
}

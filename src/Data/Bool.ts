import { pipe } from "../App/Utilities/pipe";

/**
 * @module Data.Bool
 * @author Lukas Obermann
 */

export type Bool = boolean

/**
 * `(&&) :: Bool -> Bool -> Bool`
 *
 * Boolean "and"
 */
export const and: (x: Bool) => (y: Bool) => Bool =
  x => y => x && y

/**
 * `(&&) :: (() -> Bool) -> Bool -> Bool`
 *
 * Boolean "and"
 *
 * Flipped and lazy version of `and`.
 */
export const andFL: (y_: () => Bool) => (x: Bool) => Bool =
  y_ => x => x && y_ ()

/**
 * `(||) :: Bool -> Bool -> Bool`
 *
 * Boolean "or"
 */
export const or: (x: Bool) => (y: Bool) => Bool =
  x => y => x || y

/**
 * `(||) :: (() -> Bool) -> Bool -> Bool`
 *
 * Boolean "or"
 *
 * Flipped and lazy version of `or`.
 */
export const orFL: (y_: () => Bool) => (x: Bool) => Bool =
  y_ => x => x || y_ ()

/**
 * `not :: Bool -> Bool`
 *
 * This function returns `True` on `False` and vice versa.
 */
export const not: (x: Bool) => Bool =
  x => !x

export type Predicate<A> = (x: A) => Bool

/**
 * `notP :: (a -> Bool) -> a -> Bool`
 *
 * This function inverts the output of the passed predicate function.
 */
export const notP: <A> (f: Predicate<A>) => Predicate<A> =
  f => pipe (f, not)

/**
 * `otherwise :: Bool`
 *
 * `otherwise` is defined as the value `True`. It helps to make guards more
 * readable. eg.
 *
 * ```haskell
 * f x | x < 0     = ...
 *     | otherwise = ...
 * ```
 */
export const otherwise: Bool = true

/**
 * `bool :: a -> a -> Bool -> a`
 *
 * Case analysis for the `Bool` type. `bool x y p` evaluates to `x` when `p` is
 * `False`, and evaluates to `y` when `p` is `True`.
 *
 * This is equivalent to `if p then y else x`; that is, one can think of it as
 * an if-then-else construct with its arguments reordered.
 */
export const bool: <A> (isFalse: A) => (isTrue: A) => (cond: Bool) => A =
  x => y => cond => cond ? y : x

/**
 * `bool_ :: (() -> a) -> (() -> a) -> Bool -> a`
 *
 * Case analysis for the `Bool` type. `bool f g p` evaluates to the return value
 * of `f` when `p` is `False`, and evaluates to the return value of `g` when `p`
 * is `True`.
 *
 * This is equivalent to `if p then g () else f ()`; that is, one can think of
 * it as an if-then-else construct with its arguments reordered.
 *
 * Lazy version of `bool`.
 */
export const bool_: <A> (isFalse: () => A) => (isTrue: () => A) => (cond: Bool) => A =
  f => g => cond => cond ? g () : f ()

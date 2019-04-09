/**
 * @module Data.Bool
 * @author Lukas Obermann
 */

/**
 * `(&&) :: Bool -> Bool -> Bool`
 *
 * Boolean "and"
 */
export const and = (x: boolean) => (y: boolean) => x && y

/**
 * `(&&) :: (() -> Bool) -> Bool -> Bool`
 *
 * Boolean "and"
 *
 * Flipped and lazy version of `and`.
 */
export const andFL = (y: () => boolean) => (x: boolean) => x && y ()

/**
 * `(||) :: Bool -> Bool -> Bool`
 *
 * Boolean "or"
 */
export const or = (x: boolean) => (y: boolean) => x || y

/**
 * `(||) :: (() -> Bool) -> Bool -> Bool`
 *
 * Boolean "or"
 *
 * Flipped and lazy version of `or`.
 */
export const orFL = (y: () => boolean) => (x: boolean) => x || y ()

/**
 * `not :: Bool -> Bool`
 *
 * This function returns `True` on `False` and vice versa.
 */
export const not = (bool: boolean) => !bool

/**
 * `notP :: (a -> Bool) -> a -> Bool`
 *
 * This function inverts the output of the passed predicate function.
 */
export const notP = <A> (f: (x: A) => boolean) => (x: A) => !f (x)

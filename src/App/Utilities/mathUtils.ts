import { flip } from "../../Data/Function";
import { Pair } from "../../Data/Tuple";

/**
 * Adds two numbers. Equivalent to `a + b` but curried.
 */
export const add = (a: number) => (b: number) => a + b

/**
 * Subtracts two numbers. Equivalent to `a - b` but curried. Subtracts the
 * second argument from the first argument.
 */
export const subtract = (a: number) => (b: number) => a - b

/**
 * Subtracts two numbers. Equivalent to `a - b` but curried. Subtracts the
 * first argument from the second argument.
 */
export const subtractBy: (b: number) => (a: number) => number = flip (subtract)

/**
 * Subtracts the second number from the absolute value of the first number.
 *
 * ```haskell
 * subtractAbs 3 1 == 2
 * subtractAbs -3 1 == -2
 * ```
 */
export const subtractAbs = (a: number) => (b: number) => a < 0 ? a + b : a - b

/**
 * Subtracts the first number from the absolute value of the second number.
 *
 * ```haskell
 * subtractAbsBy 1 3 == 2
 * subtractAbsBy 1 -3 == -2
 * ```
 *
 * Flipped variant of `subtractAbs`.
 */
export const subtractAbsBy: (b: number) => (a: number) => number = flip (subtractAbs)

/**
 * Multiplies two numbers. Equivalent to `a * b` but curried.
 */
export const multiply = (a: number) => (b: number) => a * b

/**
 * Divides one number by another number. Equivalent to `a / b` but curried.
 * Divide the first argument by the second argument.
 */
export const divide = (a: number) => (b: number) => a / b

/**
 * Divides one number by another number. Equivalent to `a / b` but curried.
 * Divide the second argument by the first argument.
 */
export const divideBy: (b: number) => (a: number) => number = flip (divide)

/**
 * `even :: Integral a => a -> Bool`
 *
 * Checks if a number is even.
 */
export const even = (x: number) => x % 2 === 0

/**
 * `odd :: Integral a => a -> Bool`
 *
 * Checks if a number is odd.
 */
export const odd = (x: number) => x % 2 !== 0

/**
 * `gt :: Ord a => a -> a -> Bool`
 *
 * Checks if the *second* value is greater than the first.
 */
export const gt = (y: number) => (x: number) => x > y

/**
 * `gte :: Ord a => a -> a -> Bool`
 *
 * Checks if the *second* value is greater than or equals the first.
 */
export const gte = (y: number) => (x: number) => x >= y

/**
 * `lt :: Ord a => a -> a -> Bool`
 *
 * Checks if the *second* value is lower than the first.
 */
export const lt = (y: number) => (x: number) => x < y

/**
 * `lte :: Ord a => a -> a -> Bool`
 *
 * Checks if the *second* value is lower than or equals the first.
 */
export const lte = (y: number) => (x: number) => x <= y

/**
 * `min :: Ord a => a -> a -> a`
 *
 * Returns the smaller of its two arguments.
 */
export const min = (x: number) => (y: number) => x < y ? x : y

/**
 * `max :: Ord a => a -> a -> a`
 *
 * Returns the larger of its two arguments.
 */
export const max = (x: number) => (y: number) => x > y ? x : y

/**
 * `minmax :: Ord a => a -> a -> (a, a)`
 *
 * `minmax x y` returns a pair consisting of `x` and `y` where the first value
 * is lower than the second.
 */
export const minmax = (x: number) => (y: number) => x > y ? Pair (y, x) : Pair (x, y)

/**
 * `inc :: Num a => a -> a`
 *
 * Increments the given number by 1.
 */
export const inc = (x: number) => x + 1

/**
 * `dec :: Num a => a -> a`
 *
 * Decrements the given number by 1.
 */
export const dec = (x: number) => x - 1

/**
 * `negate :: Num a => a -> a`
 *
 * Negates the given number.
 */
export const negate = (x: number) => -x

/**
 * `abs :: Num a => a -> a`
 *
 * Absolute value.
 */
export const abs = (x: number) => Math.abs (x)

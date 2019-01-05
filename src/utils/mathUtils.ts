import { flip } from "../Data/Function";

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

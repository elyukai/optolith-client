import * as R from 'ramda';

interface SubtractBy {
  /**
   * Subtracts two numbers. Equivalent to `a - b` but curried. Subtracts the
   * first argument from the second argument.
   */
  (b: number, a: number): number;
  /**
   * Subtracts two numbers. Equivalent to `a - b` but curried. Subtracts the
   * first argument from the second argument.
   */
  (b: number): (a: number) => number;
}

export const subtractBy = R.flip (R.subtract) as SubtractBy;

interface DivideBy {
  /**
   * Divide one number by another number. Equivalent to `a / b` but curried.
   * Divide the second argument by the first argument.
   */
  (b: number, a: number): number;
  /**
   * Divide one number by another number. Equivalent to `a / b` but curried.
   * Divide the second argument by the first argument.
   */
  (b: number): (a: number) => number;
}

export const divideBy = R.flip (R.divide) as DivideBy;

/**
 * `even :: Integral a => a -> Bool`
 *
 * Checks if a number is even.
 */
export const even = (x: number) => x % 2 === 0;

/**
 * `odd :: Integral a => a -> Bool`
 *
 * Checks if a number is odd.
 */
export const odd = (x: number) => x % 2 !== 0;

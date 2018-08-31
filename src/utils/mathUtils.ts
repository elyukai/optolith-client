import R from 'ramda';

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

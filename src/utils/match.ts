import * as R from 'ramda';

type TypeGuard<T, I extends T = T> = (x: T) => x is I;
type TypeCheck<T> = (x: T) => boolean;

type Test<T> = TypeGuard<T> | TypeCheck<T>;
type AllTests<T> = Test<T> | T;

interface Match<T, U> {
  on<I extends T> (pred: ((x: T) => x is I) | I, fn: (x: I) => U): Match<Exclude<T, I>, U>;
  on (pred: AllTests<T>, fn: (x: T) => U): Match<T, U>;
  otherwise (fn: ((x: T) => U)): U;
}

// @ts-ignore
const matched = <T, U>(x: U): Match<T, U> => ({
  // @ts-ignore
  on: () => matched<T, U> (x),
  otherwise: () => x,
});

// @ts-ignore
export const match = <T, U>(x: T): Match<T, U> => ({
  // @ts-ignore
  on: (pred: AllTests<T>, fn: (x: T) => U) => {
    // @ts-ignore
    const test: Test<T> = typeof pred === 'function' ? pred : R.equals (pred);

    return test (x) ? matched<T, U> (fn (x)) : match<T, U> (x);
  },
  otherwise: (fn: (x: T) => U) => fn (x),
});

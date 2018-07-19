import R from 'ramda';

type TypeGuard<T, I extends T = T> = (x: T) => x is I;
type TypeCheck<T> = (x: T) => boolean;

type Test<T> = TypeGuard<T> | TypeCheck<T>;
type AllTests<T> = Test<T> | T;

interface Match<T, U1> {
  on<I extends T>(pred: ((x: T) => x is I) | I, fn: (x: I) => U1): Match<Exclude<T, I>, U1>;
  on(pred: AllTests<T>, fn: (x: T) => U1): Match<T, U1>;
  otherwise(fn: ((x: T) => U1)): U1;
}

// @ts-ignore
const matched = <T, U2>(x: U2): Match<T, U2> => ({
  on: () => matched<T, U2>(x),
  otherwise: () => x,
});

// @ts-ignore
export const match = <T, U>(x: T): Match<T, U> => ({
  on: (pred: AllTests<T>, fn: (x: T) => U) => {
    const test: Test<T> = typeof pred === 'function' ? pred : R.equals(pred);

    return test(x) ? matched<T, U>(fn(x)) : match<T, U>(x);
  },
  otherwise: (fn: (x: T) => U) => fn(x),
});

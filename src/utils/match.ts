import R from 'ramda';

type TypeGuard<T, I extends T = T> = (x: T) => x is I;
type TypeCheck<T> = (x: T) => boolean;

type Test<T> = TypeGuard<T> | TypeCheck<T>;
type AllTests<T> = Test<T> | T;

interface Match<T, R> {
  on<I extends T>(pred: ((x: T) => x is I) | I, fn: (x: I) => R): Match<Exclude<T, I>, R>;
  on(pred: AllTests<T>, fn: (x: T) => R): Match<T, R>;
  otherwise(fn: ((x: T) => R)): R;
}

// @ts-ignore
const matched = <T, R>(x: R): Match<T, R> => ({
  on: () => matched<T, R>(x),
  otherwise: () => x,
});

// @ts-ignore
export const match = <T, R>(x: T): Match<T, R> => ({
  on: (pred: AllTests<T>, fn: (x: T) => R) => {
    const test: Test<T> = typeof pred === 'function' ? pred : R.equals(pred);
    return test(x) ? matched<T, R>(fn(x)) : match<T, R>(x);
  },
  otherwise: (fn: (x: T) => R) => fn(x),
});

interface IfOrNil {
  <T, I extends T, R>(
    pred: (test: T) => test is I,
    isTrue: (value: I) => R,
  ): (value: T) => R | undefined;
  <T, R>(
    pred: (test: T) => boolean,
    isTrue: (value: T) => R,
  ): (value: T) => R | undefined;
}

export const ifOrUndefined: IfOrNil = <T, R>(
  pred: (test: T) => boolean,
  isTrue: (value: T) => R,
) => (value: T) => pred(value) ? isTrue(value) : undefined;

type Test<T> = (x: T) => boolean

interface Match<T, R> {
  on: (pred: Test<T> | T, fn: (x: T) => R) => Match<T, R>;
  otherwise: (fn: (x: T) => R) => R;
}

const matched = <T, R>(x: R): Match<T, R> => ({
  on: () => matched(x),
  otherwise: () => x,
});

export const match = <T, R>(x: T): Match<T, R> => ({
  on: (pred, fn) => {
    const test: Test<T> = typeof pred === 'function' ? pred : (x => x === pred);
    return test(x) ? matched(fn(x)) : match(x);
  },
  otherwise: fn => fn(x),
});

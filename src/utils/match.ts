interface Match<T, R> {
  on: (pred: (x: T) => boolean, fn: (x: T) => R) => Match<T, R>;
  otherwise: (fn: (x: T) => R) => R;
}

const matched = <T, R>(x: R): Match<T, R> => ({
  on: () => matched(x),
  otherwise: () => x,
});

export const match = <T, R>(x: T): Match<T, R> => ({
  on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
  otherwise: fn => fn(x),
});

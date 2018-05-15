interface FilterTD {
  <T, I extends T, R>(
    testFn: (item: T, acc: R) => item is I,
  ): (reduceFn: (acc: R, item: I) => R) => R;
  <T, R>(
    testFn: (item: T, acc: R) => boolean,
  ): (reduceFn: (acc: R, item: T) => R) => R;
}

export const filter: FilterTD = <T, R>(
  testFn: (item: T, acc: R) => boolean,
) => (
  reduceFn: (acc: R, item: T) => R,
) => (acc: R, item: T) => testFn(item, acc) ? reduceFn(acc, item) : acc;

export const map = <T, R>(
  mapFn: (item: T, acc: R) => T,
) => (
  reduceFn: (acc: R, item: T) => R,
) => (acc: R, item: T) => reduceFn(acc, mapFn(item, acc));

export const reduce = <T, R>(
  reducerFn: (acc: R, item: T) => R,
) => (
  reduceFn: (acc: R, item: T) => R,
) => (acc: R, item: T) => reduceFn(reducerFn(acc, item), item);

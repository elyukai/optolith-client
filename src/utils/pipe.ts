export function pipe<I, R = I>(
  fn1: (value: I) => R,
): (initial: I) => R;
export function pipe<T1, R = T1>(
  fn1: () => T1,
  fn2: (value: T1) => R,
): () => R;
export function pipe<I, T1 = I, R = T1>(
  fn1: (value: I) => T1,
  fn2: (value: T1) => R,
): (initial: I) => R;
export function pipe<T1, T2 = T1, R = T2>(
  fn1: () => T1,
  fn2: (value: T1) => T2,
  fn3: (value: T2) => R,
): () => R;
export function pipe<I, T1 = I, T2 = T1, R = T2>(
  fn1: (value: I) => T1,
  fn2: (value: T1) => T2,
  fn3: (value: T2) => R,
): (initial: I) => R;
export function pipe<T1, T2 = T1, T3 = T2, R = T3>(
  fn1: () => T1,
  fn2: (value: T1) => T2,
  fn3: (value: T2) => T3,
  fn4: (value: T3) => R,
): () => R;
export function pipe<I, T1 = I, T2 = T1, T3 = T2, R = T3>(
  fn1: (value: I) => T1,
  fn2: (value: T1) => T2,
  fn3: (value: T2) => T3,
  fn4: (value: T3) => R,
): (initial: I) => R;
export function pipe(...fns: ((value: any) => any)[]) {
  return (initial: any) => fns.reduce((value, fn) => fn(value), initial);
}

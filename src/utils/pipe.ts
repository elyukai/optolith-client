export function pipe<I, T1, R>(
  fn1: (value: I) => T1,
  fn2: (value: T1) => R,
): (initial: I) => R;
export function pipe<I, T1, T2, R>(
  fn1: (value: I) => T1,
  fn2: (value: T1) => T2,
  fn3: (value: T2) => R,
): (initial: I) => R;
export function pipe<I, T1, T2, T3, R>(
  fn1: (value: I) => T1,
  fn2: (value: T1) => T2,
  fn3: (value: T2) => T3,
  fn4: (value: T3) => R,
): (initial: I) => R;
export function pipe(...fns: ((value: any) => any)[]) {
  return (initial: any) => fns.reduce((value, fn) => fn(value), initial);
}

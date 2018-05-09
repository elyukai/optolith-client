interface Initializer<I, R> {
  (initial: I): R;
}

interface Pipe {
  <I, R = I>(
    fn1: (value: I) => R,
  ): Initializer<I, R>;
  <I, T1 = I, R = T1>(
    fn1: (value: I) => T1,
    fn2: (value: T1) => R,
  ): Initializer<I, R>;
  <I, T1 = I, T2 = T1, R = T2>(
    fn1: (value: I) => T1,
    fn2: (value: T1) => T2,
    fn3: (value: T2) => R,
  ): Initializer<I, R>;
  <I, T1 = I, T2 = T1, T3 = T2, R = T3>(
    fn1: (value: I) => T1,
    fn2: (value: T1) => T2,
    fn3: (value: T2) => T3,
    fn4: (value: T3) => R,
  ): Initializer<I, R>;
  <I, T1 = I, T2 = T1, T3 = T2, T4 = T3, R = T4>(
    fn1: (value: I) => T1,
    fn2: (value: T1) => T2,
    fn3: (value: T2) => T3,
    fn4: (value: T3) => T4,
    fn5: (value: T4) => R,
  ): Initializer<I, R>;
  <I, T1 = I, T2 = T1, T3 = T2, T4 = T3, T5 = T4, R = T5>(
    fn1: (value: I) => T1,
    fn2: (value: T1) => T2,
    fn3: (value: T2) => T3,
    fn4: (value: T3) => T4,
    fn5: (value: T4) => T5,
    fn6: (value: T5) => R,
  ): Initializer<I, R>;
}

export const pipe: Pipe = (...fns: ((value: any) => any)[]) => {
  return (initial: any) => fns.reduce((value, fn) => fn(value), initial);
}

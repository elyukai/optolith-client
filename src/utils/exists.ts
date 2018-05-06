export const exists = <T>() => (e: T | undefined): e is T => e !== undefined;

export const existsFn = <T, R, A>(fn: (x: T) => R, alt: A) => (x: T | undefined) => {
  return x === undefined ? alt : fn(x);
};

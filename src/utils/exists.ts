export const exists = <T>(e: T | undefined): e is T => e !== undefined;
export const matchExists = <T>() => (e: T | undefined): e is T => e !== undefined;

export function maybe<T, R>(
  justFn: (just: T) => R,
): (x: T | undefined) => R | undefined;
export function maybe<T, R>(
  justFn: (just: T) => R,
  nothingValue: R,
): (value: T | undefined) => R;
export function maybe<T, R, A>(
  justFn: (just: T) => R,
  nothingValue: A,
): (value: T | undefined) => R | A;
export function maybe<T, R, A>(
  justFn: (just: T) => R,
  nothingValue?: A,
) {
  return (value: T | undefined) => {
    return value === undefined ? nothingValue : justFn(value);
  };
}

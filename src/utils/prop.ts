import { Just, Maybe } from './dataUtils';

type PropJustOrMaybe<P extends keyof T, T> =
  T[P] extends NonNullable<T[P]> ? Just<T[P]> : Maybe<NonNullable<T[P]>>;

const propResultFn = <P extends keyof T, T>(
  p: P,
  obj: T
): PropJustOrMaybe<P, T> =>
  Maybe.of(obj[p]) as PropJustOrMaybe<P, T>;

export function prop<P extends keyof T, T>(
  p: P
): (obj: T) => PropJustOrMaybe<P, T>;
export function prop<P extends keyof T, T>(
  p: P,
  obj: T
): PropJustOrMaybe<P, T>;
export function prop<P extends keyof T, T>(
  p: P,
  obj?: T
): PropJustOrMaybe<P, T> | ((obj: T) => PropJustOrMaybe<P, T>) {
  if (arguments.length === 2 && obj !== undefined) {
    return propResultFn(p, obj);
  }

  return obj => propResultFn(p, obj);
}

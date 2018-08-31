export function ifElse<T, P extends T, R> (pred: (value: T) => value is P):
  (isTrue: (value: P) => R) => (isFalse: (value: Exclude<T, P>) => R) => (value: T) => R
export function ifElse<T, R> (pred: (value: T) => boolean): (isTrue: (value: T) => R) =>
  (isFalse: (value: T) => R) => (value: T) => R;
export function ifElse<T, R> (pred: (value: T) => boolean) {
  return (isTrue: (value: T) => R) =>
    (isFalse: (value: T) => R) =>
    (value: T): R => pred (value) ? isTrue (value) : isFalse (value);
}

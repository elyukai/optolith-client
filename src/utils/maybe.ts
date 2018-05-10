export interface MaybeFunctor<T> {
  readonly value: T;
  fmap<R>(fn: (value: NonNullable<T>) => R): MaybeFunctor<R | Extract<T, null | undefined>>;
}

export const Maybe = <T>(value: T): MaybeFunctor<T> => ({
  value,
  fmap(fn) {
    if (this.value == null) {
      return Maybe(this.value);
    }
    else {
      return Maybe(fn(this.value as NonNullable<T>));
    }
  }
});

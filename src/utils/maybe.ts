export interface MaybeFunctor<T> {
  readonly value: T;
  fmap<R>(fn: (value: Exclude<T, null | undefined>) => R): MaybeFunctor<R>;
}

export const Maybe = <T>(value: T) => ({
  value,
  fmap<R>(fn: (value: Exclude<T, null | undefined>) => R): MaybeFunctor<R> {
    if (this.value == null) {
      return Maybe(this.value);
    }
    else {
      return Maybe(fn(this.value as Exclude<T, null | undefined>));
    }
  }
});

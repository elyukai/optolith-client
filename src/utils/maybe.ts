import { exists } from './exists';

type Nothing<T> = T extends null | undefined ? T : never;

export type OrNot<T> = T | undefined;

export interface MaybeFunctor<T> {
  readonly value: T;
  fmap<R>(fn: (value: NonNullable<T>) => R): MaybeFunctor<R | Nothing<T>>;
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

export const isJust = <T>(
  functor: MaybeFunctor<T>,
): functor is MaybeFunctor<NonNullable<T>> => exists(functor.value);

export const isNothing = <T>(
  functor: MaybeFunctor<T>,
): functor is MaybeFunctor<Nothing<T>> => !exists(functor.value);

export const NIL = () => undefined;

interface IfMaybe {
  <T, I extends T, R>(
    pred: (test: T) => test is I,
    isTrue: (value: I) => R,
  ): (value: T) => MaybeFunctor<R | undefined>;
  <T, R>(
    pred: (test: T) => boolean,
    isTrue: (value: T) => R,
  ): (value: T) => MaybeFunctor<R | undefined>;
}

export const ifMaybe: IfMaybe = <T, R>(
  pred: (test: T) => boolean,
  isTrue: (value: T) => R,
) => (value: T) => Maybe(pred(value) ? isTrue(value) : undefined);

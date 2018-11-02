import * as Al from '../../types/algebraic';

// @ts-ignore
const privateAccessKey = Symbol ('Either');

interface InternalLeft<L> {
  isRight: false;
  value: L;
}

interface InternalRight<R> {
  isRight: true;
  value: R;
}

type Internal<L, R> = InternalLeft<L> | InternalRight<R>;

/**
 * WORK IN PROGRESS
 *
 * NOT SAFE TO USE
 */
export class Either<L, R> implements Al.Monad<R> {
  private readonly value: Internal<L, R>;

  private constructor (value: R, isRight: true);
  private constructor (value: L, isRight: false);
  private constructor (value: L | R, isRight: boolean) {
    this.value = { isRight, value } as any as Internal<L, R>;
  }

  fmap<T> (f: (value: R) => T): Either<L, T> {
    return this.value.isRight ? Either.pure (f (this.value.value)) : this as any;
  }

  // @ts-ignore
  bind<T> (f: (value: R) => Either<L, T>): Either<L, T> {
    return this.value.isRight ? f (this.value.value) : this as any;
  }

  static pure<L, R> (value: R): Either<L, R> {
    return new Either (value, true);
  }
}

// @ts-ignore
export const _Left = <L, R>(value: L): Either<L, R> => new Either<L, R> (value, false);
export const _Right = <L, R>(value: R): Either<L, R> => Either.pure<L, R> (value);

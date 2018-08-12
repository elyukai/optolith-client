import * as Al from '../../types/algebraic';

/**
 * The `Identity` monad is a monad that does not embody any computational
 * strategy. It simply applies the bound function to its input without any
 * modification. Computationally, there is no reason to use the `Identity` monad
 * instead of the much simpler act of simply applying functions to their
 * arguments. The purpose of the `Identity` monad is its fundamental role in the
 * theory of monad transformers. Any monad transformer applied to the `Identity`
 * monad yields a non-transformer version of that monad.
 */
export class Identity<T> implements Al.Functor<T>, Al.Applicative<T>, Al.Monad<T> {
  private readonly value: T;

  private constructor(value: T) {
    this.value = value;
  }

  fmap<U>(fn: (value: T) => U): Identity<U> {
    return new Identity(fn(this.value));
  }

  bind<U>(fn: (value: T) => Identity<U>): Identity<U> {
    return fn(this.value);
  }

  sequence<U>(x: Identity<U>): Identity<U> {
    return x;
  }

  /**
   * `(<*>) :: Identity (a -> b) -> Identity a -> Identity b`
   *
   * Transforms the value within the provided `Identity` instance using the
   * function contained withing the instance of this `Identity`.
   */
  ap<U>(m: Identity<((value: T) => U)>): Identity<U> {
    return m.fmap(fn => fn(this.value));
  }

  /**
   * `return :: a -> Identity a`
   *
   * Inject a value into a `Identity` type.
   */
  static return<T>(value: T): Identity<T> {
    return new Identity(value);
  }
}

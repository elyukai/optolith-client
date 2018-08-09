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
export class Identity<T> implements Al.Functor<T>, Al.Apply<T>, Al.Bind<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  /**
   * `map :: (a -> b) -> Identity a -> Identity b`
   *
   * Transforms the value contained within the `Identity` instance with the
   * provided function.
   */
  map<U>(fn: (value: T) => U): Identity<U> {
    return new Identity(fn(this.value));
  }

  /**
   * `(>>=) :: Identity a -> (a -> Identity b) -> Identity b`
   *
   * Produces a new `Identity` instance by applying the value of this `Identity`
   * to the provided function.
   */
  bind<U>(fn: (value: T) => Identity<U>): Identity<U> {
    return fn(this.value);
  }

  /**
   * `(<*>) :: Identity (a -> b) -> Identity a -> Identity b`
   *
   * Transforms the value within the provided `Identity` instance using the
   * function contained withing the instance of this `Identity`.
   */
  ap<U>(m: Identity<((value: T) => U)>): Identity<U> {
    return m.map(fn => fn(this.value));
  }

  /**
   * `of :: a -> Identity a`
   *
   * Creates a new `Identity` from the given value.
   *
   * @class Applicative<T>
   */
  static of<T>(value: T): Identity<T> {
    return new Identity(value);
  }
}

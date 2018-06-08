export class Identity<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  /**
   * `map :: Identity m => m a -> (a -> b) -> m b`
   *
   * Transforms the value contained within the `Identity` instance with the
   * provided function.
   */
  map<U>(fn: (value: T) => U): Identity<U> {
    return new Identity(fn(this.value));
  }

  /**
   * `bind :: Identity m => m a -> (a -> m b) -> m b`
   *
   * Produces a new `Identity` instance by applying the value of this `Identity`
   * to the provided function.
   */
  bind<U>(fn: (value: T) => Identity<U>): Identity<U> {
    return fn(this.value);
  }

  /**
   * `ap :: Identity m => m a -> m (a -> m b) -> m b`
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

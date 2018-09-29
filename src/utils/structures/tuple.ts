import * as Al from '../../types/algebraic';

export class Tuple<T, U> implements Al.Functor<U> {
  private readonly first: T;
  private readonly second: U;

  private constructor (first: T, last: U) {
    this.first = first;
    this.second = last;
  }

  /**
   * `fmap :: (a, b) -> (b -> c) -> (a, c)`
   *
   * Transforms the second element of the `Tuple` instance by applying the given
   * function over the value.
   */
  fmap<V> (fn: (x: U) => V): Tuple<T, V> {
    return Tuple.of<T, V> (this.first) (fn (this.second));
  }

  /**
   * `toArray :: Tuple a b -> [a, b]`
   *
   * Transforms the current `Tuple` instance into an Array of length 2.
   */
  toArray (): [T, U] {
    return [this.first, this.second];
  }

  /**
   * `of :: a -> b -> Tuple a b`
   */
  static of<T, U> (first: T): (second: U) => Tuple<T, U> {
    return second => new Tuple (first, second);
  }

  /**
   * `fst :: (a, b) -> a`
   *
   * Extract the first component of a pair.
   */
  static fst<T> (t: Tuple<T, any>): T {
    return t.first;
  }

  /**
   * `snd :: (a, b) -> b`
   *
   * Extract the second component of a pair.
   */
  static snd<T> (t: Tuple<any, T>): T {
    return t.second;
  }

  /**
   * `swap :: (a, b) -> (b, a)`
   *
   * Swap the components of a pair.
   */
  static swap<A, B> (t: Tuple<A, B>): Tuple<B, A> {
    return Tuple.of<B, A> (t.second) (t.first);
  }

  // Bifunctor functions

  /**
   * `bimap :: (a -> b) -> (c -> d) -> p a c -> p b d`
   *
   * Map over both arguments at the same time.
   */
  static bimap<A, C, B = A, D = C> (
    firstFn: (firstValue: A) => B
  ): (secondFn: (secondValue: C) => D) => (t: Tuple<A, C>) => Tuple<B, D> {
    return secondFn => t => Tuple.of<B, D> (firstFn (t.first)) (secondFn (t.second));
  }

  /**
   * `first :: (a -> b) -> p a c -> p b c`
   *
   * Map covariantly over the first argument.
   */
  static first<A, C, B = A> (f: (value: A) => B): (t: Tuple<A, C>) => Tuple<B, C> {
    return t => Tuple.of<B, C> (f (t.first)) (t.second);
  }

  /**
   * `second :: (b -> c) -> p a b -> p a c`
   *
   * Map covariantly over the second argument.
   */
  static second<A, B, C = B> (f: (value: B) => C): (t: Tuple<A, B>) => Tuple<A, C> {
    return t => Tuple.of<A, C> (t.first) (f (t.second));
  }
}

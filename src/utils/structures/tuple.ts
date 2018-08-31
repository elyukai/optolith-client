import * as Al from '../../types/algebraic';

export class Tuple<T, U> implements Al.Functor<U> {
  private readonly first: T;
  private readonly second: U;

  private constructor (first: T, last: U) {
    this.first = first;
    this.second = last;
  }

  /**
   * `fmap :: Tuple a b -> (b -> c) -> Tuple a c`
   *
   * Transforms the second element of the `Tuple` instance by applying the given
   * function over the value.
   */
  fmap<V> (fn: (x: U) => V): Tuple<T, V> {
    return Tuple.of<T, V> (this.first) (fn (this.second));
  }

  /**
   * `map :: Tuple a b -> (b -> c) -> Tuple a c`
   *
   * Transforms the second element of the `Tuple` instance by applying the given
   * function over the value.
   */
  map<V> (fn: (x: U) => V): Tuple<T, V> {
    return this.fmap (fn);
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
   * `fst :: Tuple a b -> a`
   *
   * Returns the first value of the given `Tuple` instance.
   */
  static fst<T> (t: Tuple<T, any>): T {
    return t.first;
  }

  /**
   * `snd :: Tuple a b -> b`
   *
   * Returns the second value of the given `Tuple` instance.
   */
  static snd<T> (t: Tuple<any, T>): T {
    return t.second;
  }
}

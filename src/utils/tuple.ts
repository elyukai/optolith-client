export class Tuple<T, U> {
  readonly first: T;
  readonly second: U;

  constructor(first: T, last: U) {
    this.first = first;
    this.second = last;
  }

  /**
   * `map :: Tuple a b -> (b -> c) -> Tuple a c`
   *
   * Transforms the second element of the `Tuple` instance by applying the given
   * function over the value.
   */
  map<V>(fn: (x: U) => V): Tuple<T, V> {
    return Tuple.of(this.first, fn(this.second));
  }

  // equals

  // toString

  /**
   * `of :: a -> Tuple a`
   */
  static of<T, U>(first: T, second: U): Tuple<T, U> {
    return new Tuple(first, second);
  }

  static fst<T>(t: Tuple<T, any>): T {
    return t.first;
  }

  static snd<T>(t: Tuple<any, T>): T {
    return t.second;
  }
}

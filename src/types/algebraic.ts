export interface Setoid<T> {
  /**
   * `equals :: Setoid a -> Setoid a -> Bool`
   */
  equals(x: Setoid<T>): boolean;
}

export interface Ord<T> extends Setoid<T> {
  /**
   * `lte :: Ord a -> Ord a -> Bool`
   */
  lte<U extends string | number>(this: Ord<U>, x: Ord<U>): boolean;
  /**
   * `gte :: Ord a -> Ord a -> Bool`
   */
  gte<U extends string | number>(this: Ord<U>, x: Ord<U>): boolean;
  /**
   * `lt :: Ord a -> Ord a -> Bool`
   */
  lt<U extends string | number>(this: Ord<U>, x: Ord<U>): boolean;
  /**
   * `gt :: Ord a -> Ord a -> Bool`
   */
  gt<U extends string | number>(this: Ord<U>, x: Ord<U>): boolean;
}

export interface Semigroup<T> {
  /**
   * `concat :: Semigroup a -> Semigroup a -> Semigroup a`
   */
  concat(x: Semigroup<T>): Semigroup<T>;
}

export interface Functor<T> {
  /**
   * `map :: Functor f => f a ~> (a -> b) -> f b`
   */
  map<U>(fn: (t: T) => U): Functor<U>;
}

export interface Apply<T> extends Functor<T> {
  /**
   * `ap :: Apply f => f a ~> f (a -> b) -> f b`
   */
  ap<U>(m: Apply<(value: T) => U>): Apply<U>;
}

// extends Apply<T>
export interface Applicative {
  /**
   * `of :: Applicative f => a -> f a`
   */
  of<T>(t: T): Apply<T>;
}

export interface Foldable<T> {
  /**
   * `foldl :: (b -> a -> b) -> b -> Foldable a -> b`
   */
  foldl<U>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
}

export interface Bind<T> extends Apply<T> {
  /**
   * `chain :: Bind m => m a ~> (a -> m b) -> m b`
   */
  bind<U>(fn: (t: T) => Bind<U>): Bind<U>;
}

// extends Bind<T>
export interface ChainRec {
  /**
   * `chainRec :: ChainRec m => ((a -> c, b -> c, a) -> m c, a) -> m b`
   * @static
   */
  chainRec<T, U, V>(
    fn: (fn1: (x: T) => V, fn2: (x: U) => V, x: T) => ChainRec,
    x: T
  ): ChainRec;
}

export interface Filterable<T> {
  /**
   * `filter :: (a -> Bool) -> Filterable a -> Filterable a`
   */
  filter(pred: (value: T) => boolean): Filterable<T>;
}

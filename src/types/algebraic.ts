export interface Setoid<T> {
  /**
   * `equals :: Setoid a -> Setoid a -> Bool`
   */
  equals (x: Setoid<T>): boolean;
}

export interface Ord<T> extends Setoid<T> {
  /**
   * `lte :: Ord a -> Ord a -> Bool`
   */
  lte<U extends string | number> (this: Ord<U>, x: Ord<U>): boolean;
  /**
   * `gte :: Ord a -> Ord a -> Bool`
   */
  gte<U extends string | number> (this: Ord<U>, x: Ord<U>): boolean;
  /**
   * `lt :: Ord a -> Ord a -> Bool`
   */
  lt<U extends string | number> (this: Ord<U>, x: Ord<U>): boolean;
  /**
   * `gt :: Ord a -> Ord a -> Bool`
   */
  gt<U extends string | number> (this: Ord<U>, x: Ord<U>): boolean;
}

export interface Semigroup<T> {
  /**
   * `mappend :: Semigroup a -> Semigroup a -> Semigroup a`
   */
  mappend (x: Semigroup<T>): Semigroup<T>;
}

export interface Functor<T> {
  /**
   * `fmap :: (a -> b) -> f a -> f b`
   *
   * Create a new `f b`, from an `f a` using the results of calling a function
   * on every value in the `f a`.
   */
  fmap<U> (fn: (t: T) => U): Functor<U>;
  /**
   * `(<$) :: a -> f b -> f a`
   *
   * Create a new `f a`, from an `f b` by replacing all of the values in the
   * `f b` by a given value of type `a`.
   */
}

export interface Applicative<T> extends Functor<T> {
  /**
   * `ap :: Apply f => f a ~> f (a -> b) -> f b`
   */
  ap<U> (m: Applicative<(value: T) => U>): Applicative<U>;
  /**
   * `liftA2 :: (a -> b -> c) -> f a -> f b -> f c`
   *
   * Lift a binary function to actions.
   *
   * Some functors support an implementation of `liftA2` that is more efficient
   * than the default one. In particular, if `fmap` is an expensive operation,
   * it is likely better to use `liftA2` than to `fmap` over the structure and
   * then use `<*>`.
   */
  // liftA2<U, V>(f: (x1: T) => (x2: U) => V): (x: Applicative<U>) => Applicative<V>;
  /**
   * `liftA2 :: (a -> b -> c) -> f a -> f b -> f c`
   *
   * Lift a binary function to actions.
   *
   * Some functors support an implementation of `liftA2` that is more efficient
   * than the default one. In particular, if `fmap` is an expensive operation,
   * it is likely better to use `liftA2` than to `fmap` over the structure and
   * then use `<*>`.
   */
  // liftA2<U, V>(f: (x1: T) => (x2: U) => V, x: Applicative<U>): Applicative<V>;
  // liftA2<U, V>(
  //   f: (x1: T) => (x2: U) => V,
  //   x?: Applicative<U>
  // ): Applicative<V> | ((x: Applicative<U>) => Applicative<V>);
  /**
   * `pure :: a -> f a`
   *
   * Lift a value.
   * @static
   */
  /**
   * `(*>) :: f a -> f b -> f b`
   *
   * Sequence actions, discarding the value of the first argument.
   */
  /**
   * `(<*) :: f a -> f b -> f a`
   *
   * Sequence actions, discarding the value of the second argument.
   */
}

export interface Alternative<T> extends Applicative<T> {
  /**
   * `(<|>) :: f a -> f a -> f a`
   *
   * An associative binary operation.
   */
  alt (m: Alternative<T>): Alternative<T>;
  // /**
  //  * `empty :: f a`
  //  *
  //  * The identity of `<|>`.
  //  */
  // empty(): Alternative<T>;
}

export interface Foldable<T> {
  /**
   * `foldl :: (b -> a -> b) -> b -> Foldable a -> b`
   *
   * Left-associative fold of a structure.
   *
   * In the case of lists, `foldl`, when applied to a binary operator, a
   * starting value (typically the left-identity of the operator), and a list,
   * reduces the list using the binary operator, from left to right:
   *
   * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
   *
   * Note that to produce the outermost application of the operator the entire
   * input list must be traversed. This means that `foldl'` will diverge if
   * given an infinite list.
   *
   * Also note that if you want an efficient left-fold, you probably want to use
   * `foldl'` instead of `foldl`. The reason for this is that latter does not
   * force the "inner" results (e.g. `z f x1` in the above example) before
   * applying them to the operator (e.g. to `(f x2)`). This results in a thunk
   * chain `O(n)` elements long, which then must be evaluated from the
   * outside-in.
   *
   * For a general `Foldable` structure this should be semantically identical to,
   *
   * ```foldl f z = foldl f z . toList```
   */
  foldl<U> (fn: (acc: U) => (current: T) => U): (initial: U) => U;
}

export interface Monad<T> extends Applicative<T> {
  /**
   * `(>>=) :: forall a b. m a -> (a -> m b) -> m b`
   *
   * Sequentially compose two actions, passing any value produced by the first
   * as an argument to the second.
   */
  bind<U> (fn: (t: T) => Monad<U>): Monad<U>;
  /**
   * `(>>) :: forall a b. m a -> m b -> m b`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  then<U> (x: Monad<U>): Monad<U>;
  /**
   * Other (static) functions:
   *
   * `return :: a -> m a`
   *
   * Inject a value into the monadic type.
   */
}

export interface Filterable<T> {
  /**
   * `filter :: (a -> Bool) -> Filterable a -> Filterable a`
   */
  filter (pred: (value: T) => boolean): Filterable<T>;
}

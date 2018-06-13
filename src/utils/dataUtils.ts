import R from 'ramda';
import * as Al from '../types/algebraic.d';

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

type Some = {};
type Nullable = null | undefined;

/**
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe a`
 * either contains a value of type `a` (represented as `Just a`), or it is empty
 * (represented as `Nothing`). Using `Maybe` is a good way to deal with errors
 * or exceptional cases without resorting to drastic measures such as `error`.
 *
 * The `Maybe` type is also a monad. It is a simple kind of error monad, where
 * all errors are represented by `Nothing`. A richer error monad can be built
 * using the `Either` type.
 */
export class Maybe<T extends Some> implements Al.Functor<T>, Al.Apply<T>,
  Al.Bind<T>, Al.Foldable<T>, Al.Setoid<T>, Al.Ord<T>, Al.Semigroup<T> {
  private readonly value: T | Nullable;

  constructor(value: T | Nullable) {
    this.value = value;
  }

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  equals(x: Maybe<T>): boolean {
    return Maybe.isNothing(this) && Maybe.isNothing(x)
      || Maybe.isJust(this) && Maybe.isJust(x)
        && R.equals((this as Maybe<T>).value, x.value);
  }

  /**
   * `(>) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than the second value.
   */
  gt<T extends number | string>(this: Maybe<T>, comp: Maybe<T>): boolean {
    return Maybe.fromMaybe(false)(this.bind(x1 => comp.map(x2 => x1 > x2)));
  }

  /**
   * `(<) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than the second value.
   */
  lt<T extends number | string>(this: Maybe<T>, comp: Maybe<T>): boolean {
    return Maybe.fromMaybe(false)(this.bind(x1 => comp.map(x2 => x1 < x2)));
  }

  /**
   * `(>=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than or equals the second
   * value.
   */
  gte<T extends number | string>(this: Maybe<T>, comp: Maybe<T>): boolean {
    return Maybe.fromMaybe(false)(this.bind(x1 => comp.map(x2 => x1 >= x2)));
  }

  /**
   * `(<=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than or equals the second
   * value.
   */
  lte<T extends number | string>(this: Maybe<T>, comp: Maybe<T>): boolean {
    return Maybe.fromMaybe(false)(this.bind(x1 => comp.map(x2 => x1 <= x2)));
  }

  /**
   * `map :: (a -> b) -> Maybe a -> Maybe b`
   */
  map<U extends Some>(fn: (value: T) => U): Maybe<U> {
    return this.value == null ? this as any : new Maybe(fn(this.value));
  }

  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value == null ? this as any : fn(this.value);
  }

  /**
   * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
   */
  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U> {
    return this.value == null ? this as any : m.map(fn => fn(this.value!));
  }

  /**
   * `foldl :: (b -> a -> b) -> b -> Maybe a -> b`
   */
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (fn: (acc: U) => (current: T) => U) => (initial: U) =>
      this.value == null
        ? initial
        : fn(initial!)(this.value);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  /**
   * `concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
   *
   * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
   * type `Just a`. If at least one of them is `Nothing`, it returns the first
   * element.
   */
  concat<T, A extends Al.Semigroup<T>>(this: Maybe<A>, m: Maybe<A>): Maybe<A> {
    return this.value == null || m.value == null
      ? this
      : Maybe.of(this.value.concat(m.value) as A);
  }

  /**
   * `alt :: Maybe m => m a -> m a -> m a`
   *
   * The `alt` function takes a `Maybe` of the same type. If `this` is
   * `Nothing`, it returns the passed `Maybe`, otherwise it returns `this`.
   */
  alt(m: Maybe<T>): Maybe<T> {
    return this.value == null ? m : this;
  }

  /**
   * `toString :: Maybe m => m a -> String`
   */
  toString(): string {
    return this.value == null ? `Nothing` : `Just(${this.value})`;
  }

  /**
   * `of :: a -> Maybe a`
   *
   * Creates a new `Maybe` from the given value.
   *
   * @class Applicative<T>
   */
  static of<T extends Some>(value: T | Nullable): Maybe<T> {
    return new Maybe(value);
  }

  /**
   * `ofPred :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some, R extends T>(
    pred: (value: T) => value is R
  ): (value: T | Nullable) => Maybe<R>;
  static ensure<T extends Some>(
    pred: (value: T) => boolean
  ): (value: T | Nullable) => Maybe<T>;
  static ensure<T extends Some, R extends T>(
    pred: (value: T) => value is R,
    value: T | Nullable,
  ): Maybe<R>;
  static ensure<T extends Some>(
    pred: (value: T) => boolean,
    value: T | Nullable,
  ): Maybe<T>;
  static ensure<T extends Some>(
    pred: (value: T) => boolean,
    value?: T | Nullable,
  ): ((value: T | Nullable) => Maybe<T>) | Maybe<T> {
    const curriedReturn = (x: T | Nullable) => Maybe.of(x).bind<T>(x =>
      pred(x) ? Maybe.Just(x) : Maybe.Nothing()
    );

    if (arguments.length === 2) {
      return curriedReturn(value);
    }
    else {
      return curriedReturn;
    }
  }

  /**
   * `maybe :: b -> (a -> b) -> Maybe a -> b`
   *
   * The `maybe` function takes a default value, a function, and a `Maybe`
   * value. If the `Maybe` value is `Nothing`, the function returns the default
   * value. Otherwise, it applies the function to the value inside the `Just`
   * and returns the result.
   */
  static maybe<T extends Some, U extends Some>(
    def: U
  ): (fn: (x: T) => U) => (m: Maybe<T>) => U;
  static maybe<T extends Some, U extends Some>(
    def: U, fn: (x: T) => U
  ): (m: Maybe<T>) => U;
  static maybe<T extends Some, U extends Some>(
    def: U, fn: (x: T) => U, m: Maybe<T>
  ): U;
  static maybe<T extends Some, U extends Some>(
    def: U, fn?: (x: T) => U, m?: Maybe<T>,
  ): U | ((m: Maybe<T>) => U) | ((fn: (x: T) => U) => (m: Maybe<T>) => U) {
    if (arguments.length === 3) {
      return m!.foldl(() => fn!, def);
    }
    else if (arguments.length === 2) {
      return (m: Maybe<T>) => m.foldl(() => fn!, def);
    }
    else {
      return (fn: (x: T) => U) =>
        (m: Maybe<T>) =>
          m.foldl(() => fn, def);
    }
  }

  /**
   * `isJust :: Maybe a -> Bool`
   *
   * The `isJust` function returns `true` if its argument is of the form
   * `Just _`.
   */
  static isJust<T extends Some>(x: Maybe<T>): x is Just<T> {
    return x.value != null;
  }

  /**
   * `isNothing :: Maybe a -> Bool`
   *
   * The `isNothing` function returns `true` if its argument is `Nothing`.
   */
  static isNothing<T extends Some>(x: Maybe<T>): x is Nothing {
    return x.value == null;
  }

  /**
   * `fromJust :: Maybe a -> a`
   *
   * The `fromJust` function extracts the element out of a `Just` and throws an
   * error if its argument is `Nothing`.
   */
  static fromJust<T extends Some>(m: Just<T>): T {
    if (Maybe.isJust(m)) {
      return m.value as T;
    }

    throw new TypeError(`Cannot extract a value out of type Nothing`);
  }

  /**
   * `fromMaybe :: a -> Maybe a -> a`
   *
   * The `fromMaybe` function takes a default value and and `Maybe` value. If
   * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
   * returns the value contained in the `Maybe`.
   */
  static fromMaybe<T extends Some>(def: T): (m: Maybe<T>) => T;
  static fromMaybe<T extends Some>(def: T, m: Maybe<T>): T;
  static fromMaybe<T extends Some>(
    def: T, m?: Maybe<T>
  ): T | ((m: Maybe<T>) => T) {
    if (arguments.length === 2 && m !== undefined) {
      return Maybe.isJust(m) ? Maybe.fromJust(m) : def;
    }

    return m => Maybe.isJust(m) ? Maybe.fromJust(m) : def;
  }

  /**
   * `listToMaybe :: [a] -> Maybe a`
   *
   * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
   * where `a` is the first element of the list.
   */
  static listToMaybe<T extends Some>(list: List<T>): Maybe<T> {
    return list.length() === 0 ? Maybe.Nothing() : list.head();
  }

  /**
   * `maybeToList :: Maybe a -> [a]`
   *
   * The `maybeToList` function returns an empty list when given `Nothing` or a
   * singleton list when not given `Nothing`.
   */
  static maybeToList<T extends Some>(m: Maybe<T>): List<T> {
    return Maybe.isJust(m) ? List.of(m.value as T) : new List();
  }

  /**
   * `catMaybes :: [Maybe a] -> [a]`
   *
   * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
   * the `Just` values.
   */
  static catMaybes<T extends Some>(
    list: List<Maybe<T>>
  ): List<T> {
    return list.filter(Maybe.isJust).map(e => e.value as T);
  }

  /**
   * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
   *
   * The `mapMaybe` function is a version of `map` which can throw out elements.
   * If particular, the functional argument returns something of type `Maybe b`.
   * If this is `Nothing`, no element is added on to the result list. If it is
   * `Just b`, then `b` is included in the result list.
   */
  static mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
  ): (list: List<T>) => List<U>;
  static mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list: List<T>,
  ): List<U>;
  static mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list?: List<T>,
  ): List<U> | ((list: List<T>) => List<U>) {
    if (list === undefined) {
      return list => list.map(fn).filter(Maybe.isJust).map(e => e.value as U);
    }

    return list.map(fn).filter(Maybe.isJust).map(e => e.value as U);
  }

  /**
   * `Just :: a -> Just a`
   */
  static Just<T extends Some>(value: T): Just<T> {
    return new Maybe(value) as Just<T>;
  }

  /**
   * `Nothing :: () -> Nothing`
   */
  static Nothing(): Nothing {
    return new Maybe(undefined) as Nothing;
  }

  // INSTANCE METHODS AS STATIC FUNCTIONS

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  static equals<T extends Some>(m1: Maybe<T>): (m2: Maybe<T>) => boolean;
  static equals<T extends Some>(m1: Maybe<T>, m2: Maybe<T>): boolean;
  static equals<T extends Some>(m1: Maybe<T>, m2?: Maybe<T>): boolean | ((m2: Maybe<T>) => boolean) {
    const resultFn = (m1: Maybe<T>, m2: Maybe<T>) => m1.equals(m2);

    if (arguments.length === 2) {
      return resultFn(m1, m2!);
    }
    else {
      return m2 => resultFn(m1, m2);
    }
  }

  /**
   * `map :: (a -> b) -> Maybe a -> Maybe b`
   */
  static map<T extends Some, U extends Some>(
    fn: (value: T) => U
  ): (m: Maybe<T>) => Maybe<U>;
  static map<T extends Some, U extends Some>(
    fn: (value: T) => U, m: Maybe<T>
  ): Maybe<U>;
  static map<T extends Some, U extends Some>(
    fn: (value: T) => U, m?: Maybe<T>
  ): Maybe<U> | ((m: Maybe<T>) => Maybe<U>) {
    const resultFn = (fn: (value: T) => U, m: Maybe<T>) => m.map(fn);

    if (arguments.length === 2) {
      return resultFn(fn, m!);
    }
    else {
      return m => resultFn(fn, m);
    }
  }
}

export interface Just<T extends Some> extends Maybe<T> {
  map<U extends Some>(fn: (value: T) => U): Just<U>;
  bind<U extends Some>(fn: (value: T) => Nothing): Nothing;
  bind<U extends Some>(fn: (value: T) => Just<U>): Just<U>;
  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U>;
  ap<U extends Some>(m: Just<((value: T) => U)>): Just<U>;
  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U>;
  concat<T, A extends Al.Semigroup<T>>(this: Just<A>, m: Just<A>): Just<A>;
  concat<T, A extends Al.Semigroup<T>>(this: Just<A>, m: Nothing): Just<A>;
  alt(): Just<T>;
}

export interface Nothing extends Maybe<never> {
  map(): Nothing;
  bind(): Nothing;
  concat<T, A extends Al.Semigroup<T>>(this: Nothing, m: Maybe<A>): Nothing;
  alt<T>(m: Maybe<T>): Maybe<T>;
}

export class List<T> implements Al.Functor<T>, Al.Foldable<T>, Al.Semigroup<T>,
  Al.Filterable<T> {
  private readonly value: ReadonlyArray<T>;

  constructor(...initialElements: T[]) {
    this.value = initialElements;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.value[Symbol.iterator]();
  }

  // BASIC

  /**
   * `head :: [a] -> Maybe a`
   *
   * Extract the first element of a list.
   */
  head(): Maybe<T> {
    return Maybe.of(this.value[0]);
  }

  /**
   * `last :: [a] -> Maybe a`
   *
   * Extract the last element of a list, which must be finite.
   */
  last(): Maybe<T> {
    return Maybe.of(this.value[this.value.length - 1]);
  }

  /**
   * `tail :: [a] -> [a]`
   *
   * Extract the elements after the head of a list.
   */
  tail(): List<T> {
    const tail = this.value.slice(1);
    return this.value.length > 1 ? List.of(...tail) : new List();
  }

  /**
   * `init :: [a] -> [a]`
   *
   * Return all the elements of a list except the last one.
   */
  init(): List<T> {
    const init = this.value.slice(0, this.value.length - 2);
    return this.value.length > 1 ? List.of(...init) : new List();
  }

  /**
   * `null :: Foldable t => t a -> Bool`
   *
   * Test whether the structure is empty.
   */
  null(): boolean {
    return this.value.length === 0;
  }

  /**
   * `length :: Foldable t => t a -> Int`
   *
   * Returns the size/length of a finite structure as an `Int`.
   */
  length(): number {
    return this.value.length;
  }

  // LIST TRANSFORMATIONS

  /**
   * `map :: (a -> b) -> [a] -> [b]`
   *
   * `map f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  map<U>(fn: (x: T) => U): List<U> {
    return List.of(...this.value.map(fn));
  }

  // REDUCING LISTS (FOLDS)

  /**
   * `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
   *
   *
   */
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (fn: (acc: U) => (current: T) => U) => (initial: U) =>
      this.value.reduce<U>((acc, e) => fn(acc)(e), initial);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  /**
   * `foldli :: Foldable t => (b -> a -> Int -> b) -> b -> t a -> b`
   *
   *
   */
  foldli<U extends Some>(
    fn: (acc: U) => (current: T) => (index: number) => U
  ): (initial: U) => U;
  foldli<U extends Some>(
    fn: (acc: U) => (current: T) => (index: number) => U,
    initial: U
  ): U;
  foldli<U extends Some>(
    fn: (acc: U) => (current: T) => (index: number) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (
      fn: (acc: U) => (current: T) => (index: number) => U
    ) => (initial: U) =>
      this.value.reduce<U>((acc, e, index) => fn(acc)(e)(index), initial);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  /**
   * `foldl_ :: Foldable t => (b -> a -> Int -> b) -> b -> t a -> b`
   *
   *
   */
  foldl_<U extends Some>(
    fn: (acc: U) => (current: T) => (index: number) => (list: List<T>) => U
  ): (initial: U) => U;
  foldl_<U extends Some>(
    fn: (acc: U) => (current: T) => (index: number) => (list: List<T>) => U,
    initial: U
  ): U;
  foldl_<U extends Some>(
    fn: (acc: U) => (current: T) => (index: number) => (list: List<T>) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (
      fn: (acc: U) => (current: T) => (index: number) => (list: List<T>) => U
    ) => (initial: U) =>
      this.value.reduce<U>((acc, e, index) => fn(acc)(e)(index)(this), initial);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  // SPECIAL FOLDS

  /**
   * `concat :: Foldable t => t [a] -> [a]`
   *
   * The concatenation of all the elements of a container of lists.
   */
  concat(add: List<T>): List<T> {
    return List.of(...this.value, ...add.value);
  }

  /**
   * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  any(fn: (x: T) => boolean): boolean {
    return this.value.some(fn);
  }

  /**
   * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether all elements of the structure satisfy the predicate.
   */
  all(fn: (x: T) => boolean): boolean {
    return this.value.every(fn);
  }

  /**
   * `sum :: (Foldable t, Num a) => t a -> a`
   *
   * The `sum` function computes the sum of the numbers of a structure.
   */
  sum(this: List<number>): number {
    return this.value.reduce((acc, e) => acc + e, 0);
  }

  /**
   * `product :: (Foldable t, Num a) => t a -> a`
   *
   * The `product` function computes the product of the numbers of a structure.
   */
  product(this: List<number>): number {
    return this.value.reduce((acc, e) => acc * e, 0);
  }

  /**
   * `maximum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The largest element of a non-empty structure.
   */
  maximum(this: List<number>): number {
    return Math.max(...this.value);
  }

  /**
   * `minimum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The least element of a non-empty structure.
   */
  minimum(this: List<number>): number {
    return Math.min(...this.value);
  }

  // EXTRACTING SUBLISTS

  /**
   * `take :: Int -> [a] -> [a]`
   *
   * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`, or `xs` itself if `n > length xs`.
   */
  take(length: number): List<T> {
    return this.value.length < length
      ? this
      : List.of(...this.value.slice(0, length - 1));
  }

  // SEARCHING BY EQUALITY

  /**
   * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * Does the element occur in the structure?
   */
  elem(e: T): boolean {
    return this.value.includes(e);
  }

  /**
   * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * `notElem` is the negation of `elem`.
   */
  notElem(e: T): boolean {
    return !this.elem(e);
  }

  /**
   * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
   *
   * `lookup key assocs` looks up a key in an association list.
   */
  lookup<K, V>(this: List<Tuple<K, V>>, key: K): Maybe<V> {
    return this.find(e => Tuple.fst(e) === key).map(Tuple.snd);
  }

  // SEARCHING WITH A PREDICATE

  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  find<U extends T>(pred: (x: T) => x is U): Maybe<U>;
  find(pred: (x: T) => boolean): Maybe<T>;
  find(pred: (x: T) => boolean): Maybe<T> {
    return Maybe.of(this.value.find(pred));
  }

  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  filter<U extends T>(pred: (x: T) => x is U): List<U>;
  filter(pred: (x: T) => boolean): List<T>;
  filter(pred: (x: T) => boolean): List<T> {
    return List.of(...this.value.filter(pred));
  }

  // INDEXING LISTS

  /**
   * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
   *
   * The `elemIndex` function returns the index of the first element in the
   * given list which is equal (by `==`) to the query element, or `Nothing` if
   * there is no such element.
   */
  elemIndex(x: T): Maybe<number> {
    const res = this.value.indexOf(x);
    return res > -1 ? Maybe.Just(res) : Maybe.Nothing();
  }

  /**
   * `elemIndices :: Eq a => a -> [a] -> [Int]`
   *
   * The `elemIndices` function extends `elemIndex`, by returning the indices of
   * all elements equal to the query element, in ascending order.
   */
  elemIndices(x: T): List<number> {
    return List.of(...this.value.reduce<number[]>((acc, e, index) => {
      return e === x ? [...acc, index] : acc;
    }, []));
  }

  /**
   * `findIndex :: (a -> Bool) -> [a] -> Maybe Int`
   *
   * The `findIndex` function takes a predicate and a list and returns the index
   * of the first element in the list satisfying the predicate, or `Nothing` if
   * there is no such element.
   */
  findIndex(pred: (x: T) => boolean): Maybe<number> {
    const res = this.value.findIndex(pred);
    return res > -1 ? Maybe.Just(res) : Maybe.Nothing();
  }

  /**
   * `findIndices :: (a -> Bool) -> [a] -> [Int]`
   *
   * The `findIndices` function extends `findIndex`, by returning the indices of
   * all elements satisfying the predicate, in ascending order.
   */
  findIndices(pred: (x: T) => boolean): List<number> {
    return List.of(...this.value.reduce<number[]>((acc, e, index) => {
      return pred(e) ? [...acc, index] : acc;
    }, []));
  }

  // "SET" OPERATIONS

  /**
   * `delete :: Eq a => a -> [a] -> [a]`
   *
   * `delete x` removes the first occurrence of `x` from its list argument.
   */
  delete(x: T): List<T> {
    let isDeleted = false;
    return List.of(...this.value.filter(e => {
      if (!isDeleted && R.equals(e, x)) {
        isDeleted = true;
        return false;
      }
      return true;
    }));
  }

  // ORDERED LISTS

  /**
   * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
   *
   * The `sortBy` function is the non-overloaded version of `sort`.
   */
  sortBy(fn: (a: T) => (b: T) => number): List<T> {
    return List.of(...[...this.value].sort((a, b) => fn(a)(b)));
  }

  // OWN METHODS (NO HASKELL EQUIVALENT)

  /**
   * `append :: a -> [a]`
   *
   * Appends an element to the list.
   */
  append(e: T): List<T> {
    return List.of(...this.value, e);
  }

  /**
   * `prepend :: a -> [a]`
   *
   * Prepends an element to the list.
   */
  prepend(e: T): List<T> {
    return List.of(e, ...this.value);
  }

  /**
   * `add :: Int -> a -> [a]`
   *
   * Inserts an element at the given index. This does not remove the item at the
   * index but instead shifts all following elements. Thus, the list will always
   * grow.
   */
  add(index: number, value: T): List<T> {
    if (index >= this.value.length) {
      return List.of(...this.value, value);
    }
    else if (index <= 0) {
      return List.of(value, ...this.value);
    }
    else {
      return List.of(
        ...this.value.slice(0, index),
        value,
        ...this.value.slice(index)
      );
    }
  }

  /**
   * `insert :: Int -> a -> [a]`
   *
   * Inserts an element at the given index. This overwrites the current element
   * at that position. The size of the list will always stay the same. Invalid
   * indices (e.g. the index does not exist) will only create a copy of the
   * list.
   */
  insert(index: number, value: T): List<T> {
    return List.of(...this.value.map((e, i) => i === index ? value : e));
  }

  /**
   * `adjust :: Ord k => (a -> a) -> k -> [a] -> [a]`
   *
   * Update a value at a specific key with the result of the provided function.
   * When the index is not a member of the list, the original list is returned.
   */
  adjust(fn: (value: T) => T): (index: number) => List<T>;
  adjust(fn: (value: T) => T, index: number): List<T>;
  adjust(
    fn: (value: T) => T,
    index?: number
  ): List<T> | ((index: number) => List<T>) {
    const resultFn = (fn: (value: T) => T, index: number) => {
      const entry = this.subscript(index);
      return Maybe.isJust(entry)
        ? this.insert(index, fn(Maybe.fromJust(entry)))
        : this;
    };

    if (arguments.length === 2) {
      return resultFn(fn, index!);
    }
    else {
      return (index: number) => resultFn(fn, index);
    }
  }

  /**
   * `update :: Ord k => (a -> Maybe a) -> Int -> [a] -> [a]`
   *
   * The expression `(update f k list)` updates the value `x` at `k` (if the
   * index exists). If `(f x)` is `Nothing`, the element is deleted. If it is `
   * (Just y)`, the index `k` is bound to the new value `y`.
   */
  update(fn: (value: T) => Maybe<T>): (index: number) => List<T>;
  update(fn: (value: T) => Maybe<T>, index: number): List<T>;
  update(
    fn: (value: T) => Maybe<T>,
    index?: number
  ): List<T> | ((index: number) => List<T>) {
    const resultFn = (fn: (value: T) => Maybe<T>, index: number) => {
      const entry = this.subscript(index);
      if (Maybe.isJust(entry)) {
        const res = fn(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return this.insert(index, Maybe.fromJust(res));
        }
        else {
          return this.delete(Maybe.fromJust(entry));
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, index!);
    }
    else {
      return (index: number) => resultFn(fn, index);
    }
  }

  /**
   * `get :: Int -> Maybe a`
   *
   * Returns the element at the given index. If the index is invalid, returns
   * `Nothing`, otherwise `Just a`.
   */
  subscript(index: number): Maybe<T> {
    return Maybe.of(this.value[index]);
  }

  /**
   * `delete :: Int -> [a] -> [a]`
   *
   * The `delete` function removes the value at the given index from the list.
   */
  deleteAt(index: number): List<T> {
    return List.of(
      ...this.value.slice(0, index),
      ...this.value.slice(index + 1)
    );
  }

  /**
   * `flatten :: [[a]] -> [a]`
   *
   * The `flatten` function spreads all elements contained in this list's list
   * elements into a new list.
   */
  flatten<T>(this: List<List<T>>): List<T> {
    return List.of(...this.value.reduce<T[]>((acc, e) => {
      return acc.concat(e.value);
    }, []));
  }

  /**
   * `mapWithIndex :: (Int -> a -> b) -> [a] -> [b]`
   *
   * `map f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  mapWithIndex<U>(fn: (index: number) => (x: T) => U): List<U> {
    return List.of(...this.value.map((e, i) => fn(i)(e)));
  }

  // TODO: toString

  static of<T>(...initialElements: T[]): List<T> {
    return new List(...initialElements);
  }

  static find<T, U extends T>(
    pred: (x: T) => x is U
  ): (list: List<T>) => Maybe<U>;
  static find<T>(pred: (x: T) => boolean): (list: List<T>) => Maybe<T>;
  static find<T>(pred: (x: T) => boolean): (list: List<T>) => Maybe<T> {
    return list => list.find(pred);
  }

  static filter<T, U extends T>(
    pred: (x: T) => x is U
  ): (list: List<T>) => List<U>;
  static filter<T>(pred: (x: T) => boolean): (list: List<T>) => List<T>;
  static filter<T>(pred: (x: T) => boolean): (list: List<T>) => List<T> {
    return list => list.filter(pred);
  }

  static toMap<K, V>(list: List<Tuple<K, V>>): OrderedMap<K, V> {
    return OrderedMap.of(list.value.map(t =>
      [Tuple.fst(t), Tuple.snd(t)] as [K, V]
    ));
  }

  static toArray<T>(list: List<T>): ReadonlyArray<T> {
    return list.value;
  }

  static isList(value: any): value is List<any> {
    return value instanceof List;
  }
}

export class Tuple<T, U> implements Al.Functor<U> {
  private readonly first: T;
  private readonly second: U;

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

  // TODO: equals

  // TODO: toString

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

type LookupWithKey<K, V> = Tuple<Maybe<V>, OrderedMap<K, V>>;

export class OrderedMap<K, V> implements Al.Functor<V>, Al.Filterable<V>,
  Al.Foldable<V> {
  private readonly value: ReadonlyMap<K, V>;

  constructor(initial?: ReadonlyMap<K, V> | [K, V][] | List<Tuple<K, V>>) {
    if (initial instanceof Map) {
      this.value = initial;
    }
    else if (initial instanceof List) {
      this.value = new Map(List.toArray(initial).map(e =>
        [Tuple.fst(e), Tuple.snd(e)] as [K, V]
      ));
    }
    else if (initial !== undefined) {
      this.value = new Map(initial);
    }
    else {
      this.value = new Map();
    }
  }

  // QUERY

  /**
   * `null :: Map k a -> Bool`
   *
   * Is the map empty?
   */
  null(): boolean {
    return this.value.size === 0;
  }

  /**
   * `size :: Map k a -> Int`
   *
   * The number of elements in the map.
   */
  size(): number {
    return this.value.size;
  }

  /**
   * `member :: Ord k => k -> Map k a -> Bool`
   *
   * Is the key a member of the map?
   */
  member(key: K): boolean {
    return this.value.has(key);
  }

  /**
   * `notMember :: Ord k => k -> Map k a -> Bool`
   *
   * Is the key not a member of the map?
   */
  notMember(key: K): boolean {
    return !this.member(key);
  }

  /**
   * `lookup :: Ord k => k -> Map k a -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   */
  lookup(key: K): Maybe<V> {
    return Maybe.of(this.value.get(key));
  }

  /**
   * `lookupWithDefault :: Ord k => a -> k -> Map k a -> a`
   *
   * The expression `(lookupWithDefault def k map)` returns the value at key `k`
   * or returns default value `def` when the key is not in the map.
   */
  lookupWithDefault(def: V): (key: K) => V;
  lookupWithDefault(def: V, key: K): V;
  lookupWithDefault(def: V, key?: K): V | ((key: K) => V) {
    if (arguments.length === 2) {
      return Maybe.fromMaybe(def)(this.lookup(key!));
    }

    return key => Maybe.fromMaybe(def)(this.lookup(key));
  }

  // INSERTION

  /**
   * `insert :: Ord k => k -> a -> Map k a -> Map k a`
   *
   * Insert a new key and value in the map. If the key is already present in the
   * map, the associated value is replaced with the supplied value. `insert` is
   * equivalent to `insertWith const`.
   */
  insert(key: K): (value: V) => OrderedMap<K, V>;
  insert(key: K, value: V): OrderedMap<K, V>;
  insert(key: K, value?: V): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>) {
    if (arguments.length === 2) {
      return new OrderedMap([...this.value, [key, value!]]);
    }
    else {
      return value => new OrderedMap([...this.value, [key, value]]);
    }
  }

  /**
   * `insertWith :: Ord k => (a -> a -> a) -> k -> a -> Map k a -> Map k a`
   *
   * Insert with a function, combining new value and old value.
   * `insertWith f key value mp` will insert the pair `(key, value)` into `mp`
   * if `key` does not exist in the map. If the `key` does exist, the function
   * will insert the pair `(key, f new_value old_value)`.
   */
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => OrderedMap<K, V>;
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V, key: K
  ): (value: V) => OrderedMap<K, V>;
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V, key: K, value: V
  ): OrderedMap<K, V>;
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V, key?: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>)
    | ((key: K) => (value: V) => OrderedMap<K, V>) {
    const resultFn =
      (fn: (oldValue: V) => (newValue: V) => V, key: K, value: V) => {
        const entry = this.lookup(key);
        if (Maybe.isJust(entry)) {
          return new OrderedMap([
            ...this.value,
            [key, fn(Maybe.fromJust(entry))(value)]
          ]);
        }
        else {
          return new OrderedMap([...this.value, [key, value]]);
        }
      };

    if (arguments.length === 3) {
      return resultFn(fn, key!, value!);
    }
    else if (arguments.length === 2) {
      return (value: V) => resultFn(fn, key!, value);
    }
    else {
      return (key: K) => (value: V) => resultFn(fn, key!, value!);
    }
  }

  /**
   * `insertWithKey :: Ord k => (k -> a -> a -> a) -> k -> a -> Map k a ->
   * Map k a`
   *
   * Insert with a function, combining key, new value and old value.
   * `insertWithKey f key value mp` will insert the pair `(key, value)` into
   * `mp` if `key` does not exist in the map. If the key does exist, the
   * function will insert the pair `(key,f key new_value old_value)`. Note that
   * the key passed to `f` is the same key passed to `insertWithKey`.
   */
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => OrderedMap<K, V>;
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K
  ): (value: V) => OrderedMap<K, V>;
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K, value: V
  ): OrderedMap<K, V>;
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key?: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>)
    | ((key: K) => (value: V) => OrderedMap<K, V>) {
    const resultFn = (
      fn: (key: K) => (oldValue: V) => (newValue: V) => V,
      key: K,
      value: V
    ) => {
      const entry = this.lookup(key);
      if (Maybe.isJust(entry)) {
        return new OrderedMap([
          ...this.value,
          [key, fn(key)(Maybe.fromJust(entry))(value)]
        ]);
      }
      else {
        return new OrderedMap([...this.value, [key, value]]);
      }
    };

    if (arguments.length === 3) {
      return resultFn(fn, key!, value!);
    }
    else if (arguments.length === 2) {
      return (value: V) => resultFn(fn, key!, value);
    }
    else {
      return (key: K) => (value: V) => resultFn(fn, key!, value!);
    }
  }

  /**
   * `insertLookupWithKey :: Ord k => (k -> a -> a -> a) -> k -> a -> Map k a ->
   * (Maybe a, Map k a)`
   *
   * Combines insert operation with old value retrieval. The expression
   * `(insertLookupWithKey f k x map)` is a pair where the first element is
   * equal to `(lookup k map)` and the second element equal to `(insertWithKey f
   * k x map)`.
   */
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => LookupWithKey<K, V>;
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K
  ): (value: V) => LookupWithKey<K, V>;
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K, value: V
  ): LookupWithKey<K, V>;
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key?: K, value?: V
  ): LookupWithKey<K, V> | ((value: V) => LookupWithKey<K, V>)
    | ((key: K) => (value: V) => LookupWithKey<K, V>) {
    const resultFn = (
      fn: (key: K) => (oldValue: V) => (newValue: V) => V,
      key: K,
      value: V
    ) => Tuple.of(this.lookup(key), this.insertWithKey(fn, key, value!));

    if (arguments.length === 3) {
      return resultFn(fn, key!, value!);
    }
    else if (arguments.length === 2) {
      return (value: V) => resultFn(fn, key!, value);
    }
    else {
      return (key: K) => (value: V) => resultFn(fn, key!, value!);
    }
  }

  // DELETE/UPDATE

  /**
   * Removes a key without checking its existence before. For internal use only.
   */
  private removeKey(key: K): OrderedMap<K, V> {
    return List.toMap(OrderedMap.toList(this).filter(t => Tuple.fst(t) !== key));
  }

  /**
   * `delete :: Ord k => k -> Map k a -> Map k a`
   *
   * Delete a key and its value from the map. When the key is not a member of
   * the map, the original map is returned.
   */
  delete(key: K): OrderedMap<K, V> {
    return this.member(key) ? this.removeKey(key) : this;
  }

  /**
   * `adjust :: Ord k => (a -> a) -> k -> Map k a -> Map k a`
   *
   * Update a value at a specific key with the result of the provided function.
   * When the key is not a member of the map, the original map is returned.
   */
  adjust(fn: (value: V) => V): (key: K) => OrderedMap<K, V>;
  adjust(fn: (value: V) => V, key: K): OrderedMap<K, V>;
  adjust(
    fn: (value: V) => V,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (fn: (value: V) => V, key: K) => {
      const entry = this.lookup(key);
      return Maybe.isJust(entry)
        ? new OrderedMap([...this.value, [key, fn(Maybe.fromJust(entry))]])
        : this;
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (key: K) => resultFn(fn, key);
    }
  }

  /**
   * `adjustWithKey :: Ord k => (k -> a -> a) -> k -> Map k a -> Map k a`
   *
   * Adjust a value at a specific key. When the key is not a member of the map,
   * the original map is returned.
   */
  adjustWithKey(fn: (key: K) => (value: V) => V): (key: K) => OrderedMap<K, V>;
  adjustWithKey(fn: (key: K) => (value: V) => V, key: K): OrderedMap<K, V>;
  adjustWithKey(
    fn: (key: K) => (value: V) => V,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (fn: (key: K) => (value: V) => V, key: K) => {
      const entry = this.lookup(key);
      return Maybe.isJust(entry)
        ? new OrderedMap([...this.value, [key, fn(key)(Maybe.fromJust(entry))]])
        : this;
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (key: K) => resultFn(fn, key);
    }
  }

  /**
   * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(update f k map)` updates the value `x` at `k` (if it is in
   * the map). If `(f x)` is `Nothing`, the element is deleted. If it is
   * `(Just y)`, the key `k` is bound to the new value `y`.
   */
  update(fn: (value: V) => Maybe<V>): (key: K) => OrderedMap<K, V>;
  update(fn: (value: V) => Maybe<V>, key: K): OrderedMap<K, V>;
  update(
    fn: (value: V) => Maybe<V>,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (fn: (value: V) => Maybe<V>, key: K) => {
      const entry = this.lookup(key);
      if (Maybe.isJust(entry)) {
        const res = fn(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return new OrderedMap([...this.value, [key, Maybe.fromJust(res)]]);
        }
        else {
          return this.removeKey(key);
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (key: K) => resultFn(fn, key);
    }
  }

  /**
   * `updateWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(updateWithKey f k map)` updates the value `x` at `k` (if
   * it is in the map). If `(f k x)` is `Nothing`, the element is deleted. If it
   * is `(Just y)`, the key `k` is bound to the new value `y`.
   */
  updateWithKey(
    fn: (key: K) => (value: V) => Maybe<V>
  ): (key: K) => OrderedMap<K, V>;
  updateWithKey(
    fn: (key: K) => (value: V) => Maybe<V>, key: K
  ): OrderedMap<K, V>;
  updateWithKey(
    fn: (key: K) => (value: V) => Maybe<V>,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (fn: (key: K) => (value: V) => Maybe<V>, key: K) => {
      const entry = this.lookup(key);
      if (Maybe.isJust(entry)) {
        const res = fn(key)(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return new OrderedMap([...this.value, [key, Maybe.fromJust(res)]]);
        }
        else {
          return this.removeKey(key);
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (key: K) => resultFn(fn, key);
    }
  }

  /**
   * `updateLookupWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a ->
   * (Maybe a, Map k a)`
   *
   * Lookup and update. See also `updateWithKey`. The function returns changed
   * value, if it is updated. Returns the original key value if the map entry is
   * deleted.
   */
  updateLookupWithKey(
    fn: (key: K) => (value: V) => Maybe<V>, key?: K
  ): LookupWithKey<K, V> | ((key: K) => LookupWithKey<K, V>)
    | ((key: K) => (value: V) => LookupWithKey<K, V>) {
      const resultFn = (
        fn: (key: K) => (value: V) => Maybe<V>,
        key: K
      ): LookupWithKey<K, V> => {
        const entry = this.lookup(key);
        if (Maybe.isJust(entry)) {
          const res = fn(key)(Maybe.fromJust(entry));
          if (Maybe.isJust(res)) {
            return Tuple.of(res, new OrderedMap([
              ...this.value,
              [key, Maybe.fromJust(res)]
            ]));
          }
          else {
            return Tuple.of(entry, this.removeKey(key));
          }
        }
        else {
          return Tuple.of(entry, this);
        }
      };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (key: K) => resultFn(fn, key);
    }
  }

  /**
   * `alter :: Ord k => (Maybe a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(alter f k map)` alters the value `x` at `k`, or absence
   * thereof. `alter` can be used to insert, delete, or update a value in a
   * `Map`. In short : `lookup k (alter f k m) = f (lookup k m)`.
   */
  alter(fn: (x: Maybe<V>) => Maybe<V>): (key: K) => OrderedMap<K, V>;
  alter(fn: (x: Maybe<V>) => Maybe<V>, key: K): OrderedMap<K, V>;
  alter(
    fn: (x: Maybe<V>) => Maybe<V>,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (key: K) => {
      const entry = this.lookup(key);
      const res = fn(entry);

      if (Maybe.isJust(res)) {
        return this.insert(key, Maybe.fromJust(res));
      }
      else {
        return this.delete(key);
      }
    };

    if (arguments.length === 2 && key !== undefined) {
      return resultFn(key);
    }
    else {
      return resultFn;
    }
  }

  /**
   * `union :: Ord k => Map k a -> Map k a -> Map k a`
   *
   *  The expression `(union t1 t2)` takes the left-biased union of `t1` and
   * `t2`. It prefers `t1` when duplicate keys are encountered, i.e. `(union ==
   * unionWith const)`.
   */
  union(add: OrderedMap<K, V>) {
    return OrderedMap.of(new Map([...this.value, ...add.value]));
  }

  /**
   * `map :: (a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  map<U>(fn: (value: V) => U): OrderedMap<K, U> {
    return OrderedMap.of(new Map([...this.value].map(([k, x]) =>
      [k, fn(x)] as [K, U]
    )));
  }

  /**
   * `mapWithKey :: (k -> a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  mapWithKey<U>(fn: (key: K) => (value: V) => U): OrderedMap<K, U> {
    return OrderedMap.of(new Map([...this.value].map(([k, x]) =>
      [k, fn(k)(x)] as [K, U]
    )));
  }

  // FOLDS

  /**
   * `foldl :: (a -> b -> a) -> a -> Map k b -> a`
   *
   * Fold the values in the map using the given left-associative binary
   * operator, such that `foldl f z == foldl f z . elems`.
   */
  foldl<U extends Some>(fn: (acc: U) => (current: V) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: V) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: V) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (fn: (acc: U) => (current: V) => U) => (initial: U) =>
      [...this.value].reduce<U>((acc, [_, value]) => fn(acc)(value), initial);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  // CONVERSION

  /**
   * `elems :: Map k a -> [a]`
   *
   * Return all elements of the map.
   */
  elems(): List<V> {
    return List.of(...this.value.values());
  }

  /**
   * `keys :: Map k a -> [k]`
   *
   * Return all keys of the map.
   */
  keys(): List<K> {
    return List.of(...this.value.keys());
  }

  /**
   * `assocs :: Map k a -> [(k, a)]`
   *
   * Return all key/value pairs in the map.
   */
  assocs(): List<Tuple<K, V>> {
    return List.of(
      ...[...this.value].map(([key, value]) => new Tuple(key, value))
    );
  }

  // FILTER

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  filter<U extends V>(pred: (value: V) => value is U): OrderedMap<K, U>;
  filter(pred: (value: V) => boolean): OrderedMap<K, V>;
  filter(pred: (value: V) => boolean): OrderedMap<K, V> {
    return OrderedMap.of([...this.value].filter(([_, value]) => pred(value)));
  }

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  filterWithKey<U extends V>(
    pred: (key: K) => (value: V) => value is U
  ): OrderedMap<K, U>;
  filterWithKey(pred: (key: K) => (value: V) => boolean): OrderedMap<K, V>;
  filterWithKey(pred: (key: K) => (value: V) => boolean): OrderedMap<K, V> {
    return OrderedMap.of([...this.value].filter(([key, value]) => pred(key)(value)));
  }

  static of<K, V>(
    map: ReadonlyMap<K, V> | [K, V][] | List<Tuple<K, V>>
  ): OrderedMap<K, V> {
    return new OrderedMap(map);
  }

  /**
   * `empty :: Map k a`
   *
   * The empty map.
   */
  static empty<K, V>(): OrderedMap<K, V> {
    return new OrderedMap();
  }

  /**
   * `singleton :: k -> a -> Map k a`
   *
   * A map with a single element.
   */
  static singleton<K, V>(key: K): (value: V) => OrderedMap<K, V>;
  static singleton<K, V>(key: K, value: V): OrderedMap<K, V>;
  static singleton<K, V>(
    key: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>) {
    if (arguments.length === 2) {
      return new OrderedMap([[key, value as V]]);
    }
    else {
      return value => new OrderedMap([[key, value]]);
    }
  }

  static toList<K, V>(map: OrderedMap<K, V>): List<Tuple<K, V>> {
    return List.of(
      ...[...map.value].map(([key, value]) => new Tuple(key, value))
    );
  }

  static toValueList<K, V>(map: OrderedMap<K, V>): List<V> {
    return List.of(...[...map.value.values()]);
  }

  // INSTANCE METHODS AS STATIC FUNCTIONS

  /**
   * `lookup :: Ord k => k -> Map k a -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   */
  static lookup<K, V>(key: K): (m: OrderedMap<K, V>) => Maybe<V>;
  static lookup<K, V>(key: K, m: OrderedMap<K, V>): Maybe<V>;
  static lookup<K, V>(
    key: K, m?: OrderedMap<K, V>
  ): Maybe<V> | ((m: OrderedMap<K, V>) => Maybe<V>) {
    const resultFn = (key: K, m: OrderedMap<K, V>) => m.lookup(key);

    if (arguments.length === 2) {
      return resultFn(key, m!);
    }
    else {
      return m => resultFn(key, m);
    }
  }
}

export class OrderedSet<T> implements Al.Functor<T>, Al.Foldable<T>,
  Al.Filterable<T> {
  private readonly value: ReadonlySet<T>;

  constructor(initial?: ReadonlySet<T> | T[] | List<T>) {
    if (initial instanceof Set) {
      this.value = initial;
    }
    else if (initial instanceof List) {
      this.value = new Set(List.toArray(initial));
    }
    else if (initial !== undefined) {
      this.value = new Set(initial);
    }
    else {
      this.value = new Set();
    }
  }

  // QUERY

  /**
   * `null :: Set a -> Bool`
   *
   * Is this the empty set?
   */
  null(): boolean {
    return this.value.size === 0;
  }

  /**
   * `size :: Set a -> Int`
   *
   * The number of elements in the set.
   */
  size(): number {
    return this.value.size;
  }

  /**
   * `member :: Ord a => a -> Set a -> Bool`
   *
   * Is the element in the set?
   */
  member(value: T): boolean {
    return this.value.has(value);
  }

  /**
   * `notMember :: Ord k => k -> Set a -> Bool`
   *
   * Is the element not in the set?
   */
  notMember(value: T): boolean {
    return !this.member(value);
  }

  // CONSTRUCTION

  /**
   * `insert :: Ord a => a -> Set a -> Set a`
   *
   * Insert an element in a set. If the set already contains an element equal to
   * the given value, it is replaced with the new value.
   */
  insert(value: T): OrderedSet<T> {
    return OrderedSet.of([...this.value, value]);
  }

  /**
   * `delete :: Ord a => a -> Set a -> Set a`
   *
   * Delete an element from a set.
   */
  delete(value: T): OrderedSet<T> {
    return OrderedSet.of([...this.value].filter(e => e !== value));
  }

  // COMBINE

  /**
   * `union :: Ord a => Set a -> Set a -> Set a`
   *
   * The union of two sets, preferring the first set when equal elements are
   * encountered.
   */
  union(add: OrderedSet<T>) {
    return OrderedSet.of([...this.value, ...add.value]);
  }

  // FILTER

  /**
   * `filter :: (a -> Bool) -> Set a -> Set a`
   *
   * Filter all values that satisfy the predicate.
   */
  filter<U extends T>(pred: (value: T) => value is U): OrderedSet<U>;
  filter(pred: (value: T) => boolean): OrderedSet<T>;
  filter(pred: (value: T) => boolean): OrderedSet<T> {
    return OrderedSet.of([...this.value].filter(pred));
  }

  // MAP

  /**
   * `map :: Ord b => (a -> b) -> Set a -> Set b`
   *
   * `map f s` is the set obtained by applying `f` to each element of `s`.
   *
   * It's worth noting that the size of the result may be smaller if, for some
   * `(x,y), x /= y && f x == f y`.
   */
  map<U>(fn: (value: T) => U): OrderedSet<U> {
    return OrderedSet.of([...this.value].map(fn));
  }

  // FOLDS

  /**
   * `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
   *
   * Fold the elements in the set using the given left-associative binary
   * operator, such that `foldl f z == foldl f z . toAscList`.
   */
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (fn: (acc: U) => (current: T) => U) => (initial: U) =>
      [...this.value].reduce<U>((acc, e) => fn(acc)(e), initial);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  // CONVERSION LIST

  /**
   * `elems :: Set a -> [a]`
   *
   * An alias of toAscList. The elements of a set in ascending order. Subject to
   * list fusion.
   */
  elems(): List<T> {
    return List.of(...this.value);
  }

  static of<T>(set: ReadonlySet<T> | T[] | List<T>): OrderedSet<T> {
    return new OrderedSet(set);
  }

  /**
   * `empty :: Set a`
   *
   * The empty set.
   */
  static empty<T>(): OrderedSet<T> {
    return new OrderedSet();
  }

  /**
   * `singleton :: a -> Set a`
   *
   * Create a singleton set.
   */
  static singleton<T>(value: T): OrderedSet<T> {
    return new OrderedSet([value]);
  }
}

export type RecordKey<K extends keyof T, T> =
  T[K] extends NonNullable<T[K]> ? Just<T[K]> : Maybe<NonNullable<T[K]>>;

export type RecordMaybe<T> = {
  [P in keyof T]: T[P] extends Maybe<infer M> ? M | undefined : T[P];
};

export type RecordOnlySafe<T> = {
  [P in keyof T]: T[P] extends NonNullable<T[P]> ? T[P] : void;
};

export class Record<T extends { [key: string]: any }> {
  private readonly value: T;

  constructor(initial: T = {} as T) {
    this.value = initial;
  }

  /**
   * `lookup :: String -> a -> Maybe a[String]`
   */
  lookup<K extends keyof T>(key: K): RecordKey<K, T> {
    return Maybe.of(this.value[key]) as RecordKey<K, T>;
  }

  /**
   * `lookupWithDefault :: a[String] -> a -> String -> Record a -> a[String]`
   */
  lookupWithDefault<K extends keyof T>(
    def: NonNullable<T[K]>
  ): (key: K) => NonNullable<T[K]>;
  lookupWithDefault<K extends keyof T>(
    def: NonNullable<T[K]>, key: K
  ): NonNullable<T[K]>;
  lookupWithDefault<K extends keyof T>(
    def: NonNullable<T[K]>, key?: K
  ): NonNullable<T[K]> | ((key: K) => NonNullable<T[K]>) {
    if (arguments.length === 2) {
      return Maybe.fromMaybe(def)(this.lookup(key!));
    }

    return (key: K) => Maybe.fromMaybe(def)(this.lookup(key));
  }

  /**
   * `get :: String -> a -> a[String]`
   *
   * Only use for NonNullable properties, use `lookup` otherwise.
   */
  get<K extends keyof RecordOnlySafe<T>>(key: K): RecordOnlySafe<T>[K] {
    return this.value[key];
  }

  /**
   * `member :: String -> a -> Bool`
   */
  member(key: string): boolean {
    return this.value.hasOwnProperty(key);
  }

  /**
   * `insert :: keyof a -> a[keyof a] -> Record a -> Record a`
   */
  insert<K extends keyof T>(key: K): (value: T[K]) => Record<T>;
  insert<K extends keyof T>(key: K, value: T[K]): Record<T>;
  insert<K extends keyof T>(
    key: K, value?: T[K]
  ): Record<T> | ((value: T[K]) => Record<T>) {
    if (arguments.length === 2) {
      return Record.of({ ...(this.value as any), [key]: value });
    }
    else {
      return value => Record.of({ ...(this.value as any), [key]: value });
    }
  }

  /**
   * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
   */
  update<K extends keyof T>(
    fn: (value: T[K]) => Maybe<NonNullable<T[K]>>
  ): (key: K) => Record<T>;
  update<K extends keyof T>(
    fn: (value: T[K]) => Maybe<NonNullable<T[K]>>, key: K
  ): Record<T>;
  update<K extends keyof T>(
    fn: (value: T[K]) => Maybe<NonNullable<T[K]>>,
    key?: K
  ): Record<T> | ((key: K) => Record<T>) {
    const resultFn = (
      fn: (value: T[K]) => Maybe<NonNullable<T[K]>>, key: K
    ) => {
      const entry = this.lookup(key);
      if (Maybe.isJust(entry)) {
        const res = fn(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return Record.of({
            ...(this.value as any),
            [key]: Maybe.fromJust(res)
          });
        }
        else {
          const { [key]: _, ...other } = (this.value as any);
          return Record.of(other);
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (key: K) => resultFn(fn, key);
    }
  }

  /**
   * `alter :: (Maybe a[String] -> Maybe a[String]) -> String -> a ->
   * Maybe a[String]`
   */
  alter<K extends keyof T>(
    fn: (value: RecordKey<K, T>) => RecordKey<K, T>
  ): (key: K) => Record<T>;
  alter<K extends keyof T>(
    fn: (value: RecordKey<K, T>) => RecordKey<K, T>,
    key: K
  ): Record<T>;
  alter<K extends keyof T>(
    fn: (value: RecordKey<K, T>) => RecordKey<K, T>,
    key?: K
  ): Record<T> | ((key: K) => Record<T>) {
    const resultFn = (
      fn: (value: RecordKey<K, T>) => RecordKey<K, T>,
      key: K
    ): Record<T> => {
      const { [key]: _, ...other } = this.value as any;
      const res = fn(this.lookup(key));

      if (Maybe.isJust(res)) {
        return Record.of({
          ...other,
          [key]: Maybe.fromJust(res)
        } as T);
      }
      else {
        return Record.of(other as T);
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return key => resultFn(fn, key);
    }
  }

  merge<U>(record: Record<U>): Record<T & U> {
    return Record.of({ ...(this.value as any), ...(record.value as any) });
  }

  mergeMaybe<U>(record: Record<U>): Record<T & RecordMaybe<U>> {
    return Record.of(Object.entries(record.value).reduce(
      (acc, [key, value]) => {
        if (value instanceof Maybe) {
          if (Maybe.isJust(value)) {
            return {
              ...acc,
              [key]: Maybe.fromJust(value),
            };
          }
          else {
            const { [key]: _, ...other } = acc;
            return other;
          }
        }
        else {
          return {
            ...acc,
            [key]: value,
          };
        }
      },
      { ...(this.value as any) }
    ));
  }

  equals(second: Record<T>): boolean {
    return R.equals(this.value, second.value);
  }

  static of<T>(initial: T): Record<T> {
    return new Record(initial);
  }
}

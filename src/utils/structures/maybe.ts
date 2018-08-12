import R from 'ramda';
import * as Al from '../../types/algebraic';
import { List } from './list';

// tslint:disable-next-line:interface-over-type-literal
export type Some = {};
export type Nullable = null | undefined;

export const isSome = <T>(e: T): e is NonNullable<T> => e !== null && e !== undefined;

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
export class Maybe<T extends Some> implements Al.Functor<T>, Al.Applicative<T>,
  Al.Monad<T>, Al.Foldable<T>, Al.Setoid<T>, Al.Ord<T>, Al.Semigroup<T> {
  private readonly value: T | undefined;

  private constructor(value: T | Nullable) {
    // tslint:disable-next-line:triple-equals no-null-keyword
    this.value = value != null ? value : undefined;
  }

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  equals(x: Maybe<T>): boolean {
    return R.equals((this as Maybe<T>).value, x.value);
  }

  /**
   * `(!=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are not equal.
   */
  notEquals(x: Maybe<T>): boolean {
    return !this.equals(x);
  }

  /**
   * `(>) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than the second value.
   *
   * If one of the values is `Nothing`, `(>)` always returns false.
   */
  gt<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, this.bind(x1 => comp.fmap(x2 => x1 > x2)));
  }

  /**
   * `(<) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than the second value.
   *
   * If one of the values is `Nothing`, `(<)` always returns false.
   */
  lt<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, this.bind(x1 => comp.fmap(x2 => x1 < x2)));
  }

  /**
   * `(>=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than or equals the second
   * value.
   *
   * If one of the values is `Nothing`, `(>=)` always returns false.
   */
  gte<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, this.bind(x1 => comp.fmap(x2 => x1 >= x2)));
  }

  /**
   * `(<=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than or equals the second
   * value.
   *
   * If one of the values is `Nothing`, `(<=)` always returns false.
   */
  lte<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, this.bind(x1 => comp.fmap(x2 => x1 <= x2)));
  }

  fmap<U extends Some>(fn: (value: T) => U): Maybe<U> {
    return this.value !== undefined ? Maybe.of(fn(this.value)) : this as any;
  }

  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value !== undefined ? fn(this.value) : this as any;
  }

  sequence<U extends Some>(x: Maybe<U>): Maybe<U> {
    return this.value !== undefined ? x : this as any;
  }

  /**
   * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
   */
  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U> {
    return this.value !== undefined ? m.fmap(fn => fn(this.value!)) : this as any;
  }

  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (x1: (acc: U) => (current: T) => U) => (x2: U) =>
      this.value !== undefined ? x1(x2!)(this.value) : x2;

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
  concat<X, U extends Al.Semigroup<X>>(this: Maybe<U>, m: Maybe<U>): Maybe<U> {
    return this.value !== undefined && m.value !== undefined
      ? Maybe.of(this.value.concat(m.value) as U)
      : this;
  }

  /**
   * `alt :: Maybe m => m a -> m a -> m a`
   *
   * The `alt` function takes a `Maybe` of the same type. If `this` is
   * `Nothing`, it returns the passed `Maybe`, otherwise it returns `this`.
   */
  alt(m: Maybe<T>): Maybe<T> {
    return this.value !== undefined ? this : m;
  }

  /**
   * `toString :: Maybe m => m a -> String`
   */
  toString(): string {
    return this.value !== undefined ? `Just(${R.toString(this.value)})` : `Nothing`;
  }

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are shallowly equal. Used only for selector
   * memoization.
   *
   * @internal
   */
  UNSAFE_shallowEquals(x: Maybe<T>): boolean {
    return (this as Maybe<T>).value === x.value;
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
   * `return :: a -> Maybe a`
   *
   * Inject a value into a `Maybe` type.
   */
  static return<T extends Some>(value: T | Nullable): Maybe<T> {
    return new Maybe(value);
  }

  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some, O extends T>(
    pred: (value: T) => value is O
  ): (value: T | Nullable) => Maybe<O>;
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some>(
    pred: (value: T) => boolean
  ): (value: T | Nullable) => Maybe<T>;
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some, O extends T>(
    pred: (value: T) => value is O,
    value: T | Nullable,
  ): Maybe<O>;
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some>(
    pred: (value: T) => boolean,
    value: T | Nullable,
  ): Maybe<T>;
  static ensure<T extends Some>(
    pred: (value: T) => boolean,
    value?: T | Nullable,
  ): ((value: T | Nullable) => Maybe<T>) | Maybe<T> {
    const curriedReturn = (x: T | Nullable) => Maybe.of(x).bind<T>(
      someX => pred(someX) ? Maybe.Just(someX) : Maybe.Nothing()
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
  /**
   * `maybe :: b -> (a -> b) -> Maybe a -> b`
   *
   * The `maybe` function takes a default value, a function, and a `Maybe`
   * value. If the `Maybe` value is `Nothing`, the function returns the default
   * value. Otherwise, it applies the function to the value inside the `Just`
   * and returns the result.
   */
  static maybe<T extends Some, U extends Some>(
    def: U, fn: (x: T) => U
  ): (m: Maybe<T>) => U;
  /**
   * `maybe :: b -> (a -> b) -> Maybe a -> b`
   *
   * The `maybe` function takes a default value, a function, and a `Maybe`
   * value. If the `Maybe` value is `Nothing`, the function returns the default
   * value. Otherwise, it applies the function to the value inside the `Just`
   * and returns the result.
   */
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
      return (x3: Maybe<T>) => x3.foldl(() => fn!, def);
    }
    else {
      return (x2: (x: T) => U) =>
        (x3: Maybe<T>) =>
          x3.foldl(() => x2, def);
    }
  }

  /**
   * `isJust :: Maybe a -> Bool`
   *
   * The `isJust` function returns `true` if its argument is of the form
   * `Just _`.
   */
  static isJust<T extends Some>(x: Maybe<T>): x is Just<T> {
    return x.value !== undefined;
  }

  /**
   * `isNothing :: Maybe a -> Bool`
   *
   * The `isNothing` function returns `true` if its argument is `Nothing`.
   */
  static isNothing<T extends Some>(x: Maybe<T>): x is Nothing {
    return x.value === undefined;
  }

  /**
   * `fromJust :: Maybe a -> a`
   *
   * The `fromJust` function extracts the element out of a `Just` and throws an
   * error if its argument is `Nothing`.
   *
   * @throws TypeError
   */
  static fromJust<T extends Some>(m: Just<T>): T {
    if (Maybe.isJust(m)) {
      return m.value as T;
    }

    throw new TypeError(`Cannot extract a value out of type Nothing.`);
  }

  /**
   * `fromMaybe :: a -> Maybe a -> a`
   *
   * The `fromMaybe` function takes a default value and and `Maybe` value. If
   * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
   * returns the value contained in the `Maybe`.
   */
  static fromMaybe<T extends Some>(def: T): (m: Maybe<T>) => T;
  /**
   * `fromMaybe :: a -> Maybe a -> a`
   *
   * The `fromMaybe` function takes a default value and and `Maybe` value. If
   * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
   * returns the value contained in the `Maybe`.
   */
  static fromMaybe<T extends Some>(def: T, m: Maybe<T>): T;
  static fromMaybe<T extends Some>(
    def: T, m?: Maybe<T>
  ): T | ((m: Maybe<T>) => T) {
    if (arguments.length === 2 && m !== undefined) {
      return Maybe.isJust(m) ? m.value as T : def;
    }

    return x2 => Maybe.isJust(x2) ? x2.value as T : def;
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
    return Maybe.isJust(m) ? List.of(m.value as T) : List.of();
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
    list: List<T>,
  ): List<U>;
  static mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list?: List<T>,
  ): List<U> | ((list: List<T>) => List<U>) {
    const resultFn = (x1: (x: T) => Maybe<U>, x2: List<T>): List<U> =>
      x2.foldl<List<U>>(
        acc => x => {
          const result = x1(x);

          if (Maybe.isJust(result)) {
            return acc.append(Maybe.fromJust(result));
          }
          else {
            return acc;
          }
        },
        List.of()
      );

    if (arguments.length === 1) {
      return x2 => resultFn(fn, x2);
    }

    return resultFn(fn, list!);
  }

  /**
   * `Just :: a -> Just a`
   */
  static Just<T extends Some>(value: T): Just<T> {
    return Maybe.return(value) as Just<T>;
  }

  /**
   * `Nothing :: () -> Nothing`
   */
  static Nothing(): Nothing {
    return Maybe.return(undefined) as Nothing;
  }

  // INSTANCE METHODS AS STATIC FUNCTIONS

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  static equals<T extends Some>(m1: Maybe<T>): (m2: Maybe<T>) => boolean;
  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  static equals<T extends Some>(m1: Maybe<T>, m2: Maybe<T>): boolean;
  static equals<T extends Some>(
    m1: Maybe<T>, m2?: Maybe<T>
  ): boolean | ((m2: Maybe<T>) => boolean) {
    const resultFn = (x1: Maybe<T>, x2: Maybe<T>) => x1.equals(x2);

    if (arguments.length === 2) {
      return resultFn(m1, m2!);
    }
    else {
      return x2 => resultFn(m1, x2);
    }
  }

  /**
   * `fmap :: (a -> b) -> Maybe a -> Maybe b`
   */
  static fmap<T extends Some, U extends Some>(
    fn: (value: T) => U
  ): (m: Maybe<T>) => Maybe<U>;
  /**
   * `fmap :: (a -> b) -> Maybe a -> Maybe b`
   */
  static fmap<T extends Some, U extends Some>(
    fn: (value: T) => U, m: Maybe<T>
  ): Maybe<U>;
  static fmap<T extends Some, U extends Some>(
    fn: (value: T) => U, m?: Maybe<T>
  ): Maybe<U> | ((m: Maybe<T>) => Maybe<U>) {
    const resultFn = (x1: (value: T) => U, x2: Maybe<T>) => x2.fmap(x1);

    if (arguments.length === 2) {
      return resultFn(fn, m!);
    }
    else {
      return x2 => resultFn(fn, x2);
    }
  }

  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  static bind<T extends Some, U extends Some>(
    m: Maybe<T>
  ): (f: (value: T) => Maybe<U>) => Maybe<U>;
  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  static bind<T extends Some, U extends Some>(
    m: Maybe<T>, f: (value: T) => Maybe<U>
  ): Maybe<U>;
  static bind<T extends Some, U extends Some>(
    m: Maybe<T>, f?: (value: T) => Maybe<U>
  ): Maybe<U> | ((f: (value: T) => Maybe<U>) => Maybe<U>) {
    const resultFn = (x1: Maybe<T>, x2: (value: T) => Maybe<U>) => x1.bind(x2);

    if (arguments.length === 2) {
      return resultFn(m, f!);
    }
    else {
      return x2 => resultFn(m, x2);
    }
  }
}

export const Just = <T extends Some>(value: T): Just<T> => Maybe.Just(value);
export const Nothing = (): Nothing => Maybe.Nothing();

export interface Just<T extends Some> extends Maybe<T> {
  fmap<U extends Some>(fn: (value: T) => U): Just<U>;
  bind<U extends Some>(fn: (value: T) => Nothing): Nothing;
  bind<U extends Some>(fn: (value: T) => Just<U>): Just<U>;
  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U>;
  ap<U extends Some>(m: Just<((value: T) => U)>): Just<U>;
  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U>;
  concat<X, U extends Al.Semigroup<X>>(this: Just<U>, m: Maybe<U>): Just<U>;
  alt(): Just<T>;
}

export interface Nothing extends Maybe<never> {
  fmap(): Nothing;
  bind(): Nothing;
  ap(): Nothing;
  concat<X, U extends Al.Semigroup<X>>(this: Nothing, m: Maybe<U>): Nothing;
  alt<T>(m: Maybe<T>): Maybe<T>;
}

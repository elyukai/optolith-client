/**
 * This is a TEST and WIP file only! Please do not use! Use maybe.ts instead.
 */

import R from 'ramda';
import * as Al from '../../types/algebraic.d';
import { List } from './list';

// tslint:disable-next-line:interface-over-type-literal
export type Some = {};
export type Nullable = null | undefined;

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
interface Maybe<T extends Some> extends Al.Functor<T>, Al.Apply<T>,
  Al.Bind<T>, Al.Foldable<T>, Al.Setoid<T>, Al.Ord<T>, Al.Semigroup<T> {
  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  equals(x: Maybe<T>): boolean;

  /**
   * `(!=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are not equal.
   */
  notEquals(x: Maybe<T>): boolean;

  /**
   * `(>) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than the second value.
   */
  gt<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean;

  /**
   * `(<) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than the second value.
   */
  lt<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean;

  /**
   * `(>=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than or equals the second
   * value.
   */
  gte<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean;

  /**
   * `(<=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than or equals the second
   * value.
   */
  lte<U extends number | string>(this: Maybe<U>, comp: Maybe<U>): boolean;

  /**
   * `map :: (a -> b) -> Maybe a -> Maybe b`
   */
  map<U extends Some>(fn: (value: T) => U): Maybe<U>;

  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U>;

  /**
   * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
   */
  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U>;

  /**
   * `foldl :: (b -> a -> b) -> b -> Maybe a -> b`
   */
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U);

  /**
   * `concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
   *
   * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
   * type `Just a`. If at least one of them is `Nothing`, it returns the first
   * element.
   */
  concat<X, U extends Al.Semigroup<X>>(this: Maybe<U>, m: Maybe<U>): Maybe<U>;

  /**
   * `alt :: Maybe m => m a -> m a -> m a`
   *
   * The `alt` function takes a `Maybe` of the same type. If `this` is
   * `Nothing`, it returns the passed `Maybe`, otherwise it returns `this`.
   */
  alt(m: Maybe<T>): Maybe<T>;

  /**
   * `toString :: Maybe m => m a -> String`
   */
  toString(): string;
}

interface MaybeConstructor extends Al.Applicative {
  /**
   * `of :: a -> Maybe a`
   *
   * Creates a new `Maybe` from the given value.
   */
  of<T extends Some>(value: T | Nullable): Maybe<T>;

  /**
   * `ofPred :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  ensure<T extends Some, O extends T>(
    pred: (value: T) => value is O
  ): (value: T | Nullable) => Maybe<O>;
  ensure<T extends Some>(
    pred: (value: T) => boolean
  ): (value: T | Nullable) => Maybe<T>;
  ensure<T extends Some, O extends T>(
    pred: (value: T) => value is O,
    value: T | Nullable,
  ): Maybe<O>;
  ensure<T extends Some>(
    pred: (value: T) => boolean,
    value: T | Nullable,
  ): Maybe<T>;
  ensure<T extends Some>(
    pred: (value: T) => boolean,
    value?: T | Nullable,
  ): ((value: T | Nullable) => Maybe<T>) | Maybe<T>;

  /**
   * `maybe :: b -> (a -> b) -> Maybe a -> b`
   *
   * The `maybe` function takes a default value, a function, and a `Maybe`
   * value. If the `Maybe` value is `Nothing`, the function returns the default
   * value. Otherwise, it applies the function to the value inside the `Just`
   * and returns the result.
   */
  maybe<T extends Some, U extends Some>(
    def: U
  ): (fn: (x: T) => U) => (m: Maybe<T>) => U;
  maybe<T extends Some, U extends Some>(
    def: U, fn: (x: T) => U
  ): (m: Maybe<T>) => U;
  maybe<T extends Some, U extends Some>(
    def: U, fn: (x: T) => U, m: Maybe<T>
  ): U;
  maybe<T extends Some, U extends Some>(
    def: U, fn?: (x: T) => U, m?: Maybe<T>,
  ): U | ((m: Maybe<T>) => U) | ((fn: (x: T) => U) => (m: Maybe<T>) => U);

  /**
   * `isJust :: Maybe a -> Bool`
   *
   * The `isJust` function returns `true` if its argument is of the form
   * `Just _`.
   */
  isJust<T extends Some>(x: Maybe<T>): x is Just<T>;

  /**
   * `isNothing :: Maybe a -> Bool`
   *
   * The `isNothing` function returns `true` if its argument is `Nothing`.
   */
  isNothing<T extends Some>(x: Maybe<T>): x is Nothing;

  /**
   * `fromJust :: Maybe a -> a`
   *
   * The `fromJust` function extracts the element out of a `Just` and throws an
   * error if its argument is `Nothing`.
   *
   * @throws TypeError
   */
  fromJust<T extends Some>(m: Just<T>): T;

  /**
   * `fromMaybe :: a -> Maybe a -> a`
   *
   * The `fromMaybe` function takes a default value and and `Maybe` value. If
   * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
   * returns the value contained in the `Maybe`.
   */
  fromMaybe<T extends Some>(def: T): (m: Maybe<T>) => T;
  fromMaybe<T extends Some>(def: T, m: Maybe<T>): T;
  fromMaybe<T extends Some>(
    def: T, m?: Maybe<T>
  ): T | ((m: Maybe<T>) => T);

  /**
   * `listToMaybe :: [a] -> Maybe a`
   *
   * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
   * where `a` is the first element of the list.
   */
  listToMaybe<T extends Some>(list: List<T>): Maybe<T>;

  /**
   * `maybeToList :: Maybe a -> [a]`
   *
   * The `maybeToList` function returns an empty list when given `Nothing` or a
   * singleton list when not given `Nothing`.
   */
  maybeToList<T extends Some>(m: Maybe<T>): List<T>;

  /**
   * `catMaybes :: [Maybe a] -> [a]`
   *
   * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
   * the `Just` values.
   */
  catMaybes<T extends Some>(list: List<Maybe<T>>): List<T>;

  /**
   * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
   *
   * The `mapMaybe` function is a version of `map` which can throw out elements.
   * If particular, the functional argument returns something of type `Maybe b`.
   * If this is `Nothing`, no element is added on to the result list. If it is
   * `Just b`, then `b` is included in the result list.
   */
  mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
  ): (list: List<T>) => List<U>;
  mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list: List<T>,
  ): List<U>;
  mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list?: List<T>,
  ): List<U> | ((list: List<T>) => List<U>);

  /**
   * `Just :: a -> Just a`
   */
  Just<T extends Some>(value: T): Just<T>;

  /**
   * `Nothing :: () -> Nothing`
   */
  Nothing(): Nothing;

  // INSTANCE METHODS AS STATIC FUNCTIONS

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  equals<T extends Some>(m1: Maybe<T>): (m2: Maybe<T>) => boolean;
  equals<T extends Some>(m1: Maybe<T>, m2: Maybe<T>): boolean;
  equals<T extends Some>(
    m1: Maybe<T>, m2?: Maybe<T>
  ): boolean | ((m2: Maybe<T>) => boolean);

  /**
   * `map :: (a -> b) -> Maybe a -> Maybe b`
   */
  map<T extends Some, U extends Some>(
    fn: (value: T) => U
  ): (m: Maybe<T>) => Maybe<U>;
  map<T extends Some, U extends Some>(
    fn: (value: T) => U, m: Maybe<T>
  ): Maybe<U>;
  map<T extends Some, U extends Some>(
    fn: (value: T) => U, m?: Maybe<T>
  ): Maybe<U> | ((m: Maybe<T>) => Maybe<U>);
}

export type Just<T extends Some> = JustConstructor<T>;
export type Nothing = NothingConstructor;

const NothingInstance = new NothingConstructor();
export const Just = <T extends Some>(x: T): Just<T> => new JustConstructor(x);
export const Nothing = (): Nothing => NothingInstance;

export const isSome = <T>(e: T): e is NonNullable<T> => e !== null || e !== undefined;

export const Maybe = {
  of<T extends Some>(value: T | Nullable): Maybe<T> {
    return isSome(value) ? Just(value) : Nothing();
  },

  ensure<T extends Some>(
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
  },

  maybe<T extends Some, U extends Some>(
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
  },

  isJust<T extends Some>(x: Maybe<T>): x is Just<T> {
    return x !== NothingInstance;
  },

  isNothing<T extends Some>(x: Maybe<T>): x is Nothing {
    return x === NothingInstance;
  },

  fromJust<T extends Some>(m: Just<T>): T {
    if (Maybe.isJust(m)) {
      return m.value;
    }

    throw new TypeError(`Cannot extract a value out of type Nothing.`);
  },

  fromMaybe<T extends Some>(
    def: T, m?: Maybe<T>
  ): T | ((m: Maybe<T>) => T) {
    if (arguments.length === 2 && m !== undefined) {
      return Maybe.isJust(m) ? Maybe.fromJust(m) : def;
    }

    return x2 => Maybe.isJust(x2) ? Maybe.fromJust(x2) : def;
  },

  listToMaybe<T extends Some>(list: List<T>): Maybe<T> {
    return list.length() === 0 ? Maybe.Nothing() : list.head();
  },

  maybeToList<T extends Some>(m: Maybe<T>): List<T> {
    return Maybe.isJust(m) ? List.of(m.value) : new List();
  },

  catMaybes<T extends Some>(
    list: List<Maybe<T>>
  ): List<T> {
    return list.filter(Maybe.isJust).map(e => e.value);
  },

  mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list?: List<T>,
  ): List<U> | ((list: List<T>) => List<U>) {
    if (list === undefined) {
      return x2 => x2.map(fn).filter(Maybe.isJust).map(e => e.value);
    }

    return list.map(fn).filter(Maybe.isJust).map(e => e.value);
  },

  Just<T extends Some>(value: T): Just<T> {
    return Just(value);
  },

  Nothing(): Nothing {
    return Nothing();
  },

  // INSTANCE METHODS AS STATIC FUNCTIONS

  equals<T extends Some>(
    m1: Maybe<T>, m2?: Maybe<T>
  ): boolean | ((m2: Maybe<T>) => boolean) {
    const resultFn = (x1: Maybe<T>, x2: Maybe<T>) => x1.equals(x2);

    if (arguments.length === 2) {
      return resultFn(m1, m2!);
    }
    else {
      return x2 => resultFn(m1, x2);
    }
  },

  map<T extends Some, U extends Some>(
    fn: (value: T) => U, m?: Maybe<T>
  ): Maybe<U> | ((m: Maybe<T>) => Maybe<U>) {
    const resultFn = (x1: (value: T) => U, x2: Maybe<T>) => x2.map(x1);

    if (arguments.length === 2) {
      return resultFn(fn, m!);
    }
    else {
      return x2 => resultFn(fn, x2);
    }
  }
} as any as MaybeConstructor;

class JustConstructor<T extends Some> implements Maybe<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  equals(x: Maybe<T>): boolean {
    return x instanceof JustConstructor && R.equals(this.value, x.value);
  }

  notEquals(x: Maybe<T>): boolean {
    return !this.equals(x);
  }

  gt<U extends number | string>(this: Just<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, comp.map(x2 => this.value > x2));
  }

  lt<U extends number | string>(this: Just<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, comp.map(x2 => this.value < x2));
  }

  gte<U extends number | string>(this: Just<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, comp.map(x2 => this.value >= x2));
  }

  lte<U extends number | string>(this: Just<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe(false, comp.map(x2 => this.value <= x2));
  }

  map<U extends Some>(fn: (value: T) => U): Just<U> {
    return new JustConstructor(fn(this.value));
  }

  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return fn(this.value);
  }

  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U> {
    return m.map(fn => fn(this.value));
  }

  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (x1: (acc: U) => (current: T) => U) => (x2: U) =>
      x1(x2!)(this.value);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  concat<X, U extends Al.Semigroup<X>>(this: Just<U>, m: Maybe<U>): Just<U> {
    return m instanceof JustConstructor
      ? new JustConstructor(this.value.concat(m.value) as U)
      : this;
  }

  alt(): Just<T> {
    return this;
  }

  toString(): string {
    return `Just(${this.value})`;
  }
}

class NothingConstructor implements Maybe<never> {
  equals = (x: Maybe<any>): boolean => Maybe.isNothing(x);

  notEquals(x: Maybe<any>): boolean {
    return !this.equals(x);
  }

  gt = (): false => false;
  lt = (): false => false;
  gte = (): false => false;
  lte = (): false => false;

  map(): Nothing {
    return this;
  }

  bind(): Nothing {
    return this;
  }

  ap(): Nothing {
    return this;
  }

  foldl = <T extends Some, U extends Some>(
    _fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) => {
    if (arguments.length === 2) {
      return initial!;
    }

    return x2 => x2;
  };

  concat(): Nothing {
    return this;
  }

  alt = <T extends Some, M extends Maybe<T>>(m: M): M => m;
  toString = (): string => `Nothing`;
}

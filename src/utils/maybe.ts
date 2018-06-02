export type Some = {};

export interface Functor<T> {
  map<U>(fn: (t: T) => U): Functor<U>;
}

export interface Monad<T> {
  bind<U>(fn: (t: T) => Monad<U>): Monad<U>;
}

export interface MaybeFunctor<T extends Some> extends Functor<T>, Monad<T> {
  /**
   * `map :: Maybe m => (a -> b) -> m b`
   */
  map<U extends Some>(fn: (value: T) => U): Maybe<U>;
  /**
   * `bind :: Maybe m => (a -> m b) -> m b`
   */
  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U>;
  /**
   * `ap :: Maybe m => m (a -> m b) -> m b`
   */
  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U>;
  /**
   * `valueOr :: a -> a | b`
   */
  valueOr<U>(or: U): T | U;
  /**
   * `reduce :: ((a, b) -> a) -> a`
   */
  reduce<U extends Some>(fn: (acc: U, current: T) => U, acc: U): U;
  /**
   * `toString :: () -> String`
   */
  toString(): string;
}

export interface Just<T extends Some> extends MaybeFunctor<T> {
  readonly value: T;
  map<U extends Some>(fn: (value: T) => U | undefined): Maybe<U>;
  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U>
  valueOr(): T;
}

export interface Nothing extends MaybeFunctor<never> {
  readonly value: undefined;
  map(): Maybe<never>;
  bind(): Maybe<never>;
  valueOr<U>(or: U): U;
}

/**
 * The Maybe type allows the programmer to specify something may not be there.
 */
export class Maybe<T extends Some> implements MaybeFunctor<T> {
  readonly value: T | undefined;

  constructor(value: T | undefined) {
    this.value = value;
  }

  map<U extends Some>(fn: (value: T) => U | undefined): Maybe<U> {
    return this.value == null ? Maybe.Nothing() : new Maybe(fn(this.value));
  }

  bind<U extends Some>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value == null ? Maybe.Nothing() : fn(this.value);
  }

  ap<U extends Some>(m: Maybe<((value: T) => U)>): Maybe<U> {
    return this.value == null ? Maybe.Nothing() : m.map(fn => fn(this.value!));
  }

  valueOr<U>(or: U): T | U {
    return this.value == null ? or : this.value;
  }

  reduce<U extends Some>(fn: (acc: U, current: T) => U, initial: U): U {
    return this.value == null ? initial : fn(initial, this.value);
  }

  toString(): string {
    return this.value == null ? `Nothing` : `Just(${this.value})`;
  }

  /**
   * `from :: a -> Maybe a`
   *
   * Creates a new `Maybe` from the given value.
   */
  static from<T extends Some>(value: T | undefined): Maybe<T> {
    return new Maybe(value);
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
    defaultTo: U
  ): (fn: (x: T) => U) => (m: Maybe<T>) => U {
    return fn => m => m.reduce((_, x) => fn(x), defaultTo);
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
  static fromJust<T extends Some>(m: Maybe<T>): T {
    if (Maybe.isJust(m)) {
      return m.value;
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
  static fromMaybe<T extends Some>(defaultTo: T): (m: Maybe<T>) => T {
    return m => this.isJust(m) ? m.value : defaultTo;
  }

  /**
   * `listToMaybe :: [a] -> Maybe a`
   *
   * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
   * where `a` is the first element of the list.
   */
  static listToMaybe<T extends Some>(list: ReadonlyArray<T>): Maybe<T> {
    return list.length === 0 ? Maybe.Nothing() : Maybe.from(list[0]);
  }

  /**
   * `maybeToList :: Maybe a -> [a]`
   *
   * The `maybeToList` function returns an empty list when given `Nothing` or a
   * singleton list when not given `Nothing`.
   */
  static maybeToList<T extends Some>(m: Maybe<T>): ReadonlyArray<T> {
    return Maybe.isJust(m) ? [m.value] : [];
  }

  /**
   * `catMaybes :: [Maybe a] -> [a]`
   *
   * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
   * the `Just` values.
   */
  static catMaybes<T extends Some>(
    list: ReadonlyArray<Maybe<T>>
  ): ReadonlyArray<T> {
    return list.reduce<T[]>(
      (acc, e) => Maybe.isJust(e) ? [...acc, e.value] : acc,
      [],
    );
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
  ): (list: ReadonlyArray<T>) => ReadonlyArray<U>;
  static mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list: ReadonlyArray<T>,
  ): ReadonlyArray<U>;
  static mapMaybe<T extends Some, U extends Some>(
    fn: (x: T) => Maybe<U>,
    list?: ReadonlyArray<T>,
  ): ReadonlyArray<U> | (
    (list: ReadonlyArray<T>) => ReadonlyArray<U>
  ) {
    if (list === undefined) {
      return list => list.reduce<U[]>(
        (acc, e) => {
          const res = fn(e);
          return Maybe.isJust(res) ? [...acc, res.value] : acc;
        },
        [],
      );
    }

    return list.reduce<U[]>(
      (acc, e) => {
        const res = fn(e);
        return Maybe.isJust(res) ? [...acc, res.value] : acc;
      },
      [],
    );
  }

  static Just<T extends Some>(value: T): Just<T> {
    return new Maybe(value) as Just<T>;
  }

  static Nothing(): Nothing {
    return new Maybe(undefined) as Nothing;
  }

  // /**
  //  * `fromPred :: (a -> Bool, a -> b) -> a -> Maybe b`
  //  *
  //  * If the passed value passes the given predicate function, it is passed to
  //  * the second parameter and returned as a Maybe. If the passed value does not
  //  * pass the given predicate function, Nothing is returned.
  //  */
  // static fromPred<T, I extends T, R>(
  //   pred: (test: T) => test is I,
  //   isTrue: (value: I) => R,
  // ): (value: T) => Maybe<R | undefined>;
  // static fromPred<T, R>(
  //   pred: (test: T) => boolean,
  //   isTrue: (value: T) => R,
  // ): (value: T) => Maybe<R | undefined> {
  //   return value => this.from(pred(value) ? isTrue(value) : undefined);
  // }
}

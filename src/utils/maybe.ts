type OnlyNil<T> = T extends null | undefined ? T : never;

export interface Functor<T> {
  map<U, X>(fn: (t: T) => U): Functor<U | X>;
  map<U>(fn: (t: T) => U): Functor<U>;
}

export interface Monad<T> {
  bind<U, X>(fn: (t: T) => Monad<U>): Monad<U | X>;
  bind<U>(fn: (t: T) => Monad<U>): Monad<U>;
}

export interface MaybeFunctor<T> extends Functor<T>, Monad<T> {
  map<U>(fn: (value: NonNullable<T>) => U): Maybe<U | OnlyNil<T>>;
  bind<U>(fn: (value: NonNullable<T>) => Maybe<U>): Maybe<U | OnlyNil<T>>
  valueOr<U>(or: U): NonNullable<T> | U;
  reduce<U>(fn: (acc: U, current: NonNullable<T>) => U, acc: U): U;
  toString(): string;
}

export interface Just<T> extends MaybeFunctor<T> {
  readonly value: NonNullable<T>;
  map<U>(fn: (value: NonNullable<T>) => U): Maybe<U>;
  bind<U>(fn: (value: NonNullable<T>) => Maybe<U>): Maybe<U | OnlyNil<T>>
  valueOr(): NonNullable<T>;
  reduce<U>(fn: (acc: U, current: NonNullable<T>) => U, acc: U): U;
}

export interface Nothing<T> extends MaybeFunctor<T> {
  readonly value: OnlyNil<T>;
  map(): Maybe<OnlyNil<T>>;
  bind(): Maybe<OnlyNil<T>>;
  valueOr<U>(or: U): U;
  reduce<U>(fn: (acc: U, current: NonNullable<T>) => U, acc: U): U;
}

/**
 * The Maybe type allows the programmer to specify something may not be there.
 */
export class Maybe<T> implements MaybeFunctor<T> {
  readonly value: T;

  private constructor(value: T) {
    this.value = value;
  }

  map<U>(fn: (value: NonNullable<T>) => U): Maybe<U | OnlyNil<T>> {
    return this.value == null
      ? new Maybe(this.value)
      : new Maybe(fn(this.value as NonNullable<T>));
  }

  bind<U>(fn: (value: NonNullable<T>) => Maybe<U>): Maybe<U | OnlyNil<T>> {
    return this.value == null
      ? new Maybe(this.value)
      : fn(this.value as NonNullable<T>)
  }

  valueOr<U>(or: U): NonNullable<T> | U {
    return this.value == null
      ? or
      : this.value as NonNullable<T>;
  }

  reduce<U>(fn: (acc: U, current: NonNullable<T>) => U, initial: U): U {
    return this.value == null
      ? initial
      : fn(initial, this.value!);
  }

  toString(): string {
    return this.value == null
      ? `Nothing`
      : `Just(${this.value})`;
  }

  /**
   * `from :: a -> Maybe a`
   *
   * Creates a new `Maybe` from the given value.
   */
  static from<T>(value: T): Maybe<T> {
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
  static maybe<T, U>(defaultTo: U): (fn: (x: T) => U) => (m: Maybe<T>) => U {
    return fn => m => m.reduce((_, x) => fn(x), defaultTo);
  }

  /**
   * `isJust :: Maybe a -> Bool`
   *
   * The `isJust` function returns `true` if its argument is of the form
   * `Just _`.
   */
  static isJust<T>(x: Maybe<T>): x is Just<T> {
    return x.value != null;
  }

  /**
   * `isNothing :: Maybe a -> Bool`
   *
   * The `isNothing` function returns `true` if its argument is `Nothing`.
   */
  static isNothing<T>(x: Maybe<T>): x is Nothing<T> {
    return x.value == null;
  }

  /**
   * `fromJust :: Maybe a -> a`
   *
   * The `fromJust` function extracts the element out of a `Just` and throws an
   * error if its argument is `Nothing`.
   */
  static fromJust<T>(m: Maybe<T>): NonNullable<T> {
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
  static fromMaybe<T>(defaultTo: T): (m: Maybe<T | undefined | null>) => T {
    return m => this.isJust(m) ? m.value : defaultTo;
  }

  /**
   * `catMaybes :: [Maybe a] -> [a]`
   *
   * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
   * the `Just` values.
   */
  static catMaybes<T>(
    list: ReadonlyArray<Maybe<T>>
  ): ReadonlyArray<NonNullable<T>> {
    return list.reduce<NonNullable<T>[]>(
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
  static mapMaybe<T, U>(
    fn: (x: T) => Maybe<U>,
  ): (list: ReadonlyArray<T>) => ReadonlyArray<NonNullable<U>>;
  static mapMaybe<T, U>(
    fn: (x: T) => Maybe<U>,
    list: ReadonlyArray<T>,
  ): ReadonlyArray<NonNullable<U>>;
  static mapMaybe<T, U>(
    fn: (x: T) => Maybe<U>,
    list?: ReadonlyArray<T>,
  ): ReadonlyArray<NonNullable<U>> | (
    (list: ReadonlyArray<T>) => ReadonlyArray<NonNullable<U>>
  ) {
    if (list === undefined) {
      return list => list.reduce<NonNullable<U>[]>(
        (acc, e) => {
          const res = fn(e);
          return Maybe.isJust(res) ? [...acc, res.value] : acc;
        },
        [],
      );
    }

    return list.reduce<NonNullable<U>[]>(
      (acc, e) => {
        const res = fn(e);
        return Maybe.isJust(res) ? [...acc, res.value] : acc;
      },
      [],
    );
  }

  // /**
  //  * `fromPred :: (a -> Bool, a -> b) -> a -> Maybe b`
  //  *
  //  * If the passed value passes the given predicate function, it is passed to
  //  * the second parameter and returned as a Maybe. If the passed value does not
  //  * pass the given predicate function, Nothing(undefined) is returned.
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

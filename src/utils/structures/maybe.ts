import * as R from 'ramda';
import * as Al from '../../types/algebraic';
import { List } from './list';

// tslint:disable-next-line:interface-over-type-literal
export type Some = {};
export type Nullable = null | undefined;

export const isSome = <T>(e: T): e is NonNullable<T> => e !== null && e !== undefined;

export type MaybeContent<T> = T extends Maybe<infer I> ? I : never;

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
export class Maybe<T extends Some> implements Al.Alternative<T>, Al.Monad<T>,
  Al.Foldable<T>, Al.Setoid<T>, Al.Ord<T>, Al.Semigroup<T> {
  private readonly value: T | undefined;

  private constructor (value: T | Nullable) {
    // tslint:disable-next-line:triple-equals no-null-keyword
    this.value = value != null ? value : undefined;
  }

  // CONSTRUCTORS

  /**
   * `of :: a -> Maybe a`
   *
   * Creates a new `Maybe` from the given value.
   */
  static of<T extends Some> (value: T | Nullable): Maybe<T> {
    return new Maybe (value);
  }

  /**
   * `fromNullable :: a -> Maybe a`
   *
   * Creates a new `Maybe` from the given nullable value.
   */
  static fromNullable<T extends Some> (value: T | Nullable): Maybe<T> {
    return new Maybe (value);
  }

  /**
   * `normalize :: (a | Maybe a) -> Maybe a`
   *
   * Creates a new `Maybe` from the given nullable value. If the value is
   * already an instance of `Maybe`, it will just return the value.
   */
  static normalize<T extends Some> (value: T | Nullable | Maybe<T>): Maybe<T> {
    return value instanceof Maybe ? value : Maybe.fromNullable (value);
  }

  /**
   * `pure :: a -> Just a`
   *
   * Inject a value into a `Maybe` type.
   */
  static pure<T extends Some> (value: T): Just<T> {
    return Maybe.return (value) as Just<T>;
  }

  /**
   * `return :: a -> Just a`
   *
   * Inject a value into a `Maybe` type.
   */
  static return<T extends Some> (value: T): Just<T> {
    return new Maybe (value) as Just<T>;
  }

  /**
   * `empty :: () -> Nothing`
   *
   * Returns the empty `Maybe`.
   */
  static empty (): Nothing {
    return new Maybe (undefined) as Nothing;
  }

  // EQUALITY

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  equals (x: Maybe<T>): boolean {
    return R.equals ((this as Maybe<T>).value, x.value);
  }

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are equal.
   */
  static equals<T> (m1: Maybe<T>): (m2: Maybe<T>) => boolean {
    return m2 => R.equals (m1.value, m2.value);
  }

  /**
   * `(!=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are not equal.
   */
  notEquals (x: Maybe<T>): boolean {
    return !this.equals (x);
  }

  /**
   * `(>) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than the second value.
   *
   * If one of the values is `Nothing`, `(>)` always returns false.
   */
  gt<U extends number | string> (this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe (false) (this.bind (x1 => comp.fmap (x2 => x1 > x2)));
  }

  /**
   * `(<) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than the second value.
   *
   * If one of the values is `Nothing`, `(<)` always returns false.
   */
  lt<U extends number | string> (this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe (false) (this.bind (x1 => comp.fmap (x2 => x1 < x2)));
  }

  /**
   * `(>=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is greater than or equals the second
   * value.
   *
   * If one of the values is `Nothing`, `(>=)` always returns false.
   */
  gte<U extends number | string> (this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe (false) (this.bind (x1 => comp.fmap (x2 => x1 >= x2)));
  }

  /**
   * `(<=) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if the first value (`this`) is lower than or equals the second
   * value.
   *
   * If one of the values is `Nothing`, `(<=)` always returns false.
   */
  lte<U extends number | string> (this: Maybe<U>, comp: Maybe<U>): boolean {
    return Maybe.fromMaybe (false) (this.bind (x1 => comp.fmap (x2 => x1 <= x2)));
  }

  fmap<U extends Some> (fn: (value: T) => U): Maybe<U> {
    return this.value !== undefined ? Maybe.of (fn (this.value)) : this as any;
  }

  /**
   * `fmap :: (a -> b) -> Maybe a -> Maybe b`
   */
  static fmap<T extends Some, U extends Some> (
    fn: (value: T) => U
  ): (m: Maybe<T>) => Maybe<U> {
    return m => m.fmap (fn);
  }

  /**
   * `(<$) :: Functor f => a -> f b -> f a`
   *
   * Replace all locations in the input with the same value. The default
   * definition is `fmap . const`, but this may be overridden with a more
   * efficient version.
   */
  static mapReplace<A, B> (x: A): (m: Maybe<B>) => Maybe<A> {
    return Maybe.fmap (_ => x);
  }

  bind<U extends Some> (fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value !== undefined ? fn (this.value) : this as any;
  }

  /**
   * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
   */
  static bind<T extends Some, U extends Some> (
    m: Maybe<T>
  ): (f: (value: T) => Maybe<U>) => Maybe<U> {
    return f => m.bind (f);
  }

  /**
   * `(=<<) :: (a -> Maybe b) -> Maybe a -> Maybe b`
   */
  static bind_<T extends Some, U extends Some> (
    f: (value: T) => Maybe<U>
  ): (m: Maybe<T>) => Maybe<U> {
    return m => m.bind (f);
  }

  then<U extends Some> (x: Maybe<U>): Maybe<U> {
    return this.value !== undefined ? x : this as any;
  }

  /**
   * `(>>) :: forall a b. m a -> m b -> m b`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * first, like sequencing operators (such as the semicolon) in imperative
   * languages.
   *
   * ```a >> b = a >>= \ _ -> b```
   */
  static then<T extends Some> (m1: Maybe<any>): (m2: Maybe<T>) => Maybe<T> {
    return m2 => m1.value !== undefined ? m2 : Maybe.empty ();
  }

  /**
   * `(<<) :: forall a b. m a -> m b -> m a`
   *
   * Sequentially compose two actions, discarding any value produced by the
   * second.
   */
  static then_<T extends Some> (m1: Maybe<T>): (m2: Maybe<any>) => Maybe<T> {
    return m2 => m2.value !== undefined ? m1 : Maybe.empty ();
  }

  /**
   * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
   */
  ap<U extends Some> (m: Maybe<((value: T) => U)>): Maybe<U> {
    return this.value !== undefined ? m.fmap (fn => fn (this.value!)) : this as any;
  }

  /**
   * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
   */
  static ap<T extends Some, U extends Some> (
    ma: Maybe<((value: T) => U)>
  ): (m: Maybe<T>) => Maybe<U> {
    return m => Maybe.isJust (m) ? ma.fmap (fn => fn (Maybe.fromJust (m))) : m as Nothing;
  }

  foldl<U extends Some> (fn: (acc: U) => (current: T) => U): (initial: U) => U {
    return initial => this.value !== undefined ? fn (initial) (this.value) : initial;
  }

  /**
   * `elem :: Eq a => a -> Maybe a -> Bool`
   *
   * Does the element occur in the structure?
   *
   * Always returns `False` if the provided `Maybe` is `Nothing`.
   */
  static elem<T extends Some> (e: T): (m: Maybe<T>) => boolean {
    return m => Maybe.isJust (m) && e === m.value;
  }

  /**
   * `elem_ :: Eq a => Maybe a -> a -> Bool`
   *
   * Does the element occur in the structure?
   *
   * Always returns `False` if the provided `Maybe` is `Nothing`.
   *
   * Flipped version of `elem`.
   */
  static elem_<T extends Some> (m: Maybe<T>): (e: T) => boolean {
    return e => Maybe.isJust (m) && e === m.value;
  }

  /**
   * `notElem :: Eq a => a -> Maybe a -> Bool`
   *
   * `notElem` is the negation of `elem`.
   */
  static notElem<T extends Some> (e: T): (m: Maybe<T>) => boolean {
    return R.pipe<Maybe<T>, boolean, boolean> (
      Maybe.elem (e),
      R.not
    );
  }

  /**
   * `mappend :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
   *
   * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
   * type `Just a`. If at least one of them is `Nothing`, it returns the first
   * element.
   */
  mappend<U, S extends Al.Semigroup<U>> (this: Maybe<S>, m: Maybe<S>): Maybe<S> {
    return this.value !== undefined && m.value !== undefined
      ? Maybe.return (this.value .mappend (m.value) as S)
      : this;
  }

  /**
   * `alt :: f a -> f a -> f a` *infix*
   *
   * The `alt` function takes a `Maybe` of the same type. If the first `Maybe`
   * is `Nothing`, it returns the second `Maybe`, otherwise it returns the
   * first.
   */
  alt (m: Maybe<T>): Maybe<T> {
    return this.value !== undefined ? this : m;
  }

  /**
   * `alt :: f a -> f a -> f a`
   *
   * The `alt` function takes a `Maybe` of the same type. If the first `Maybe`
   * is `Nothing`, it returns the second `Maybe`, otherwise it returns the
   * first.
   */
  static alt<T extends Some> (m1: Maybe<T>): (m2: Maybe<T>) => Maybe<T> {
    return m2 => m1.value !== undefined ? m1 : m2;
  }

  /**
   * `alt :: f a -> f a -> f a`
   *
   * The `alt` function takes a `Maybe` of the same type. If the second `Maybe`
   * is `Nothing`, it returns the first `Maybe`, otherwise it returns the
   * second.
   *
   * This is the same as `Maybe.alt` but with arguments swapped.
   */
  static alt_<T extends Some> (m1: Maybe<T>): (m2: Maybe<T>) => Maybe<T> {
    return m2 => m2.value === undefined ? m1 : m2;
  }

  /**
   * `join :: Maybe m => m (m a) -> m a`
   *
   * The `join` function is the conventional monad join operator. It is used to
   * remove one level of monadic structure, projecting its bound argument into
   * the outer level.
   */
  static join<A extends Some> (m: Maybe<Maybe<A>>): Maybe<A> {
    return Maybe.bind<Maybe<A>, A> (m) (R.identity);
  }

  /**
   * `toString :: Maybe m => m a -> String`
   */
  toString (): string {
    return this.value !== undefined ? `Just ${R.toString (this.value)}` : `Nothing`;
  }

  /**
   * `(==) :: Maybe a -> Maybe a -> Bool`
   *
   * Returns if both given values are shallowly equal. Used only for selector
   * memoization.
   *
   * @internal
   */
  UNSAFE_shallowEquals (x: Maybe<T>): boolean {
    return (this as Maybe<T>).value === x.value;
  }

  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some, O extends T> (
    pred: (value: T) => value is O
  ): (value: T | Nullable) => Maybe<O>;
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  static ensure<T extends Some> (pred: (value: T) => boolean): (value: T | Nullable) => Maybe<T>;
  static ensure<T extends Some> (pred: (value: T) => boolean): (value: T | Nullable) => Maybe<T> {
    return value => Maybe.of (value).bind<T> (
      someX => pred (someX) ? Maybe.return (someX) : Maybe.empty ()
    );
  }

  /**
   * `maybe :: b -> (a -> b) -> Maybe a -> b`
   *
   * The `maybe` function takes a default value, a function, and a `Maybe`
   * value. If the `Maybe` value is `Nothing`, the function returns the default
   * value. Otherwise, it applies the function to the value inside the `Just`
   * and returns the result.
   */
  static maybe<T extends Some, U extends Some> (
    def: U
  ): (fn: (x: T) => U) => (m: Maybe<T>) => U {
    return fn => m => m.foldl (() => fn) (def);
  }

  /**
   * `isJust :: Maybe a -> Bool`
   *
   * The `isJust` function returns `true` if its argument is of the form
   * `Just _`.
   */
  static isJust<T extends Some> (x: Maybe<T>): x is Just<T> {
    return x.value !== undefined;
  }

  /**
   * `isNothing :: Maybe a -> Bool`
   *
   * The `isNothing` function returns `true` if its argument is `Nothing`.
   */
  static isNothing<T extends Some> (x: Maybe<T>): x is Nothing {
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
  static fromJust<T extends Some> (m: Just<T>): T {
    if (Maybe.isJust (m)) {
      return m.value as T;
    }

    throw new TypeError (`Cannot extract a value out of type Nothing.`);
  }

  /**
   * `fromMaybe :: a -> Maybe a -> a`
   *
   * The `fromMaybe` function takes a default value and and `Maybe` value. If
   * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
   * returns the value contained in the `Maybe`.
   */
  static fromMaybe<T extends Some> (def: T): (m: Maybe<T>) => T {
    return m => Maybe.isJust (m) ? m.value as T : def;
  }

  /**
   * `listToMaybe :: [a] -> Maybe a`
   *
   * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
   * where `a` is the first element of the list.
   */
  static listToMaybe<T extends Some> (list: List<T>): Maybe<T> {
    return list.length () === 0 ? Maybe.empty () : Just (List.head (list));
  }

  /**
   * `maybeToList :: Maybe a -> [a]`
   *
   * The `maybeToList` function returns an empty list when given `Nothing` or a
   * singleton list when not given `Nothing`.
   */
  static maybeToList<T extends Some> (m: Maybe<T>): List<T> {
    return Maybe.isJust (m) ? List.of (m.value as T) : List.empty ();
  }

  /**
   * `catMaybes :: [Maybe a] -> [a]`
   *
   * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
   * the `Just` values.
   */
  static catMaybes<T extends Some> (
    list: List<Maybe<T>>
  ): List<T> {
    return List.map<Maybe<T>, T> (e => e.value as T) (list.filter (Maybe.isJust));
  }

  /**
   * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
   *
   * The `mapMaybe` function is a version of `map` which can throw out elements.
   * If particular, the functional argument returns something of type `Maybe b`.
   * If this is `Nothing`, no element is added on to the result list. If it is
   * `Just b`, then `b` is included in the result list.
   */
  static mapMaybe<T extends Some, U extends Some> (
    fn: (x: T) => Maybe<U>
  ): (list: List<T>) => List<U> {
    return list =>
      list.foldl<List<U>> (
        acc => x => {
          const result = fn (x);

          if (Maybe.isJust (result)) {
            return acc.append (Maybe.fromJust (result));
          }
          else {
            return acc;
          }
        })
        (List.of ());
  }

  /**
   * `imapMaybe :: (Int -> a -> Maybe b) -> [a] -> [b]`
   *
   * The `imapMaybe` function is a version of `map` which can throw out
   * elements. If particular, the functional argument returns something of type
   * `Maybe b`. If this is `Nothing`, no element is added on to the result list.
   * If it is `Just b`, then `b` is included in the result list.
   */
  static imapMaybe<T extends Some, U extends Some> (
    fn: (index: number) => (x: T) => Maybe<U>
  ): (list: List<T>) => List<U> {
    return list =>
      list.ifoldl<List<U>> (
        acc => index => x => {
          const result = fn (index) (x);

          if (Maybe.isJust (result)) {
            return acc.append (Maybe.fromJust (result));
          }
          else {
            return acc;
          }
        })
        (List.of ());
  }

  /**
   * `liftM2 :: (a1 -> a2 -> r) -> Maybe a1 -> Maybe a2 -> Maybe r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  static liftM2<A1 extends Some, A2 extends Some, B extends Some> (
    fn: (a1: A1) => (a2: A2) => B
  ): (m1: Maybe<A1>) => (m2: Maybe<A2>) => Maybe<B> {
    return m1 => m2 => m1.bind (a1 => m2.fmap (a2 => fn (a1) (a2)));
  }

  /**
   * `liftM3 :: (a1 -> a2 -> a3 -> r) -> Maybe a1 -> Maybe a2 -> Maybe a3 -> Maybe r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  static liftM3<A1 extends Some, A2 extends Some, A3 extends Some, B extends Some> (
    fn: (a1: A1) => (a2: A2) => (a3: A3) => B
  ): (m1: Maybe<A1>) => (m2: Maybe<A2>) => (m3: Maybe<A3>) => Maybe<B> {
    return m1 => m2 => m3 => m1.bind (
      a1 => m2.bind (
        a2 => m3.fmap (
          a3 => fn (a1) (a2) (a3)
        )
      )
    );
  }

  /**
   * `liftM4 :: (a1 -> a2 -> a3 -> a4 -> r) -> Maybe a1 -> Maybe a2 -> Maybe a3
-> Maybe a4 -> Maybe r`
   *
   * Promote a function to a monad, scanning the monadic arguments from left to
   * right.
   */
  static liftM4<
    A1 extends Some,
    A2 extends Some,
    A3 extends Some,
    A4 extends Some,
    B extends Some
  > (
    fn: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B
  ): (m1: Maybe<A1>) => (m2: Maybe<A2>) => (m3: Maybe<A3>) => (m4: Maybe<A4>) => Maybe<B> {
    return m1 => m2 => m3 => m4 => m1.bind (
      a1 => m2.bind (
        a2 => m3.bind (
          a3 => m4.fmap (
            a4 => fn (a1) (a2) (a3) (a4)
          )
        )
      )
    );
  }

  /**
   * `maybeToReactNode :: Maybe JSXElement -> ReactNode`
   *
   * The `maybeToReactNode` function returns `null` when given `Nothing` or
   * returns the JSX Element inside when given a `Just`.
   *
   * Note: Do not use in application flow, only use when return value is
   * directly used by React. Why? `null` is unsafe! But it's required by React
   * if you do not want an element to be displayed.
   */
  static maybeToReactNode<A extends JSX.Element | string> (m: Maybe<A>): React.ReactNode {
    return Maybe.isJust (m) ? Maybe.fromJust (m) : null;
  }
}

export const Just = <T extends Some>(value: T): Just<T> => Maybe.pure (value);
export const Nothing = (): Nothing => Maybe.empty ();

export interface Just<T extends Some> extends Maybe<T> {
  fmap<U extends Some> (fn: (value: T) => U): Just<U>;
  bind<U extends Some> (fn: (value: T) => Nothing): Nothing;
  bind<U extends Some> (fn: (value: T) => Just<U>): Just<U>;
  bind<U extends Some> (fn: (value: T) => Maybe<U>): Maybe<U>;
  ap<U extends Some> (m: Just<((value: T) => U)>): Just<U>;
  ap<U extends Some> (m: Maybe<((value: T) => U)>): Maybe<U>;
  mappend<X, U extends Al.Semigroup<X>> (this: Just<U>, m: Maybe<U>): Just<U>;
  alt (): Just<T>;
}

export interface Nothing extends Maybe<never> {
  fmap (): Nothing;
  bind (): Nothing;
  ap (): Nothing;
  mappend<X, U extends Al.Semigroup<X>> (this: Nothing, m: Maybe<U>): Nothing;
  alt<T> (m: Maybe<T>): Maybe<T>;
}

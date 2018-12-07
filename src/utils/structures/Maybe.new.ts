/**
 * @module Maybe
 *
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe a`
 * either contains a value of type `a` (represented as `Just a`), or it is empty
 * (represented as `Nothing`). Using `Maybe` is a good way to deal with errors
 * or exceptional cases without resorting to drastic measures such as `error`.
 *
 * The `Maybe` type is also a monad. It is a simple kind of error monad, where
 * all errors are represented by `Nothing`. A richer error monad can be built
 * using the `Either` type.
 *
 * @author Lukas Obermann
 * @author hackage.haskell.org (a lot of JSDocs)
 * @see Either
 */

import { pipe } from 'ramda';
import { cons, empty as emptyList, filter, fnull as fnullList, foldr, fromElements, head, ifoldr, List, map } from './List.new';
import { Mutable } from './typeUtils';


// MAYBE TYPE DEFINITION

export type Maybe<A extends Some> = Just<A> | Nothing;


// CONSTRUCTORS

// Just

interface JustPrototype {
  readonly isJust: true;
  readonly isNothing: false;
}

export interface Just<A extends Some> extends JustPrototype {
  readonly value: A;
  readonly prototype: JustPrototype;
}

const JustPrototype: JustPrototype = {
  isJust: true,
  isNothing: false,
};

export const Just = <A extends Some> (value: A): Just<A> => {
  const just: Mutable<Just<A>> = Object.create (JustPrototype);
  just.value = value;

  return just;
};

// Nothing

interface NothingPrototype {
  readonly isJust: false;
  readonly isNothing: true;
}

export interface Nothing extends JustPrototype {
  readonly prototype: JustPrototype;
}

const NothingPrototype: NothingPrototype = {
  isJust: false,
  isNothing: true,
};

export const Nothing: Nothing = Object.create (NothingPrototype);

/**
 * `fromNullable :: a -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value.
 */
export const fromNullable =
  <A extends Some> (value: A | Nullable): Maybe<A> =>
    value !== null && value !== undefined ? Just (value) : Nothing;


// MAYBE FUNCTIONS

/**
 * `isJust :: Maybe a -> Bool`
 *
 * The `isJust` function returns `true` if its argument is of the form
 * `Just _`.
 */
export const isJust = <A extends Some> (x: Maybe<A>): x is Just<A> => x.prototype === JustPrototype;

/**
 * `isNothing :: Maybe a -> Bool`
 *
 * The `isNothing` function returns `true` if its argument is `Nothing`.
 */
export const isNothing = <A extends Some> (x: Maybe<A>): x is Nothing => x === Nothing;

/**
 * `fromJust :: Maybe a -> a`
 *
 * The `fromJust` function extracts the element out of a `Just` and throws an
 * error if its argument is `Nothing`.
 *
 * @throws TypeError
 */
export const fromJust =
  <A extends Some> (x: Just<A>): A => {
    if (isJust (x)) {
      return x.value;
    }

    throw new TypeError (`Cannot extract a value out of type Nothing.`);
  };

/**
 * `fromMaybe :: a -> Maybe a -> a`
 *
 * The `fromMaybe` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
 * returns the value contained in the `Maybe`.
 */
export const fromMaybe =
  <A extends Some> (def: A) => (x: Maybe<A>): A =>
    isJust (x) ? fromJust (x) : def;


// FOLDABLE

/**
 * `foldl :: (b -> a -> b) -> b -> Maybe a -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A extends Some, B extends Some> (fn: (acc: B) => (current: A) => B) =>
    (initial: B) => (m: Maybe<A>): B =>
      isJust (m) ? fn (initial) (fromJust (m)) : initial;

/**
 * `toList :: Maybe a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A extends Some>(m: Maybe<A>): List<A> =>
    isJust (m) ? fromElements (fromJust (m)) : emptyList ();

/**
 * `null :: Maybe a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull: (m: Maybe<Some>) => boolean = isNothing;

/**
 * `length :: Maybe a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (m: Maybe<Some>): number => isJust (m) ? 1 : 0;

/**
 * `elem :: Eq a => a -> Maybe a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 */
export const elem =
  <A extends Some> (e: A) => (m: Maybe<A>): boolean =>
    isJust (m) && e === fromJust (m);

/**
 * `elem_ :: Eq a => Maybe a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 *
 * Flipped version of `elem`.
 */
export const elem_ = <A extends Some> (m: Maybe<A>) => (e: A): boolean => elem (e) (m);

/**
 * `sum :: Num a => Maybe a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = fromMaybe (0);

/**
 * `product :: Num a => Maybe a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = fromMaybe (1);

// Special folds

/**
 * `concat :: Maybe [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A extends Some>(m: Maybe<List<A>>): List<A> =>
    fromMaybe<List<A>> (emptyList<A> ()) (m);

/**
 * `concatMap :: (a -> [b]) -> Maybe a -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A extends Some, B extends Some>
  (f: (x: A) => List<B>) =>
  (xs: Maybe<A>): List<B> =>
    fromMaybe (emptyList<B> ()) (fmap (f) (xs));

/**
 * `and :: Maybe Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite; `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = fromMaybe (true);

/**
 * `or :: Maybe Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite; `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = fromMaybe (false);

/**
 * `any :: (a -> Bool) -> Maybe a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Some>(f: (x: A) => boolean) => (m: Maybe<A>): boolean =>
    fromMaybe (false) (fmap (f) (m));

/**
 * `all :: (a -> Bool) -> Maybe a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Some>(f: (x: A) => boolean) => (m: Maybe<A>): boolean =>
    fromMaybe (true) (fmap (f) (m));

// Searches

/**
 * `notElem :: Eq a => a -> Maybe a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A extends Some> (e: A) => (m: Maybe<A>): boolean =>
    !elem (e) (m);


// ALTERNATIVE


// EQ


// ORD

/**
 * `(>) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the first value is greater than the second value.
 *
 * If one of the values is `Nothing`, `(>)` always returns `false`.
 */
export const gt =
  <A extends number | string> (m1: Maybe<A>) => (m2: Maybe<A>): boolean =>
    fromMaybe (false) (liftM2<A, A, boolean> (x1 => x2 => x1 > x2) (m1) (m2));

/**
 * `(<) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the first value is lower than the second value.
 *
 * If one of the values is `Nothing`, `(<)` always returns `false`.
 */
export const lt =
  <A extends number | string> (m1: Maybe<A>) => (m2: Maybe<A>): boolean =>
    fromMaybe (false) (liftM2<A, A, boolean> (x1 => x2 => x1 < x2) (m1) (m2));

/**
 * `(>=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the first value is greater than or equals the second
 * value.
 *
 * If one of the values is `Nothing`, `(>=)` always returns `false`.
 */
export const gte =
  <A extends number | string> (m1: Maybe<A>) => (m2: Maybe<A>): boolean =>
    fromMaybe (false) (liftM2<A, A, boolean> (x1 => x2 => x1 >= x2) (m1) (m2));

/**
 * `(<=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the first value is lower than or equals the second
 * value.
 *
 * If one of the values is `Nothing`, `(<=)` always returns `false`.
 */
export const lte =
  <A extends number | string> (m1: Maybe<A>) => (m2: Maybe<A>): boolean =>
    fromMaybe (false) (liftM2<A, A, boolean> (x1 => x2 => x1 <= x2) (m1) (m2));


// SEMIGROUP

// /**
//  * `mappend :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
//  *
//  * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
//  * type `Just a`. If at least one of them is `Nothing`, it returns the first
//  * element.
//  */
// export const mappend = <U, S extends Semigroup<U>> (m1: Maybe<S>) => (m2: Maybe<S>): Maybe<S> =>
//   isJust (m1) && isJust (m2)
//     ? Just (mappend (fromJust (m1), fromJust (m2)))
//     : m1;


// MAYBE FUNCTIONS (PART 2)

/**
 * `maybe :: b -> (a -> b) -> Maybe a -> b`
 *
 * The `maybe` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 */
export const maybe =
  <A extends Some, B extends Some> (def: B) => (fn: (x: A) => B) => (m: Maybe<A>): B =>
    foldl<A, B> (() => fn) (def) (m);

/**
 * `listToMaybe :: [a] -> Maybe a`
 *
 * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
 * where `a` is the first element of the list.
 */
export const listToMaybe =
  <A extends Some> (list: List<A>): Maybe<A> =>
    fnullList (list) ? Nothing : Just (head (list));

/**
 * `maybeToList :: Maybe a -> [a]`
 *
 * The `maybeToList` function returns an empty list when given `Nothing` or a
 * singleton list when not given `Nothing`.
 */
export const maybeToList = toList;

/**
 * `catMaybes :: [Maybe a] -> [a]`
 *
 * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
 * the `Just` values.
 */
export const catMaybes =
  <A extends Some> (list: List<Maybe<A>>): List<A> =>
    map<Just<A>, A> (fromJust) (filter<Maybe<A>, Just<A>> (isJust) (list));

/**
 * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
 *
 * The `mapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 */
export const mapMaybe =
  <A extends Some, B extends Some> (fn: (x: A) => Maybe<B>) =>
    foldr<A, List<B>>
      (x => acc => pipe (fn, maybe<B, List<B>> (acc) (cons (acc))) (x))
      (emptyList ());


// CUSTOM MAYBE FUNCTIONS

/**
 * `isMaybe :: a -> Bool`
 *
 * The `isMaybe` function returns `True` if its argument is a `Maybe`.
 */
export const isMaybe =
  (x: any): x is Maybe<any> =>
    x && x.prototype === JustPrototype || x === Nothing;

/**
 * `normalize :: (a | Maybe a) -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value. If the value is
 * already an instance of `Maybe`, it will just return the value.
 */
export const normalize =
  <A extends Some> (value: A | Nullable | Maybe<A>): Maybe<A> =>
    isMaybe (value) ? value : fromNullable (value);

interface Ensure {
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A extends Some, A_ extends A> (
    pred: (value: A) => value is A_
  ): (value: A | Nullable) => Maybe<A_>;
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A extends Some> (pred: (value: A) => boolean): (value: A | Nullable) => Maybe<A>;
}

/**
 * `ensure :: (a -> Bool) -> a -> Maybe a`
 *
 * Creates a new `Just a` from the given value if the given predicate
 * evaluates to `True` and the given value is not nullable. Otherwise returns
 * `Nothing`.
 */
export const ensure: Ensure =
  <A extends Some> (pred: (value: A) => boolean) => (value: A | Nullable): Maybe<A> =>
    bind<A, A> (fromNullable (value))
               (x => pred (x) ? Just (x) : Nothing);

/**
 * `imapMaybe :: (Int -> a -> Maybe b) -> [a] -> [b]`
 *
 * The `imapMaybe` function is a version of `map` which can throw out
 * elements. If particular, the functional argument returns something of type
 * `Maybe b`. If this is `Nothing`, no element is added on to the result list.
 * If it is `Just b`, then `b` is included in the result list.
 */
export const imapMaybe =
  <A extends Some, B extends Some> (fn: (index: number) => (x: A) => Maybe<B>) =>
    ifoldr<A, List<B>>
      (index => x => acc => pipe (fn (index), maybe<B, List<B>> (acc) (cons (acc))) (x))
      (emptyList ());

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
export const maybeToReactNode =
  <A extends JSX.Element | string> (m: Maybe<A>): React.ReactNode =>
    isJust (m) ? fromJust (m) : null;

// TYPE HELPERS

export type MaybeContent<T> = T extends Maybe<infer I> ? I : never;

// tslint:disable-next-line:interface-over-type-literal
export type Some = {};
export type Nullable = null | undefined;

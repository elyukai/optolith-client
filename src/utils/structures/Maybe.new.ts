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
 * @see Either
 */

import { pipe } from 'ramda';
import * as Math from '../mathUtils';
import { cnst, id, T } from './combinators';
import { cons, cons_, fromElements, head, ifoldr, List } from './List.new';


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

const JustPrototype =
  Object.freeze<JustPrototype> ({
    isJust: true,
    isNothing: false,
  });

/**
 * `Just :: a -> Maybe a`
 *
 * Creates a new `Just` from the passed value.
 */
export const Just = <A extends Some> (x: A): Just<A> => {
  if (x !== null && x !== undefined) {
    return Object.create (JustPrototype, { value: { value: x, enumerable: true }});
  }

  throw new TypeError ('Cannot create a Just from a nullable value.');
};

// Nothing

interface NothingPrototype extends Object {
  readonly isJust: false;
  readonly isNothing: true;
}

export interface Nothing extends NothingPrototype {
  readonly prototype: NothingPrototype;
}

const NothingPrototype: NothingPrototype =
  Object.freeze<NothingPrototype> ({
    isJust: false,
    isNothing: true,
  });

/**
 * `Nothing :: Maybe a`
 *
 * The empty `Maybe`.
 */
export const Nothing: Nothing = Object.create (NothingPrototype);

/**
 * `fromNullable :: a -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value.
 */
export const fromNullable =
  <A extends Some> (value: A | Nullable): Maybe<A> =>
    value !== null && value !== undefined ? Just (value) : Nothing;


// MAYBE FUNCTIONS (PART 1)

/**
 * `isJust :: Maybe a -> Bool`
 *
 * The `isJust` function returns `true` if its argument is of the form
 * `Just _`.
 */
export const isJust = <A extends Some> (x: Maybe<A>): x is Just<A> => x.isJust;

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
    isJust (x) ? x .value : def;


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Maybe a -> Maybe b`
 */
export const fmap =
  <A extends Some, B extends Some>
  (f: (value: A) => B) => (x: Maybe<A>): Maybe<B> =>
    isJust (x) ? Just (f (x .value)) : x;

/**
 * `(<$) :: a -> Maybe b -> Maybe a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A extends Some, B extends Some> (x: A) => fmap<B, A> (cnst (x));


// APPLICATIVE

/**
 * `pure :: a -> Maybe a`
 *
 * Lift a value.
 */
export const pure = Just;

/**
 * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
 *
 * Sequential application.
 */
export const ap =
  <A extends Some, B extends Some>(ma: Maybe<(value: A) => B>) => (m: Maybe<A>): Maybe<B> =>
    isJust (ma) ? fmap (ma .value) (m) : ma;


// ALTERNATIVE

/**
 * `alt :: Maybe a -> Maybe a -> Maybe a`
 */
export const alt =
  <A extends Some> (m1: Maybe<A>) => (m2: Maybe<A>): Maybe<A> =>
    isJust (m1) ? m1 : m2;

/**
 * `alt :: f a -> f a -> f a`
 *
 * This is the same as `alt` but with arguments swapped.
 */
export const alt_ =
  <A extends Some> (m2: Maybe<A>) => (m1: Maybe<A>): Maybe<A> =>
    alt (m1) (m2);

/**
 * `empty :: Maybe a`
 */
export const empty = Nothing;

/**
 * `guard :: Bool -> Maybe ()`
 *
 * Conditional failure of Alternative computations. Defined by
```hs
guard True  = pure ()
guard False = empty
```
  * In TypeScript, this is not possible, so instead it's
```ts
guard (true)  = pure (true)
guard (false) = empty
```
  */
export const guard = (pred: boolean): Maybe<true> => pred ? pure<true> (true) : empty;


// MONAD

/**
 * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
 */
export const bind =
  <A extends Some, B extends Some> (x: Maybe<A>) => (f: (value: A) => Maybe<B>): Maybe<B> =>
    isJust (x) ? f (x .value) : x;

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bind_ =
  <A extends Some, B extends Some> (f: (value: A) => Maybe<B>) => (x: Maybe<A>): Maybe<B> =>
    bind<A, B> (x) (f);


/**
 * `(>>) :: Maybe a -> Maybe b -> Maybe b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  <A extends Some> (x1: Maybe<any>) => (x2: Maybe<A>): Maybe<A> =>
    bind<any, A> (x1) (_ => x2);

/**
 * `return :: a -> Maybe a`
 *
 * Inject a value into the `Maybe` type.
 */
export const mreturn = Just;

/**
 * `(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => Maybe<B>) => (f2: (x: B) => Maybe<C>) =>
    pipe (f1, bind_ (f2));

/**
 * `join :: Maybe (Maybe a) -> Maybe a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join = <A extends Some> (x: Maybe<Maybe<A>>): Maybe<A> => bind<Maybe<A>, A> (x) (id);

/**
 * `liftM2 :: (a1 -> a2 -> r) -> Maybe a1 -> Maybe a2 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1 extends Some, A2 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B) =>
  (m1: Maybe<A1>) =>
  (m2: Maybe<A2>): Maybe<B> =>
    bind<A1, B> (m1) (pipe (f, fmap, T (m2)));

/**
 * `liftM3 :: (a1 -> a2 -> a3 -> r) -> Maybe a1 -> Maybe a2 -> Maybe a3 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM3 =
  <A1 extends Some, A2 extends Some, A3 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => B) =>
  (m1: Maybe<A1>) =>
  (m2: Maybe<A2>) =>
  (m3: Maybe<A3>): Maybe<B> =>
    bind<A1, B> (m1) (a1 => liftM2 (f (a1)) (m2) (m3));

/**
 * `liftM4 :: Maybe m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 -> m a4 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM4 =
  <A1 extends Some, A2 extends Some, A3 extends Some, A4 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B) =>
  (m1: Maybe<A1>) =>
  (m2: Maybe<A2>) =>
  (m3: Maybe<A3>) =>
  (m4: Maybe<A4>): Maybe<B> =>
    bind<A1, B> (m1) (a1 => liftM3 (f (a1)) (m2) (m3) (m4));

/**
 * `liftM5 :: Maybe m => (a1 -> a2 -> a3 -> a4 -> a5 -> r) -> m a1 -> m a2 -> m
a3 -> m a4 -> m a5 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM5 =
  <
    A1 extends Some,
    A2 extends Some,
    A3 extends Some,
    A4 extends Some,
    A5 extends Some,
    B extends Some
  >
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => (a5: A5) => B) =>
  (m1: Maybe<A1>) =>
  (m2: Maybe<A2>) =>
  (m3: Maybe<A3>) =>
  (m4: Maybe<A4>) =>
  (m5: Maybe<A5>): Maybe<B> =>
    bind<A1, B> (m1) (a1 => liftM4 (f (a1)) (m2) (m3) (m4) (m5));


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Maybe a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A extends Some, B extends Some>
  (f: (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (x: Maybe<A>): B =>
    isJust (x) ? f (x .value) (initial) : initial;

/**
 * `foldl :: (b -> a -> b) -> b -> Maybe a -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: Maybe<A>): B =>
    isJust (xs) ? f (initial) (xs .value) : initial;

/**
 * `toList :: Maybe a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A extends Some>(xs: Maybe<A>): List<A> =>
    isJust (xs) ? fromElements (xs .value) : List.empty;

/**
 * `null :: Maybe a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: Maybe<Some>): boolean => length (xs) === 0;

/**
 * `length :: Maybe a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (xs: Maybe<Some>): number => isJust (xs) ? 1 : 0;

/**
 * `elem :: Eq a => a -> Maybe a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 */
export const elem =
  <A extends Some> (e: A) => (xs: Maybe<A>): boolean =>
    isJust (xs) && e === xs .value;

/**
 * `elem_ :: Eq a => Maybe a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 *
 * Same as `elem` but with arguments switched.
 */
export const elem_ = <A extends Some> (xs: Maybe<A>) => (e: A): boolean => elem (e) (xs);

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

// Specialized folds

/**
 * `concat :: Maybe [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A extends Some>(m: Maybe<List<A>>): List<A> =>
    fromMaybe<List<A>> (List.empty) (m);

/**
 * `concatMap :: (a -> [b]) -> Maybe a -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A extends Some, B extends Some> (f: (x: A) => List<B>) => (xs: Maybe<A>): List<B> =>
    fromMaybe<List<B>> (List.empty) (fmap (f) (xs));

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

interface Find {
  /**
   * `find :: (a -> Bool) -> Maybe a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (xs: Maybe<A>) => Maybe<A1>;

  /**
   * `find :: (a -> Bool) -> Maybe a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (xs: Maybe<A>) => Maybe<A>;
}

/**
 * `find :: (a -> Bool) -> Maybe a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: Maybe<A>): Maybe<A> =>
    isJust (xs) && pred (xs .value) ? xs : Nothing;


// ORD

/**
 * `(>) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is greater than the first value.
 *
 * If one of the values is `Nothing`, `(>)` always returns `false`.
 */
export const gt =
  (m1: Maybe<number>) => (m2: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.gt) (m1) (m2));

/**
 * `(<) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is lower than the first value.
 *
 * If one of the values is `Nothing`, `(<)` always returns `false`.
 */
export const lt =
  (m1: Maybe<number>) => (m2: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.lt) (m1) (m2));

/**
 * `(>=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is greater than or equals the first
 * value.
 *
 * If one of the values is `Nothing`, `(>=)` always returns `false`.
 */
export const gte =
  (m1: Maybe<number>) => (m2: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.gte) (m1) (m2));

/**
 * `(<=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is lower than or equals the first
 * value.
 *
 * If one of the values is `Nothing`, `(<=)` always returns `false`.
 */
export const lte =
  (m1: Maybe<number>) => (m2: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.lte) (m1) (m2));


// // SEMIGROUP

// /**
//  * `mappend :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
//  *
//  * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
//  * type `Just a`. If at least one of them is `Nothing`, it returns the first
//  * element.
//  */
// export const mappend = <U> (m1: Maybe<List<U>>) => (m2: Maybe<List<U>>): Maybe<List<U>> =>
//   isJust (m1) && isJust (m2)
//     ? Just (List.mappend (fromJust (m1), fromJust (m2)))
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
    List.fnull (list) ? Nothing : Just (head (list));

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
    List.foldr<Maybe<A>, List<A>> (maybe<A, (x: List<A>) => List<A>> (id) (cons_))
                                  (List.empty)
                                  (list);

/**
 * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
 *
 * The `mapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 */
export const mapMaybe =
  <A extends Some, B extends Some> (f: (x: A) => Maybe<B>) =>
    List.foldr<A, List<B>> (pipe (f, maybe<B, (x: List<B>) => List<B>> (id) (cons_)))
                           (List.empty);


// CUSTOM MAYBE FUNCTIONS

/**
 * `isMaybe :: a -> Bool`
 *
 * The `isMaybe` function returns `True` if its argument is a `Maybe`.
 */
export const isMaybe =
  (x: any): x is Maybe<any> =>
    typeof x === 'object' && x !== null && x.isJust || x === Nothing;

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
      (List.empty);

/**
 * `maybeToNullable :: Maybe a -> (a | Nullable)`
 *
 * The `maybeToNullable` function returns `null` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToNullable =
  <A extends Some> (m: Maybe<A>): A | null =>
    isJust (m) ? m .value : null;

/**
 * `maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b`
 *
 * The `maybe_` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 *
 * This is a lazy variant of `maybe`.
 */
export const maybe_ = <A extends Some, B extends Some> (def: () => B) => maybe<A, B> (def ());


// NAMESPACED FUNCTIONS

export const Maybe = {
  Just,
  Nothing,
  fromNullable,

  isJust,
  isNothing,
  fromJust,
  fromMaybe,

  fmap,
  mapReplace,

  pure,
  ap,

  alt,
  alt_,
  empty,
  guard,

  bind,
  bind_,
  then,
  mreturn,
  kleisli,
  join,
  liftM2,
  liftM3,
  liftM4,
  liftM5,

  foldr,
  foldl,
  toList,
  fnull,
  length,
  elem,
  elem_,
  sum,
  product,
  concat,
  concatMap,
  and,
  or,
  any,
  all,
  notElem,
  find,

  gt,
  lt,
  gte,
  lte,

  maybe,
  listToMaybe,
  maybeToList,
  catMaybes,
  mapMaybe,

  isMaybe,
  normalize,
  ensure,
  imapMaybe,
  maybeToNullable,
};


// TYPE HELPERS

export type MaybeContent<A> = A extends Maybe<infer I> ? I : never;

// tslint:disable-next-line:interface-over-type-literal
export type Some = {};
export type Nullable = null | undefined;

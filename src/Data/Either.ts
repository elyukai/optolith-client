/**
 * @module Data.Either
 *
 * The `Either` type represents values with two possibilities: a value of type
 * `Either a b` is either `Left a` or `Right b`.
 *
 * The `Either` type is sometimes used to represent a value which is either
 * correct or an error by convention, the `Left` constructor is used to hold an
 * error value and the `Right` constructor is used to hold a correct value
 * (mnemonic: "right" also means "correct").
 *
 * @author Lukas Obermann
 */

import * as ReResult from "./Ley_Result.gen"
import { List } from "./List"
import { Maybe } from "./Maybe"
import { Pair } from "./Tuple"
import { uncurryN } from "./Tuple/All"

export type Left<L> = { tag: "Error"; value: L }
export const Left = <L> (x: L): Left<L> => ({ tag: "Error", value: x })

export type Right<R> = { tag: "Ok"; value: R }
export const Right = <R> (x: R): Right<R> => ({ tag: "Ok", value: x })

export type Either<A, B> = Left<A> | Right<B>

export const isLeft = <L, R> (e: Either<L, R>): e is Left<L> => e.tag === "Error"
export const isRight = <L, R> (e: Either<L, R>): e is Right<R> => e.tag === "Ok"

/**
 * @module Data.Either.Extra
 *
 * This module extends `Data.Either` with extra operations, particularly to
 * quickly extract from inside an `Either`. Some of these operations are
 * partial, and should be used with care in production-quality code.
 *
 * @author Lukas Obermann
 * @see Data.Either
 */

/**
 * `fromLeft :: a -> Either a b -> a`
 *
 * Return the contents of a `Left`-value or a default value otherwise.
 *
 * `fromLeft 1 (Left 3) == 3`
 * `fromLeft 1 (Right "foo") == 1`
 */
export const fromLeft =
  <A>
  (def: A) =>
  (x: Either<A, any>): A =>
    ReResult.Extra_fromError (def, x)

/**
 * `fromRight :: b -> Either a b -> b`
 *
 *
 * Return the contents of a `Right`-value or a default value otherwise.
 *
 * `fromRight 1 (Right 3) == 3`
 * `fromRight 1 (Left "foo") == 1`
 */
export const fromRight =
  <B>
  (def: B) =>
  (x: Either<any, B>): B =>
    ReResult.Extra_fromOk (def, x)

/**
 * `fromEither :: Either a a -> a`
 *
 * Pull the value out of an `Either` where both alternatives have the same type.
 *
 * `\x -> fromEither (Left x ) == x`
 * `\x -> fromEither (Right x) == x`
 */
export const fromEither =
  <A>
  (x: Either<A, A>): A =>
    ReResult.Extra_fromResult (x)

/**
 * `fromLeft' :: Either l r -> l`
 *
 * The `fromLeft'` function extracts the element out of a `Left` and throws an
 * error if its argument is `Right`. Much like `fromJust`, using this function
 * in polished code is usually a bad idea.
 *
 * `\x -> fromLeft' (Left  x) == x`
 * `\x -> fromLeft' (Right x) == undefined`
 *
 * @throws TypeError
 */
export const fromLeft_ =
  <L>
  (x: Left<L>): L =>
    ReResult.Extra_fromError_ (x)

/**
 * `fromRight' :: Either l r -> r`
 *
 * The `fromRight'` function extracts the element out of a `Right` and throws an
 * error if its argument is `Left`. Much like `fromJust`, using this function
 * in polished code is usually a bad idea.
 *
 * `\x -> fromRight' (Right x) == x`
 * `\x -> fromRight' (Left  x) == undefined`
 *
 * @throws TypeError
 */
export const fromRight_ =
  <R>
  (x: Right<R>): R =>
    ReResult.Extra_fromOk_ (x)

/**
 * `eitherToMaybe :: Either a b -> Maybe b`
 *
 * Given an `Either`, convert it to a `Maybe`, where `Left` becomes `Nothing`.
 *
 * `\x -> eitherToMaybe (Left x) == Nothing`
 * `\x -> eitherToMaybe (Right x) == Just x`
 */
export const eitherToMaybe =
  <B>
  (x: Either<any, B>): Maybe<B> =>
    ReResult.Extra_resultToOption (x)

/**
 * `maybeToEither :: a -> Maybe b -> Either a b`
 *
 * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
 * the `Left` should the value be `Nothing`.
 *
 * `\a b -> maybeToEither a (Just b) == Right b`
 * `\a -> maybeToEither a Nothing == Left a`
 */
export const maybeToEither =
  <A>
  (left: A) =>
  <B> (x: Maybe<B>): Either<A, B> =>
    ReResult.Extra_optionToResult (left, x)

/**
 * `maybeToEither' :: (() -> a) -> Maybe b -> Either a b`
 *
 * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
 * the `Left` should the value be `Nothing`.
 *
 * `\a b -> maybeToEither a (Just b) == Right b`
 * `\a -> maybeToEither a Nothing == Left a`
 *
 * Lazy version of `maybeToEither`.
 */
export const maybeToEither_ =
  <A>
  (left: () => A) =>
  <B>
  (x: Maybe<B>): Either<A, B> =>
    ReResult.Extra_optionToResult_ (left, x)


// FUNCTOR

/**
 * `fmap :: (a -> b) -> f a -> f b`
 */
export const fmap =
  <A, B> (f: (x: A) => B) => <E> (x: Either<E, A>): Either<E, B> =>
    ReResult.Functor_fmap (f, x)

/**
 * `fmapF :: f a -> (a -> b) -> f b`
 */
export const fmapF =
  <E, A> (x: Either<E, A>) => <B> (f: (x: A) => B): Either<E, B> =>
    ReResult.Functor_fmap (f, x)


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> Either a c -> Either b d`
 */
export const bimap =
  <A, B>
  (fLeft: (l: A) => B) =>
  <C, D>
  (fRight: (r: C) => D) =>
  (x: Either<A, C>): Either<B, D> =>
    ReResult.Bifunctor_bimap (fLeft, fRight, x)

/**
 * `first :: (a -> b) -> Either a c -> Either b c`
 */
export const first =
  <A, B>
  (f: (l: A) => B) =>
  <C> (x: Either<A, C>): Either<B, C> =>
    ReResult.Bifunctor_first (f, x)

/**
 * `second :: (b -> c) -> Either a b -> Either a c`
 */
export const second =
  <B, C>
  (f: (r: B) => C) =>
  <A>
  (x: Either<A, B>): Either<A, C> =>
    ReResult.Bifunctor_second (f, x)


// APPLICATIVE

/**
 * `pure :: a -> Either e a`
 *
 * Lift a value.
 */
export const pure = Right

/**
 * `(<*>) :: Either e (a -> b) -> Either e a -> Either e b`
 *
 * Sequential application.
 */
export const ap =
  <E, A, B>
  (f: Either<E, (x: A) => B>) => (x: Either<E, A>): Either<E, B> =>
    ReResult.Applicative_ap (f, x)


// MONAD

/**
 * `(>>=) :: Either e a -> (a -> Either e b) -> Either e b`
 */
export const bind =
  <E, A>
  (x: Either<E, A>) =>
  <B>
  (f: (x: A) => Either<E, B>): Either<E, B> =>
    ReResult.Monad_bind (x, f)

/**
 * `(=<<) :: (a -> Either e b) -> Either e a -> Either e b`
 */
export const bindF =
  <E, A, B>
  (f: (x: A) => Either<E, B>) =>
  (x: Either<E, A>): Either<E, B> =>
    ReResult.Monad_bindF (f, x)

/**
 * `(>>) :: Either e a -> Either e b -> Either e b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  <E, B>
  (x: Either<E, any>) =>
  (y: Either<E, B>): Either<E, B> =>
    ReResult.Monad_then (x, y)

/**
 * `(>=>) :: (a -> Either e b) -> (b -> Either e c) -> a -> Either e c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <E, A, B, C>
  (f: (x: A) => Either<E, B>) =>
  (g: (x: B) => Either<E, C>) =>
  (x: A): Either<E, C> =>
    ReResult.Monad_kleisli (f, g, x)

/**
 * `join :: Either e (Either e a) -> Either e a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <E, A> (x: Either<E, Either<E, A>>): Either<E, A> =>
    ReResult.Monad_join (x)

/**
 * `mapM :: (a -> Either e b) -> [a] -> Either e [b]`
 *
 * `mapM f xs` takes a function and a list and maps the function over every
 * element in the list. If the function returns a `Left`, it is immediately
 * returned by the function. If `f` did not return any `Left`, the list of
 * unwrapped return values is returned as a `Right`. If `xs` is empty,
 * `Right []` is returned.
 */
export const mapM =
  <E, A, B>
  (f: (x: A) => Either<E, B>) =>
  (xs: List<A>): Either<E, List<B>> =>
    ReResult.Monad_mapM (f, xs)

/**
 * `liftM2 :: (a1 -> a2 -> r) -> Either e a1 -> Either e a2 -> Either e r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1, A2, B>
  (f: (a1: A1) => (a2: A2) => B) =>
  <E>
  (x1: Either<E, A1>) =>
  (x2: Either<E, A2>): Either<E, B> =>
    ReResult.Monad_liftM2 (uncurryN (f), x1, x2)

/**
 * `liftM2F :: Either e a1 -> Either e a2 -> (a1 -> a2 -> r) -> Either e r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 *
 * Flipped version of `liftM2`.
 */
export const liftM2F =
  <E, A1>
  (x1: Either<E, A1>) =>
  <A2>
  (x2: Either<E, A2>) =>
  <B>
  (f: (a1: A1) => (a2: A2) => B): Either<E, B> =>
    ReResult.Monad_liftM2 (uncurryN (f), x1, x2)


// FOLDABLE

/**
 * `foldr :: (a0 -> b -> b) -> b -> Either a a0 -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A0, B>
  (f: (x: A0) => (acc: B) => B) =>
  (initial: B) =>
  (x: Either<any, A0>): B =>
    ReResult.Foldable_foldr (uncurryN (f), initial, x)

/**
 * `foldl :: (b -> a0 -> b) -> b -> Either a a0 -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A0, B>
  (f: (acc: B) => (x: A0) => B) =>
  (initial: B) =>
  (x: Either<any, A0>): B =>
    ReResult.Foldable_foldl (uncurryN (f), initial, x)

/**
 * `toList :: Either a a0 -> [a0]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A0> (x: Either<any, A0>): List<A0> =>
    ReResult.Foldable_toList (x)

/**
 * `null :: Either a a0 -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = ReResult.Foldable_fnull

/**
 * `length :: Either a a0 -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (x: Either<any, any>): number => ReResult.Foldable_flength (x)

/**
 * `elem :: Eq a0 => a0 -> Either a a0 -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 */
export const elem =
  <A0> (x: A0) => (y: Either<any, A0>): boolean =>
    ReResult.Foldable_elem (x, y)

/**
 * `elemF :: Eq a0 => Either a a0 -> a0 -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 *
 * Flipped version of `elem`.
 */
export const elemF = <A> (y: Either<A, A>) => (x: A): boolean =>
  ReResult.Foldable_elem (x, y)

/**
 * `sum :: Num a => Either a a0 -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = ReResult.Foldable_sum

/**
 * `product :: Num a => Either a a0 -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = ReResult.Foldable_product

// Specialized folds

/**
 * `concat :: Either a [a0] -> [a0]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A0>(x: Either<any, List<A0>>): List<A0> =>
    ReResult.Foldable_concat (x)

/**
 * `concatMap :: (a0 -> [b]) -> Either a a0 -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A0, B> (f: (x: A0) => List<B>) => (x: Either<any, A0>): List<B> =>
    ReResult.Foldable_concatMap (f, x)

/**
 * `and :: Either a Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = ReResult.Foldable_and

/**
 * `or :: Either a Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = ReResult.Foldable_or

interface Any {

  /**
   * `any :: (a0 -> Bool) -> Either a a0 -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  <A, A1 extends A>
  (f: (x: A) => x is A1):
  (x: Either<any, A>) => x is Right<A1>

  /**
   * `any :: (a0 -> Bool) -> Either a a0 -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  <A>
  (f: (x: A) => boolean):
  (x: Either<any, A>) => x is Right<A>
}

/**
 * `any :: (a0 -> Bool) -> Either a a0 -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any: Any =
  <A0>(f: (x: A0) => boolean) => (x: Either<any, A0>): x is Right<A0> =>
    ReResult.Foldable_any (f, x)

/**
 * `all :: (a0 -> Bool) -> Either a a0 -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A0>(f: (x: A0) => boolean) => (x: Either<any, A0>): boolean =>
    ReResult.Foldable_all (f, x)

// Searches

/**
 * `notElem :: Eq a0 => a0 -> Either a a0 -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A0> (x: A0) => (y: Either<any, A0>): boolean =>
    ReResult.Foldable_notElem (x, y)

interface Find {

  /**
   * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (x: Either<any, A>) => Maybe<A1>

  /**
   * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (x: Either<any, A>) => Maybe<A>
}

/**
 * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A>
  (pred: (x: A) => boolean) =>
  (x: Either<any, A>): Maybe<A> =>
    ReResult.Foldable_find (pred, x)


// EITHER FUNCTIONS (PART 2)

/**
 * `either :: (a -> c) -> (b -> c) -> Either a b -> c`
 *
 * Case analysis for the `Either` type. If the value is `Left a`, apply the
 * first function to `a` if it is `Right b`, apply the second function to `b`.
 */
export const either =
  <A, C>
  (fLeft: (l: A) => C) =>
  <B>
  (fRight: (r: B) => C) =>
  (x: Either<A, B>): C =>
    ReResult.result (fLeft, fRight, x)

/**
 * `lefts :: [Either a b] -> [a]`
 *
 * Extracts from a list of `Either` all the `Left` elements. All the `Left`
 * elements are extracted in order.
 */
export const lefts =
  <A, B> (xs: List<Either<A, B>>): List<A> =>
    ReResult.errors (xs)

/**
 * `rights :: [Either a b] -> [b]`
 *
 * Extracts from a list of `Either` all the `Right` elements. All the `Right`
 * elements are extracted in order.
 */
export const rights =
  <A, B> (xs: List<Either<A, B>>): List<B> =>
    ReResult.oks (xs)

/**
 * `partitionEithers :: [Either a b] -> ([a], [b])`
 *
 * Partitions a list of `Either` into two lists. All the `Left` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Right` elements are extracted to the second component of the output.
 */
export const partitionEithers =
  <A, B> (xs: List<Either<A, B>>): Pair<List<A>, List<B>> =>
    ReResult.partitionResults (xs)


// CUSTOM FUNCTIONS


/**
 * `invertEither :: Either l r -> Either r l`
 *
 * Converts a `Left` into a `Right` and a `Right` into a `Left`.
 */
export const invertEither =
  <L, R> (x: Either<L, R>): Either<R, L> =>
    ReResult.swap (x)


// TYPE HELPERS

export type LeftI<A> = A extends Left<infer I> ? I : never
export type RightI<A> = A extends Right<infer I> ? I : never


// NAMESPACED FUNCTIONS

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Either = {
  Left,
  Right,

  fromLeft,
  fromRight,
  fromEither,
  fromLeft_,
  fromRight_,
  eitherToMaybe,
  maybeToEither,
  maybeToEither_,

  bimap,
  first,
  second,

  pure,
  ap,

  bind,
  bindF,
  then,
  kleisli,
  join,
  mapM,
  liftM2,

  foldr,
  foldl,
  toList,
  fnull,
  flength,
  elem,
  elemF,
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

  isLeft,
  isRight,
  either,
  lefts,
  rights,
  partitionEithers,

  invertEither,
}

import { pipe } from "ramda";
import { add, inc, max, min, multiply } from "../App/Utils/mathUtils";
import { not } from "../App/Utils/not";
import { empty, pure } from "../Control/Applicative";
import { Either, fromRight, isEither, isLeft, isRight, Left, Right } from "./Either";
import { equals } from "./Eq";
import { ident } from "./Function";
import { fmap } from "./Functor";
import { append, fromElements, isList, isNil, List, Nil, NonEmptyList } from "./List";
import { fromMaybe, fromNullable, isJust, isMaybe, isNothing, Just, Maybe, Nothing } from "./Maybe";
import { isOrderedMap, OrderedMap } from "./OrderedMap";
import { isOrderedSet, OrderedSet } from "./OrderedSet";
import { fromBinary, Pair } from "./Pair";
import { showP } from "./Show";

export type Foldable<A> = Either<any, A>
                        | List<A>
                        | Maybe<A>
                        | OrderedMap<any, A>
                        | OrderedSet<A>

export type NonEmptyFoldable<A> = Right<A>
                                | NonEmptyList<A>
                                | Just<A>
                                | OrderedMap<any, A>
                                | OrderedSet<A>

/**
 * `foldr :: (a -> b -> b) -> b -> t a -> b`
 *
 * Right-associative fold of a structure.
 *
 * In the case of lists, `foldr`, when applied to a binary operator, a
 * starting value (typically the right-identity of the operator), and a list,
 * reduces the list using the binary operator, from right to left:
 *
 * ```foldr f z [x1, x2, ..., xn] == x1 `f` (x2 `f` ... (xn `f` z)...)```
 */
export const foldr =
  <A, B>
  (f: (x: A) => (acc: B) => B) =>
  (initial: B) =>
  (x: Foldable<A>): B => {
    if (isList (x)) {
      return isNil (x) ? initial : f (x .x) (foldr (f) (initial) (x .xs))
    }

    if (isOrderedMap (x)) {
      return [...x .value]
        .reduceRight<B> ((acc, e) => f (e [1]) (acc), initial)
    }

    if (isOrderedSet (x)) {
      return [...x .value] .reduceRight<B> ((acc, e) => f (e) (acc), initial)
    }

    if (isEither (x)) {
      return isRight (x) ? f (x .value) (initial) : initial
    }

    if (isMaybe (x)) {
      return isJust (x) ? f (x .value) (initial) : initial
    }

    throw new TypeError (instanceErrorMsg ("foldr") (x))
  }

/**
 * `foldl :: (b -> a -> b) -> b -> t a -> b`
 *
 * Left-associative fold of a structure.
 *
 * In the case of lists, foldl, when applied to a binary operator, a starting
 * value (typically the left-identity of the operator), and a list, reduces
 * the list using the binary operator, from left to right:
 *
 * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
 */
export const foldl =
  <A, B>
  (f: (acc: B) => (x: A) => B) =>
  (initial: B) =>
  (x: Foldable<A>): B => {
    if (isList (x)) {
      return isNil (x) ? initial : foldl (f) (f (initial) (x .x)) (x .xs)
    }

    if (isOrderedMap (x)) {
      return [...x .value] .reduce<B> ((acc, e) => f (acc) (e [1]), initial)
    }

    if (isOrderedSet (x)) {
      return [...x .value] .reduce<B> ((acc, e) => f (acc) (e), initial)
    }

    if (isEither (x)) {
      return isRight (x) ? f (initial) (x .value) : initial
    }

    if (isMaybe (x)) {
      return isJust (x) ? f (initial) (x .value) : initial
    }

    throw new TypeError (instanceErrorMsg ("foldl") (x))
  }

/**
 * `foldr1 :: (a -> a -> a) -> t a -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A>
  (f: (x: A) => (acc: A) => A) =>
  (x: NonEmptyFoldable<A>): A => {
    if (isList (x)) {
      if (!isNil (x)) {
        return foldr1ListS (f) (x)
      }

      throw new TypeError (emptyErrorMsg ("foldr1") (x))
    }

    if (isOrderedMap (x)) {
      if (x .value .size > 0) {
        const arr = [...x .value]
        const _init = arr .slice (0, -1)
        const _last = arr [arr .length - 1]

        return _init .reduceRight<A> ((acc, e) => f (e [1]) (acc), _last [1])
      }

      throw new TypeError (emptyErrorMsg ("foldr1") (x))
    }

    if (isOrderedSet (x)) {
      if (x .value .size > 0) {
        const arr = [...x .value]
        const _init = arr .slice (0, -1)
        const _last = arr [arr .length - 1]

        return _init .reduceRight<A> ((acc, e) => f (e) (acc), _last)
      }

      throw new TypeError (emptyErrorMsg ("foldr1") (x))
    }

    if (isEither (x)) {
      if (isRight (x)) {
        return x .value
      }

      throw new TypeError (emptyErrorMsg ("foldr1") (x))
    }

    if (isMaybe (x)) {
      if (isJust (x)) {
        return x .value
      }

      throw new TypeError (emptyErrorMsg ("foldr1") (x))
    }

    throw new TypeError (instanceErrorMsg ("foldr1") (x))
  }

const foldr1ListS =
  <A> (f: (x: A) => (acc: A) => A) => (xs: NonEmptyList<A>): A =>
    isNil (xs .xs)
    ? xs .x
    : f (xs .x) (foldr1ListS (f) (xs .xs))

/**
 * `foldl1 :: (a -> a -> a) -> t a -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A>
  (f: (acc: A) => (x: A) => A) =>
  (x: NonEmptyFoldable<A>): A => {
    if (isList (x)) {
      if (!isNil (x)) {
        return foldl1ListS (f) (x .xs) (x .x)
      }

      throw new TypeError (emptyErrorMsg ("foldl1") (x))
    }

    if (isOrderedMap (x)) {
      if (x .value .size > 0) {
        const [_head, ..._tail] = x

        return _tail .reduce<A> ((acc, e) => f (acc) (e [1]), _head [1])
      }

      throw new TypeError (emptyErrorMsg ("foldl1") (x))
    }

    if (isOrderedSet (x)) {
      if (x .value .size > 0) {
        const [_head, ..._tail] = x

        return _tail .reduce<A> ((acc, e) => f (acc) (e), _head)
      }

      throw new TypeError (emptyErrorMsg ("foldl1") (x))
    }

    if (isEither (x)) {
      if (isRight (x)) {
        return x .value
      }

      throw new TypeError (emptyErrorMsg ("foldl1") (x))
    }

    if (isMaybe (x)) {
      if (isJust (x)) {
        return x .value
      }

      throw new TypeError (emptyErrorMsg ("foldl1") (x))
    }

    throw new TypeError (instanceErrorMsg ("foldl1") (x))
  }

const foldl1ListS =
  <A>
  (f: (acc: A) => (x: A) => A) =>
  (xs: List<A>) =>
  (acc: A): A =>
    isNil (xs) ? acc : foldl1ListS (f) (xs .xs) (f (acc) (xs .x))

interface FoldableToList {
  <A> (x: Either<any, A> | List<A> | Maybe<A> | OrderedSet<A>): List<A>
  <K, A> (x: OrderedMap<K, A>): List<Pair<K, A>>
}

/**
 * `toList :: t a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList: FoldableToList =
  <A> (x: Foldable<A>): List<A> => {
    if (isList (x)) {
      return x
    }

    if (isOrderedMap (x)) {
      return List.fromArray (
        [...x .value] .map (([k, a]) => fromBinary (k, a))
      ) as List<A>
    }

    if (isOrderedSet (x)) {
      return fromElements (...x)
    }

    if (isEither (x)) {
      return isRight (x) ? pure ("List") (x .value) : empty ("List")
    }

    if (isMaybe (x)) {
      return isJust (x) ? pure ("List") (x .value) : empty ("List")
    }

    throw new TypeError (instanceErrorMsg ("toList") (x))
  }

interface FoldableNull {
  <A> (x: Either<A, any>): x is Left<A>
  <A> (xs: List<A>): xs is Nil
  <A> (x: Maybe<A>): x is Nothing
  <K, A> (x: OrderedMap<K, A>): boolean
  <A> (x: OrderedSet<A>): boolean
}

/**
 * `null :: t a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull: FoldableNull =
  (x: Foldable<any>): x is any => {
    if (isList (x)) {
      return isNil (x)
    }

    if (isOrderedMap (x)) {
      return x .value .size === 0
    }

    if (isOrderedSet (x)) {
      return x .value .size === 0
    }

    if (isEither (x)) {
      return isLeft (x)
    }

    if (isMaybe (x)) {
      return isNothing (x)
    }

    throw new TypeError (instanceErrorMsg ("null") (x))
  }

/**
 * `length :: t a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length =
  (x: Foldable<any>): number => {
    if (isList (x)) {
      return foldr<any, number> (() => inc) (0) (x)
    }

    if (isOrderedMap (x)) {
      return x .value .size
    }

    if (isOrderedSet (x)) {
      return x .value .size
    }

    if (isEither (x)) {
      return isRight (x) ? 1 : 0
    }

    if (isMaybe (x)) {
      return isJust (x) ? 1 : 0
    }

    throw new TypeError (instanceErrorMsg ("length") (x))
  }

/**
 * `elem :: Eq a => a -> t a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A> (e: A) => (x: Foldable<A>): boolean => {
    if (isList (x)) {
      return isNil (x) ? false : equals (e) (x .x) || elem (e) (x .xs)
    }

    if (isOrderedMap (x)) {
      return [...x .value .values ()] .some (equals (e))
    }

    if (isOrderedSet (x)) {
      return [...x .value] .some (equals (e))
    }

    if (isEither (x)) {
      return isRight (x) && equals (e) (x .value)
    }

    if (isMaybe (x)) {
      return isJust (x) && equals (e) (x .value)
    }

    throw new TypeError (instanceErrorMsg ("elem") (x))
  }

/**
 * `elemF :: Eq a => t a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF = <A> (xs: Foldable<A>) => (x: A): boolean => elem (x) (xs)

/**
 * `sum :: Num a => t a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = foldr (add) (0)

/**
 * `product :: Num a => t a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = foldr (multiply) (1)

/**
 * `maximum :: Ord a => t a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = foldr (max) (-Infinity)

/**
 * `minimum :: Ord a => t a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = foldr (min) (Infinity)

// Specialized folds

/**
 * `concat :: Foldable t => t [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A> (x: Foldable<List<A>>): List<A> =>
    foldr<List<A>, List<A>> (append) (empty ("List")) (x)

/**
 * `concatMap :: Foldable t => (a -> [b]) -> t a -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A, B> (f: (x: A) => List<B>) =>
    foldr<A, List<B>> (pipe (f, append)) (empty ("List"))

/**
 * `and :: Foldable t => t Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite. `False`, however, results from a
 * `False` value finitely far from the left end.
 *
 * ```haskell
 * and Nothing = true
 * and Just x  = x
 * ```
 */
export const and =
  (x: Foldable<boolean>): boolean => {
    if (isList (x)) {
      return isNil (x) ? true : x .x && and (x .xs)
    }

    if (isOrderedMap (x)) {
      return [...x .value .values ()] .every (ident)
    }

    if (isOrderedSet (x)) {
      return [...x .value] .every (ident)
    }

    if (isEither (x)) {
      return fromRight (true) (x)
    }

    if (isMaybe (x)) {
      return fromMaybe (true) (x)
    }

    throw new TypeError (instanceErrorMsg ("and") (x))
  }

/**
 * `or :: Foldable t => t Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite. `True`, however, results from a
 * `True` value finitely far from the left end.
 *
 * ```haskell
 * or Nothing = false
 * or Just x  = x
 * ```
 */
export const or =
  (x: Foldable<boolean>): boolean => {
    if (isList (x)) {
      return isNil (x) ? false : x .x || or (x .xs)
    }

    if (isOrderedMap (x)) {
      return [...x .value .values ()] .some (ident)
    }

    if (isOrderedSet (x)) {
      return [...x .value] .some (ident)
    }

    if (isEither (x)) {
      return fromRight (false) (x)
    }

    if (isMaybe (x)) {
      return fromMaybe (false) (x)
    }

    throw new TypeError (instanceErrorMsg ("or") (x))
  }

/**
 * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (x: Foldable<A>): boolean => {
    if (isList (x)) {
      return isNil (x) ? false : f (x .x) || any (f) (x .xs)
    }

    if (isOrderedMap (x)) {
      return [...x .value .values ()] .some (f)
    }

    if (isOrderedSet (x)) {
      return [...x .value] .some (f)
    }

    if (isEither (x)) {
      return fromRight (false) (fmap (f) (x))
    }

    if (isMaybe (x)) {
      return fromMaybe (false) (fmap (f) (x))
    }

    throw new TypeError (instanceErrorMsg ("any") (x))
  }

/**
 * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (x: Foldable<A>): boolean => {
    if (isList (x)) {
      return isNil (x) ? true : f (x .x) && all (f) (x .xs)
    }

    if (isOrderedMap (x)) {
      return [...x .value .values ()] .every (f)
    }

    if (isOrderedSet (x)) {
      return [...x .value] .every (f)
    }

    if (isEither (x)) {
      return fromRight (true) (fmap (f) (x))
    }

    if (isMaybe (x)) {
      return fromMaybe (true) (fmap (f) (x))
    }

    throw new TypeError (instanceErrorMsg ("all") (x))
  }

// Searches

/**
 * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (e: A) => pipe (elem (e), not)

/**
 * `notElemF :: (Foldable t, Eq a) => a -> t a -> Bool`
 *
 * `notElemF` is the negation of `elem_`.
 *
 * `notElemF` is the same as `notElem` but with arguments flipped.
 */
export const notElemF = <A> (x: Foldable<A>) => (e: A) => notElem (e) (x)

interface Find {
  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (x: Foldable<A>) => Maybe<A1>

  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (x: Foldable<A>) => Maybe<A>
}

/**
 * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (x: Foldable<A>): Maybe<A> => {
    if (isList (x)) {
      return isNil (x) ? Nothing : pred (x .x) ? Just (x .x) : find (pred) (x .xs)
    }

    if (isOrderedMap (x)) {
      return fromNullable ([...x .value .values ()] .find (pred))
    }

    if (isOrderedSet (x)) {
      return fromNullable ([...x .value] .find (pred))
    }

    if (isEither (x)) {
      return isRight (x) && pred (x .value) ? Just (x .value) : Nothing
    }

    if (isMaybe (x)) {
      return isJust (x) && pred (x .value) ? x : Nothing
    }

    throw new TypeError (instanceErrorMsg ("all") (x))
  }

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Foldable\n${showP (x)}`

const emptyErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: empty structure\n${showP (x)}`

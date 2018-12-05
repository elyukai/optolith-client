/**
 * @module Folable
 *
 * Provides generalized functions on the `Foldable` typeclass for data
 * structures, e.g. `Maybe` or `List`.
 *
 * @author Lukas Obermann
 */

import * as Either from './Either';
import * as List from './List.new';
import * as Maybe from './Maybe.new';

// /**
//  * `foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b`
//  *
//  * Right-associative fold of a structure.
//  *
//  * In the case of lists, `foldr`, when applied to a binary operator, a
//  * starting value (typically the right-identity of the operator), and a list,
//  * reduces the list using the binary operator, from right to left:
//  *
//  * ```foldr f z [x1, x2, ..., xn] == x1 `f` (x2 `f` ... (xn `f` z)...)```
//  */
// export const foldr =
//   <A extends Some, B extends Some>
//   (f: (current: A) => (acc: B) => B) =>
//   (initial: B) =>
//   (xs: List<A>): B =>
//     xs [LIST] .reduceRight<B> ((acc, e) => f (e) (acc), initial);

/**
 * `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
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
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: Maybe.Maybe<A> | List.List<A>): B => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.foldl<A, B> (f) (initial) (xs);
    }

    if (Either.isEither (xs)) {
      return Either.foldl<A, B> (f) (initial) (xs);
    }

    return List.foldl<A, B> (f) (initial) (xs);
  };

// /**
//  * `foldr1 :: (a -> a -> a) -> t a -> a`
//  *
//  * A variant of `foldr` that has no base case, and thus may only be applied to
//  * non-empty structures.
//  *
//  * `foldr1 f = foldr1 f . toList`
//  */
// export const foldr1 =
//   <A extends Some>
//   (f: (current: A) => (acc: A) => A) =>
//   (xs: List<A>): A => {
//     if (xs [LIST] .length > 0) {
//       const _init = xs [LIST] .slice (0, -1);
//       const _last = xs [LIST] [xs [LIST] .length - 1];

//       return _init .reduceRight<A> ((acc, e) => f (e) (acc), _last);
//     }

//     throw new TypeError ('Cannot apply foldr1 to an empty list.');
//   };

// /**
//  * `foldl1 :: (a -> a -> a) -> t a -> a`
//  *
//  * A variant of `foldl` that has no base case, and thus may only be applied to
//  * non-empty structures.
//  *
//  * `foldl1 f = foldl1 f . toList`
//  */
// export const foldl1 =
//   <A extends Some>
//   (f: (acc: A) => (current: A) => A) =>
//   (xs: List<A>): A => {
//     if (xs [LIST] .length > 0) {
//       const [_head, ..._tail] = xs;

//       return _tail .reduce<A> ((acc, e) => f (acc) (e), _head);
//     }

//     throw new TypeError ('Cannot apply foldl1 to an empty list.');
//   };

/**
 * `toList :: t a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A extends Maybe.Some>(xs: List.List<A> | Maybe.Maybe<A>): List.List<A> => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.toList<A> (xs);
    }

    return List.toList<A> (xs);
  };

/**
 * `null :: t a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull =
  (xs: List.List<any> | Maybe.Maybe<Maybe.Some>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.fnull (xs);
    }

    return List.fnull (xs);
  };

/**
 * `length :: t a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length =
  (xs: List.List<any> | Maybe.Maybe<Maybe.Some>): number => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.length (xs);
    }

    return List.length (xs);
  };

/**
 * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A extends Maybe.Some>
  (e: A) =>
  (xs: List.List<A> | Maybe.Maybe<A> | Either.Either<A, A>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.elem<A> (e) (xs);
    }

    if (Either.isEither (xs)) {
      return Either.elem<A> (e) (xs);
    }

    return List.elem<A> (e) (xs);
  };

/**
 * `elem_ :: (Foldable t, Eq a) => t a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Same as `List.elem` but with arguments switched.
 */
export const elem_ =
  <A extends Maybe.Some>
  (xs: List.List<A> | Maybe.Maybe<A> | Either.Either<A, A>) =>
  (e: A): boolean =>
    elem (e) (xs);

/**
 * `sum :: (Foldable t, Num a) => t a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum =
  (xs: List.List<number> | Maybe.Maybe<number>): number => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.sum (xs);
    }

    return List.sum (xs);
  };

/**
 * `product :: (Foldable t, Num a) => t a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product =
  (xs: List.List<number> | Maybe.Maybe<number>): number => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.product (xs);
    }

    return List.product (xs);
  };

// /**
//  * `maximum :: forall a. (Foldable t, Ord a) => t a -> a`
//  *
//  * The largest element of a non-empty structure.
//  */
// export const maximum = (xs: List.List<number>): number => Math.max (...xs);

// /**
//  * `minimum :: forall a. (Foldable t, Ord a) => t a -> a`
//  *
//  * The least element of a non-empty structure.
//  */
// export const minimum = (xs: List.List<number>): number => Math.min (...xs);

// Specialized folds

/**
 * `concat :: Foldable t => t [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A extends Maybe.Some>(xs: List.List<List.List<A>> | Maybe.Maybe<List.List<A>>): List.List<A> => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.concat (xs);
    }

    return List.concat (xs);
  };;

/**
 * `concatMap :: Foldable t => (a -> [b]) -> t a -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A extends Maybe.Some, B extends Maybe.Some>
  (f: (x: A) => List.List<B>) =>
  (xs: List.List<A> | Maybe.Maybe<A>): List.List<B> => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.concatMap<A, B> (f) (xs);
    }

    return List.concatMap<A, B> (f) (xs);
  };

/**
 * `and :: Foldable t => t Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite; `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and =
  (xs: List.List<boolean> | Maybe.Maybe<boolean>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.and (xs);
    }

    return List.and (xs);
  };

/**
 * `or :: Foldable t => t Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite; `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or =
  (xs: List.List<boolean> | Maybe.Maybe<boolean>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.or (xs);
    }

    return List.or (xs);
  };

/**
 * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Maybe.Some>(f: (x: A) => boolean) => (xs: List.List<A> | Maybe.Maybe<A>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.any<A> (f) (xs);
    }

    return List.any<A> (f) (xs);
  };

/**
 * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Maybe.Some>(f: (x: A) => boolean) => (xs: List.List<A> | Maybe.Maybe<A>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.all<A> (f) (xs);
    }

    return List.all<A> (f) (xs);
  };

// Searches

/**
 * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A extends Maybe.Some>
  (e: A) =>
  (xs: List.List<A> | Maybe.Maybe<A> | Either.Either<A, A>): boolean => {
    if (Maybe.isMaybe (xs)) {
      return Maybe.notElem<A> (e) (xs);
    }

    if (Either.isEither (xs)) {
      return Either.notElem<A> (e) (xs);
    }

    return List.notElem<A> (e) (xs);
  };

// interface Find {
//   /**
//    * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   <A, A1 extends A> (pred: (x: A) => x is A1): (xs: List.List<A>) => Maybe.Maybe<A1>;
//   /**
//    * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   <A> (pred: (x: A) => boolean): (xs: List.List<A>) => Maybe.Maybe<A>;
// }

// /**
//  * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//  *
//  * The `find` function takes a predicate and a structure and returns the
//  * leftmost element of the structure matching the predicate, or `Nothing` if
//  * there is no such element.
//  */
// export const find: Find =
//   <A> (pred: (x: A) => boolean) => (xs: List.List<A>): Maybe.Maybe<A> =>
//     fromNullable (xs [LIST] .find (pred));

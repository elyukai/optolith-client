/**
 * @module Data.Set
 *
 * A `Set` is a structure for storing unique values.
 *
 * @author Lukas Obermann
 */

import * as ReIntSet from "./Ley_IntSet.gen"
import * as ReList from "./Ley_List.gen"
import { List } from "./List"
import { Maybe } from "./Maybe"
import { uncurryN } from "./Tuple/All"

// CONSTRUCTOR

export type Key = number

export type IntSet = ReIntSet.IntSet


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Set a -> b`
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
  <A>
  (f: (current: Key) => (acc: A) => A) =>
  (initial: A) =>
  (xs: IntSet): A =>
    ReIntSet.Foldable_foldr (uncurryN (f), initial, xs)

/**
 * `foldl :: (b -> a -> b) -> b -> Set a -> b`
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
  <A>
  (f: (acc: A) => (current: Key) => A) =>
  (initial: A) =>
  (xs: IntSet): A =>
    ReIntSet.Foldable_foldl (uncurryN (f), initial, xs)

/**
 * `toList :: Set a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = (xs: IntSet): List<Key> => ReIntSet.Foldable_toList (xs)

/**
 * `null :: Set a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: IntSet): boolean => ReIntSet.Foldable_fnull (xs)

/**
 * `length :: Set a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (xs: IntSet): number => ReIntSet.Foldable_flength (xs)

/**
 * `elem :: Eq a => a -> Set a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  (e: Key) => (xs: IntSet): boolean =>
    ReIntSet.Foldable_elem (e, xs)

/**
 * `elemF :: Eq a => Set a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF =
  (xs: IntSet) => (e: Key): boolean => ReIntSet.Foldable_elem (e, xs)

/**
 * `sum :: Num a => Set a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = ReIntSet.Foldable_sum

/**
 * `product :: Num a => Set a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = ReIntSet.Foldable_product

/**
 * `maximum :: Ord a => Set a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = ReIntSet.Foldable_maximum

/**
 * `minimum :: Ord a => Set a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = ReIntSet.Foldable_minimum

// Specialized folds

/**
 * `concatMap :: (a -> Set b) -> Set a -> Set b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  (f: (value: Key) => IntSet) =>
  (xs: IntSet): IntSet =>
    ReIntSet.Foldable_concatMap (f, xs)

/**
 * `any :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  (f: (x: Key) => boolean) => (xs: IntSet): boolean =>
    ReIntSet.Foldable_any (f, xs)

/**
 * `all :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  (f: (x: Key) => boolean) => (xs: IntSet): boolean =>
    ReIntSet.Foldable_all (f, xs)

// Searches

/**
 * `notElem :: Eq a => a -> Set a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = (e: Key) => (xs: IntSet) => ReIntSet.Foldable_notElem (e, xs)

/**
 * `find :: (a -> Bool) -> Set a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find =
  (pred: (x: Key) => boolean) => (xs: IntSet): Maybe<Key> =>
    ReIntSet.Foldable_find (pred, xs)


// CONSTRUCTION

/**
 * `empty :: Set a`
 *
 * The empty `Set`.
 */
export const { empty } = ReIntSet

/**
 * `singleton :: a -> Set a`
 *
 * Create a singleton set.
 */
// eslint-disable-next-line @typescript-eslint/no-use-before-define
export const singleton = (x: Key) => ReIntSet.singleton (x)

/**
 * `fromList :: [a] -> Set a`
 *
 * Create a set from a list of elements.
 */
export const fromList = (xs: List<Key>): IntSet =>
  ReIntSet.fromList (xs)


// INSERTION

/**
 * `insert :: Ord a => a -> Set a -> Set a`
 *
 * Insert an element in a set. If the set already contains an element equal to
 * the given value, it is replaced with the new value.
 */
export const insert =
  (x: Key) => (xs: IntSet): IntSet =>
    ReIntSet.insert (x, xs)

export type insert<A> = (x: A) => (s: IntSet) => IntSet


// DELETION

/**
 * `delete :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set.
 */
export const sdelete =
  (x: Key) => (xs: IntSet): IntSet =>
    ReIntSet.sdelete (x, xs)


// QUERY

/**
 * `member :: Ord a => a -> Set a -> Bool`
 *
 * Is the element in the set?
 */
// eslint-disable-next-line prefer-destructuring
export const member = ReIntSet.member

/**
 * `notMember :: Ord k => k -> Set a -> Bool`
 *
 * Is the element not in the set?
 */
// eslint-disable-next-line prefer-destructuring
export const notMember = ReIntSet.notMember

/**
 * `size :: Set a -> Int`
 *
 * The number of elements in the set.
 */
// eslint-disable-next-line prefer-destructuring
export const size = ReIntSet.size


// COMBINE

/**
 * `union :: Ord a => Set a -> Set a -> Set a`
 *
 * The union of two sets, preferring the first set when equal elements are
 * encountered.
 */
export const union =
  (xs1: IntSet) => (xs2: IntSet): IntSet =>
    ReIntSet.union (xs1, xs2)

/**
 * `difference :: Ord a => Set a -> Set a -> Set a`
 *
 * Difference of two sets.
 *
 * ```haskell
 * difference (Set (1, 2, 3, 4)) (Set (2, 4, 6, 8)) == Set (1, 3)
 * ```
 */
export const difference =
  (xs: IntSet) => (excludes: IntSet): IntSet =>
    ReIntSet.difference (xs, excludes)

/**
 * `differenceF :: Ord a => Set a -> Set a -> Set a`
 *
 * Difference of two sets.
 *
 * ```haskell
 * difference (Set (1, 2, 3, 4)) (Set (2, 4, 6, 8)) == Set (1, 3)
 * ```
 *
 * Flipped version of `difference`.
 */
export const differenceF =
  (excludes: IntSet) => (xs: IntSet): IntSet =>
    ReIntSet.difference (xs, excludes)


// FILTER

/**
 * `filter :: (a -> Bool) -> Set a -> Set a`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter =
  (pred: (x: Key) => boolean) => (xs: IntSet): IntSet =>
    ReIntSet.filter (pred, xs)


// MAP

/**
 * `map :: Ord b => (a -> b) -> Set a -> Set b`
 *
 * `map f s` is the set obtained by applying `f` to each element of `s`.
 *
 * It's worth noting that the size of the result may be smaller if, for some
 * `(x,y), x /= y && f x == f y`.
 */
export const map =
  (f: (value: Key) => Key) => (xs: IntSet): IntSet =>
    ReIntSet.map (f, xs)


// CONVERSION LIST

/**
 * `elems :: Set a -> [a]`
 *
 * An alias of toAscList. The elements of a set in ascending order. Subject to
 * list fusion.
 */
// eslint-disable-next-line prefer-destructuring
export const elems = ReIntSet.elems


// CUSTOM FUNCTIONS

/**
 * Converts the `OrderedSet` into a native array instance.
 */
export const toArray = (xs: IntSet): Key[] => ReList.listToArray (ReIntSet.elems (xs))

/**
 * `toggle :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set if the value already exists in the set.
 * Otherwise, insert the element in the set.
 */
export const toggle =
  (x: Key) => (xs: IntSet): IntSet =>
    ReIntSet.toggle (x, xs)

/**
 * `fromArray :: Array a -> Set a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const fromArray = (xs: Key[]): IntSet => ReIntSet.fromList (ReList.arrayToList (xs))


// NAMESPACED FUNCTIONS

export const OrderedSet = {
  fromArray,

  foldr,
  foldl,
  toList,
  fnull,
  flength,
  elem,
  elemF,
  sum,
  product,
  maximum,
  minimum,
  concatMap,
  any,
  all,
  notElem,
  find,

  empty,
  singleton,
  fromList,

  insert,

  sdelete,

  member,
  notMember,
  size,

  union,
  difference,
  differenceF,

  filter,

  map,

  elems,

  toArray,
  toggle,
}

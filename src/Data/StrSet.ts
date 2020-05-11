/**
 * @module Data.Set
 *
 * A `Set` is a structure for storing unique values.
 *
 * @author Lukas Obermann
 */

import * as ReList from "./Ley_List.gen"
import * as ReStrSet from "./Ley_StrSet.gen"
import { List } from "./List"
import { Maybe } from "./Maybe"
import { uncurryN } from "./Tuple/All"

// CONSTRUCTOR

export type Key = string

export type StrSet = ReStrSet.StrSet


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
  (xs: StrSet): A =>
    ReStrSet.Foldable_foldr (uncurryN (f), initial, xs)

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
  (xs: StrSet): A =>
    ReStrSet.Foldable_foldl (uncurryN (f), initial, xs)

/**
 * `toList :: Set a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = (xs: StrSet): List<Key> => ReStrSet.Foldable_toList (xs)

/**
 * `null :: Set a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: StrSet): boolean => ReStrSet.Foldable_fnull (xs)

/**
 * `length :: Set a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (xs: StrSet): number => ReStrSet.Foldable_flength (xs)

/**
 * `elem :: Eq a => a -> Set a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  (e: Key) => (xs: StrSet): boolean =>
    ReStrSet.Foldable_elem (e, xs)

/**
 * `elemF :: Eq a => Set a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF =
  (xs: StrSet) => (e: Key): boolean => ReStrSet.Foldable_elem (e, xs)

// Specialized folds

/**
 * `concatMap :: (a -> Set b) -> Set a -> Set b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  (f: (value: Key) => StrSet) =>
  (xs: StrSet): StrSet =>
    ReStrSet.Foldable_concatMap (f, xs)

/**
 * `any :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  (f: (x: Key) => boolean) => (xs: StrSet): boolean =>
    ReStrSet.Foldable_any (f, xs)

/**
 * `all :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  (f: (x: Key) => boolean) => (xs: StrSet): boolean =>
    ReStrSet.Foldable_all (f, xs)

// Searches

/**
 * `notElem :: Eq a => a -> Set a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = (e: Key) => (xs: StrSet) => ReStrSet.Foldable_notElem (e, xs)

/**
 * `find :: (a -> Bool) -> Set a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find =
  (pred: (x: Key) => boolean) => (xs: StrSet): Maybe<Key> =>
    ReStrSet.Foldable_find (pred, xs)


// CONSTRUCTION

/**
 * `empty :: Set a`
 *
 * The empty `Set`.
 */
export const { empty } = ReStrSet

/**
 * `singleton :: a -> Set a`
 *
 * Create a singleton set.
 */
// eslint-disable-next-line @typescript-eslint/no-use-before-define
export const singleton = (x: Key) => ReStrSet.singleton (x)

/**
 * `fromList :: [a] -> Set a`
 *
 * Create a set from a list of elements.
 */
export const fromList = (xs: List<Key>): StrSet =>
  ReStrSet.fromList (xs)


// INSERTION

/**
 * `insert :: Ord a => a -> Set a -> Set a`
 *
 * Insert an element in a set. If the set already contains an element equal to
 * the given value, it is replaced with the new value.
 */
export const insert =
  (x: Key) => (xs: StrSet): StrSet =>
    ReStrSet.insert (x, xs)

export type insert<A> = (x: A) => (s: StrSet) => StrSet


// DELETION

/**
 * `delete :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set.
 */
export const sdelete =
  (x: Key) => (xs: StrSet): StrSet =>
    ReStrSet.sdelete (x, xs)


// QUERY

/**
 * `member :: Ord a => a -> Set a -> Bool`
 *
 * Is the element in the set?
 */
// eslint-disable-next-line prefer-destructuring
export const member = ReStrSet.member

/**
 * `notMember :: Ord k => k -> Set a -> Bool`
 *
 * Is the element not in the set?
 */
// eslint-disable-next-line prefer-destructuring
export const notMember = ReStrSet.notMember

/**
 * `size :: Set a -> Int`
 *
 * The number of elements in the set.
 */
// eslint-disable-next-line prefer-destructuring
export const size = ReStrSet.size


// COMBINE

/**
 * `union :: Ord a => Set a -> Set a -> Set a`
 *
 * The union of two sets, preferring the first set when equal elements are
 * encountered.
 */
export const union =
  (xs1: StrSet) => (xs2: StrSet): StrSet =>
    ReStrSet.union (xs1, xs2)

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
  (xs: StrSet) => (excludes: StrSet): StrSet =>
    ReStrSet.difference (xs, excludes)

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
  (excludes: StrSet) => (xs: StrSet): StrSet =>
    ReStrSet.difference (xs, excludes)


// FILTER

/**
 * `filter :: (a -> Bool) -> Set a -> Set a`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter =
  (pred: (x: Key) => boolean) => (xs: StrSet): StrSet =>
    ReStrSet.filter (pred, xs)


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
  (f: (value: Key) => Key) => (xs: StrSet): StrSet =>
    ReStrSet.map (f, xs)


// CONVERSION LIST

/**
 * `elems :: Set a -> [a]`
 *
 * An alias of toAscList. The elements of a set in ascending order. Subject to
 * list fusion.
 */
// eslint-disable-next-line prefer-destructuring
export const elems = ReStrSet.elems


// CUSTOM FUNCTIONS

/**
 * Converts the `OrderedSet` into a native array instance.
 */
export const toArray = (xs: StrSet): Key[] => ReList.listToArray (ReStrSet.elems (xs))

/**
 * `toggle :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set if the value already exists in the set.
 * Otherwise, insert the element in the set.
 */
export const toggle =
  (x: Key) => (xs: StrSet): StrSet =>
    ReStrSet.toggle (x, xs)

/**
 * `fromArray :: Array a -> Set a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const fromArray = (xs: Key[]): StrSet => ReStrSet.fromList (ReList.arrayToList (xs))


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

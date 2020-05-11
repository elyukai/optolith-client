/**
 * @module Data.Map
 *
 * A map is a data structure for storing values of the same type by keys of the
 * same type. Keys and values do not need to have the same type.
 *
 * @author Lukas Obermann
 */

import { t } from "../shims/IntMap.shim"
import { Either } from "./Either"
import * as ReIntMap from "./Ley_IntMap.gen"
import * as ReOption from "./Ley_Option.gen"
import { List } from "./List"
import { bind, Maybe } from "./Maybe"
import { Pair } from "./Tuple"
import { uncurryN, uncurryN3 } from "./Tuple/All"

// CONSTRUCTOR

export type Key = number

export type IntMap<A> = t<A>

/**
 * `fromUniquePairs :: ...(k, a) -> Map k a`
 *
 * Creates a new `Map` instance from the passed arguments.
 */
export const fromUniquePairs =
  <A> (...xs: [Key, A][]): IntMap<A> =>
    ReIntMap.fromArray (xs)


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Map k a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A, B>
  (f: (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: IntMap<A>): B =>
    ReIntMap.Foldable_foldr (uncurryN (f), initial, xs)

/**
 * `foldl :: (b -> a -> b) -> b -> Map k a -> b`
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
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: IntMap<A>): B =>
    ReIntMap.Foldable_foldl (uncurryN (f), initial, xs)

/**
 * `toList :: Map k a -> [(k, a)]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A>
  (xs: IntMap<A>): List<Pair<number, A>> =>
    ReIntMap.Foldable_toList (xs)

/**
 * `null :: Map k a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull =
  (xs: IntMap<any>): boolean =>
    ReIntMap.Foldable_fnull (xs)

/**
 * `length :: Map k a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (xs: IntMap<any>): number => ReIntMap.Foldable_flength (xs)

/**
 * `elem :: Eq a => a -> Map k a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A> (e: A) => (xs: IntMap<A>): boolean =>
    ReIntMap.Foldable_elem (e, xs)

/**
 * `elemF :: Eq a => Map k a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF =
  <A> (xs: IntMap<A>) => (e: A): boolean => elem (e) (xs)

/**
 * `sum :: Num a => Map k a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = ReIntMap.Foldable_sum

/**
 * `product :: Num a => Map k a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = ReIntMap.Foldable_product

/**
 * `maximum :: Ord a => Map k a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum =
  (xs: IntMap<number>): number =>
    ReIntMap.Foldable_maximum (xs)

/**
 * `minimum :: Ord a => Map k a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum =
  (xs: IntMap<number>): number =>
    ReIntMap.Foldable_minimum (xs)

// Specialized folds

/**
 * `concat :: Map k [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A> (xs: IntMap<List<A>>): List<A> =>
    ReIntMap.Foldable_concat (xs)

/**
 * `concatMap :: (a -> Map k b) -> Map k a -> Map k b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A, B>
  (f: (value: A) => IntMap<B>) =>
  (xs: IntMap<A>): IntMap<B> =>
    ReIntMap.Foldable_concatMap (f, xs)

/**
 * `and :: Map k Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and =
  (xs: IntMap<boolean>): boolean =>
    ReIntMap.Foldable_and (xs)

/**
 * `or :: Map k Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or =
  (xs: IntMap<boolean>): boolean =>
    ReIntMap.Foldable_or (xs)

/**
 * `any :: (a -> Bool) -> Map k a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (xs: IntMap<A>): boolean =>
    ReIntMap.Foldable_any (f, xs)

/**
 * `all :: (a -> Bool) -> Map k a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (xs: IntMap<A>): boolean =>
    ReIntMap.Foldable_all (f, xs)

// Searches

/**
 * `notElem :: Eq a => a -> Map k a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (e: A) => (mp: IntMap<A>) => ReIntMap.Foldable_notElem (e, mp)

interface Find {

  /**
   * `find :: (a -> Bool) -> Map k a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A>
  (pred: (x: A) => x is A1):
  (xs: IntMap<A>) => Maybe<A1>

  /**
   * `find :: (a -> Bool) -> Map k a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A>
  (pred: (x: A) => boolean):
  (xs: IntMap<A>) => Maybe<A>
}

/**
 * `find :: (a -> Bool) -> Map k a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: IntMap<A>): Maybe<A> =>
    ReIntMap.Foldable_find (pred, xs)


// TRAVERSABLE

/**
 * `mapMEither :: (a -> Either e b) -> OrderedMap k a -> Either e (OrderedMap k b)`
 *
 * `mapMEither f map` takes a function and a map and maps the function over
 * every element in the list. If the function returns a `Left`, it is
 * immediately returned by the function. If `f` did not return any `Left`, the
 * map of unwrapped return values is returned as a `Right`. If `map` is empty,
 * `Right empty` is returned.
 */
export const mapMEither =
  <E, A, B>
  (f: (x: A) => Either<E, B>) =>
  (m: IntMap<A>): Either<E, IntMap<B>> => ReIntMap.Traversable_mapMEither (f, m)


// QUERY

/**
 * `size :: Map k a -> Int`
 *
 * The number of elements in the map.
 */
export const { size } = ReIntMap

/**
 * `member :: Ord k => k -> Map k a -> Bool`
 *
 * Is the key a member of the map?
 */
export const member =
  (key: Key) => (mp: IntMap<any>): boolean =>
    ReIntMap.member (key, mp)

/**
 * `memberF :: Ord k => Map k a -> k -> Bool`
 *
 * Is the key a member of the map?
 *
 * Flipped version of `member`.
 */
export const memberF =
  (mp: IntMap<any>) => (key: Key): boolean =>
    ReIntMap.member (key, mp)

/**
 * `notMember :: Ord k => k -> Map k a -> Bool`
 *
 * Is the key not a member of the map?
 */
export const notMember = (key: Key) => (mp: IntMap<any>) => ReIntMap.notMember (key, mp)

/**
 * `lookup :: Ord k => k -> Map k a -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 */
export const lookup =
  (key: Key) =>
  <A>
  (m: IntMap<A>): Maybe<A> =>
    ReIntMap.lookup (key, m)

export type lookup<A> = (key: Key) => (m: IntMap<A>) => Maybe<A>

/**
 * `lookupF :: Ord k => Map k a -> k -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 *
 * Flipped version of `lookup`.
 */
export const lookupF =
  <A>
  (m: IntMap<A>) => (key: Key): Maybe<A> =>
    ReIntMap.lookup (key, m)

/**
 * `findWithDefault :: Ord k => a -> k -> Map k a -> a`
 *
 * The expression `(findWithDefault def k map)` returns the value at key `k`
 * or returns default value `def` when the key is not in the map.
 */
export const findWithDefault =
  <A> (def: A) => (key: Key) => (m: IntMap<A>): A =>
    ReIntMap.findWithDefault (def, key, m)


// CONSTRUCTION

/**
 * `empty :: Map k a`
 *
 * The empty map.
 */
export const empty = ReIntMap.fromArray ([])

/**
 * `singleton :: k -> a -> Map k a`
 *
 * A map with a single element.
 */
export const singleton =
  <A> (key: Key) => (x: A): IntMap<A> =>
    ReIntMap.singleton (key, x)


// INSERTION

/**
 * `insert :: Ord k => k -> a -> Map k a -> Map k a`
 *
 * Insert a new key and value in the map. If the key is already present in the
 * map, the associated value is replaced with the supplied value. `insert` is
 * equivalent to `insertWith const`.
 */
export const insert =
  (key: Key) =>
  <A>
  (value: A) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.insert (key, value, mp)

export type insert<A> = (key: Key) => (value: A) => (mp: IntMap<A>) => IntMap<A>

/**
 * `insertF :: Ord k => a -> k -> Map k a -> Map k a`
 *
 * Insert a new key and value in the map. If the key is already present in the
 * map, the associated value is replaced with the supplied value. `insertF` is
 * equivalent to `flip (insertWith const)`.
 *
 * Flipped version of `insert`.
 */
export const insertF =
  <A>
  (value: A) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.insert (key, value, mp)

/**
 * `insertWith :: Ord k => (a -> a -> a) -> k -> a -> Map k a -> Map k a`
 *
 * Insert with a function, combining new value and old value.
 * `insertWith f key value mp` will insert the pair `(key, value)` into `mp`
 * if `key` does not exist in the map. If the `key` does exist, the function
 * will insert the pair `(key, f new_value old_value)`.
 */
export const insertWith =
  <A> (f: (new_value: A) => (old_value: A) => A) =>
  (key: Key) =>
  (value: A) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.insertWith (uncurryN (f), key, value, mp)

/**
 * `insertWithKey :: Ord k => (k -> a -> a -> a) -> k -> a -> Map k a ->
   Map k a`
 *
 * Insert with a function, combining key, new value and old value.
 * `insertWithKey f key value mp` will insert the pair `(key, value)` into
 * `mp` if `key` does not exist in the map. If the key does exist, the
 * function will insert the pair `(key,f key new_value old_value)`. Note that
 * the key passed to `f` is the same key passed to `insertWithKey`.
 */
export const insertWithKey =
  <A>
  (f: (key: Key) => (new_value: A) => (old_value: A) => A) =>
  (key: Key) =>
  (value: A) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.insertWithKey (uncurryN3 (f), key, value, mp)

/**
 * `insertLookupWithKey :: Ord k => (k -> a -> a -> a) -> k -> a -> Map k a ->
   (Maybe a, Map k a)`
 *
 * Combines insert operation with old value retrieval. The expression
 * `(insertLookupWithKey f k x map)` is a pair where the first element is
 * equal to `(lookup k map)` and the second element equal to
 * `(insertWithKey f k x map)`.
 */
export const insertLookupWithKey =
  <A>
  (f: (key: Key) => (new_value: A) => (old_value: A) => A) =>
  (key: Key) =>
  (value: A) =>
  (mp: IntMap<A>): Pair<Maybe<A>, IntMap<A>> =>
    ReIntMap.insertLookupWithKey (uncurryN3 (f), key, value, mp)


// DELETE/UPDATE

/**
 * `delete :: Ord k => k -> Map k a -> Map k a`
 *
 * Delete a key and its value from the map. When the key is not a member of
 * the map, the original map is returned.
 */
export const sdelete =
  (key: Key) => <A> (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.sdelete (key, mp)

/**
 * `adjust :: Ord k => (a -> a) -> k -> Map k a -> Map k a`
 *
 * Update a value at a specific key with the result of the provided function.
 * When the key is not a member of the map, the original map is returned.
 */
export const adjust =
  <A>
  (f: (value: A) => A) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.adjust (f, key, mp)

/**
 * `adjustWithKey :: Ord k => (k -> a -> a) -> k -> Map k a -> Map k a`
 *
 * Adjust a value at a specific key. When the key is not a member of the map,
 * the original map is returned.
 */
export const adjustWithKey =
  <A>
  (f: (key: Key) => (value: A) => A) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.adjustWithKey (uncurryN (f), key, mp)

/**
 * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
 *
 * The expression `(update f k map)` updates the value `x` at `k` (if it is in
 * the map). If `(f x)` is `Nothing`, the element is deleted. If it is
 * `(Just y)`, the key `k` is bound to the new value `y`.
 */
export const update =
  <A>
  (f: (value: A) => Maybe<A>) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.update (f, key, mp)

/**
 * `updateWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> Map k a`
 *
 * The expression `(updateWithKey f k map)` updates the value `x` at `k` (if
 * it is in the map). If `(f k x)` is `Nothing`, the element is deleted. If it
 * is `(Just y)`, the key `k` is bound to the new value `y`.
 */
export const updateWithKey =
  <A>
  (f: (key: Key) => (value: A) => Maybe<A>) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.updateWithKey (uncurryN (f), key, mp)

/**
 * `updateLookupWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> (Maybe a, Map k a)`
 *
 * Lookup and update. See also `updateWithKey`. The function returns changed
 * value, if it is updated. Returns the original key value if the map entry is
 * deleted.
 */
export const updateLookupWithKey =
  <A>
  (f: (key: Key) => (value: A) => Maybe<A>) =>
  (key: Key) =>
  (mp: IntMap<A>): Pair<Maybe<A>, IntMap<A>> =>
    ReIntMap.updateLookupWithKey (uncurryN (f), key, mp)

/**
 * `alter :: Ord k => (Maybe a -> Maybe a) -> k -> Map k a -> Map k a`
 *
 * The expression `(alter f k map)` alters the value `x` at `k`, or absence
 * thereof. `alter` can be used to insert, delete, or update a value in a
 * `Map`. In short : `lookup k (alter f k m) = f (lookup k m)`.
 */
export const alter =
  <A>
  (f: (old_value: Maybe<A>) => Maybe<A>) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    ReIntMap.alter (f, key, mp)


// COMBINE

/**
  * `union :: Ord k => Map k a -> Map k a -> Map k a`
  *
  *  The expression `(union t1 t2)` takes the left-biased union of `t1` and
  * `t2`. It prefers `t1` when duplicate keys are encountered, i.e.
  * `(union == unionWith const)`.
  */
export const union =
  <A>
  (t1: IntMap<A>) =>
  (t2: IntMap<A>): IntMap<A> =>
    ReIntMap.union (t1, t2)


// MAP

/**
 * `map :: (a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const map =
  <A, B>
  (f: (value: A) => B) =>
  (xs: IntMap<A>): IntMap<B> =>
    ReIntMap.map (f, xs)

/**
 * `mapWithKey :: (k -> a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const mapWithKey =
  <A, B>
  (f: (key: Key) => (value: A) => B) =>
  (xs: IntMap<A>): IntMap<B> =>
    ReIntMap.mapWithKey (uncurryN (f), xs)


// FOLDS

/**
 * `foldrWithKey :: (k -> a -> b -> b) -> b -> Map k a -> b`
 *
 * Fold the keys and values in the map using the given right-associative binary
 * operator, such that
 * `foldrWithKey f z == foldr (uncurry f) z . toAscList`.
 */
export const foldrWithKey =
  <A, B>
  (f: (key: Key) => (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: IntMap<A>): B =>
    ReIntMap.foldrWithKey (uncurryN3 (f), initial, xs)

/**
 * `foldlWithKey :: (a -> k -> b -> a) -> a -> Map k b -> a`
 *
 * Fold the values in the map using the given left-associative binary
 * operator, such that
 * `foldlWithKey f z == foldl (\z' (kx, x) -> f z' kx x) z . toAscList`.
 */
export const foldlWithKey =
  <A, B>
  (f: (acc: B) => (key: Key) => (current: A) => B) =>
  (initial: B) =>
  (xs: IntMap<A>): B =>
    ReIntMap.foldlWithKey (uncurryN3 (f), initial, xs)


// CONVERSION

/**
 * `elems :: Map k a -> [a]`
 *
 * Return all elements of the map.
 */
export const elems =
  <A> (mp: IntMap<A>): List<A> =>
    ReIntMap.elems (mp)

/**
 * `keys :: Map k a -> [k]`
 *
 * Return all keys of the map.
 */
export const keys =
  (mp: IntMap<any>): List<number> =>
    ReIntMap.keys (mp)

/**
 * `assocs :: Map k a -> [(k, a)]`
 *
 * Return all key/value pairs in the map.
 */
export const assocs = <A> (mp: IntMap<A>): List<Pair<number, A>> =>
  ReIntMap.assocs (mp)

// /**
//  * `keysSet :: Map k a -> Set k`
//  *
//  * The set of all keys of the map.
//  */
// export const keysSet = (mp: IntMap<any>): StrSet =>
//   ReIntMap.keysSet (mp)

// /**
//  * `fromSet :: (k -> a) -> Set k -> Map k a`
//  *
//  * Build a map from a set of keys and a function which for each key computes
//  * its value.
//  */
// export const fromSet =
//   <A>
//   (f: (key: Key) => A) =>
//   (ks: StrSet): IntMap<A> =>
//     ReIntMap.fromSet (f, ks)


// LISTS

/**
 * `fromList :: Ord k => [(k, a)] -> Map k a`
 *
 * Build a map from a list of key/value pairs. See also `fromAscList`. If the
 * list contains more than one value for the same key, the last value for the
 * key is retained.
 *
 * If the keys of the list are ordered, linear-time implementation is used,
 * with the performance equal to fromDistinctAscList.
 */
export const fromList =
  <A> (xs: List<Pair<number, A>>): IntMap<A> =>
    ReIntMap.fromList (xs)


// FILTER

interface Filter {

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  <A, A1 extends A>
  (pred: (x: A) => x is A1): (list: IntMap<A>) => IntMap<A1>

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  <A> (pred: (x: A) => boolean): (list: IntMap<A>) => IntMap<A>
}

/**
 * `filter :: (a -> Bool) -> Map k a -> Map k a`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter: Filter =
  <A>
  (pred: (x: A) => boolean) => (xs: IntMap<A>): IntMap<A> =>
    ReIntMap.filter (pred, xs)

interface FilterWithKey {

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  <A, A1 extends A>
  (pred: (key: Key) => (x: A) => x is A1):
  (list: IntMap<A>) => IntMap<A1>

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  <A>
  (pred: (key: Key) => (x: A) => boolean):
  (list: IntMap<A>) => IntMap<A>
}

/**
 * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
 *
 * Filter all keys/values that satisfy the predicate.
 */
export const filterWithKey: FilterWithKey =
  <A>
  (pred: (key: Key) => (x: A) => boolean) =>
  (xs: IntMap<A>): IntMap<A> =>
    ReIntMap.filterWithKey (uncurryN (pred), xs)

interface FilterWithKeyFPred<A> {
  <A1 extends A> (pred: (key: Key) => (x: A) => x is A1): IntMap<A1>
  (pred: (key: Key) => (x: A) => boolean): IntMap<A>
}

/**
 * `filterWithKeyF :: Map k a -> (k -> a -> Bool) -> Map k a`
 *
 * Filter all keys/values that satisfy the predicate.
 *
 * Same as `filterWithKey` but with arguments flipped.
 */
export const filterWithKeyF =
  <A>
  (xs: IntMap<A>): FilterWithKeyFPred<A> =>
  (pred: (key: Key) => (x: A) => boolean): IntMap<A> =>
    ReIntMap.filterWithKey (uncurryN (pred), xs)

/**
 * `mapMaybe :: (a -> Maybe b) -> Map k a -> Map k b`
 *
 * Map values and collect the `Just` results.
 */
export const mapMaybe =
  <A, B>
  (f: (value: A) => Maybe<B>) =>
  (mp: IntMap<A>): IntMap<B> =>
    ReIntMap.mapMaybe (f, mp)

/**
 * `mapMaybeWithKey :: (k -> a -> Maybe b) -> Map k a -> Map k b`
 *
 * Map keys/values and collect the `Just` results.
 */
export const mapMaybeWithKey =
  <A, B>
  (f: (key: Key) => (value: A) => Maybe<B>) =>
  (mp: IntMap<A>): IntMap<B> =>
    ReIntMap.mapMaybeWithKey (uncurryN (f), mp)


// CUSTOM FUNCTIONS

/**
 * `deleteLookupWithKey :: Ord k => k -> Map k a -> (Maybe a, Map k a)`
 *
 * Lookup and delete. The function returns the deleted value, if there was any
 * to delete. Returns the map without the deleted key as well.
 */
export const deleteLookupWithKey =
  (key: Key) =>
  <A>
  (mp: IntMap<A>): Pair<Maybe<A>, IntMap<A>> =>
    Pair (lookup (key) (mp), sdelete (key) (mp))

/**
 * `lookup2 :: (a -> b -> c) -> k -> Map k a -> Map k b -> Maybe c`
 *
 * `lookup2 f key map1 map2` looks up the key `key` both in the maps `map1` and
 * `map2`. If both keys are found, the values are passed to `f`. The result is
 * returned wrapped in a `Just`, or, if at least one of the maps does not
 * contain the key, `Nothing` is returned.
 */
export const lookup2 =
  <A, B, C> (f: (x: A) => (y: B) => C) =>
  (key: Key) =>
  (m1: IntMap<A>) =>
  (m2: IntMap<B>): Maybe<C> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    lookup2F (key) (m1) (m2) (f)

/**
 * `lookup2F :: k -> Map k a -> Map k b -> (a -> b -> c) -> Maybe c`
 *
 * `lookup2F key map1 map2 f` looks up the key `key` both in the maps `map1` and
 * `map2`. If both keys are found, the values are passed to `f`. The result is
 * returned wrapped in a `Just`, or, if at least one of the maps does not
 * contain the key, `Nothing` is returned.
 */
export const lookup2F =
  (key: Key) =>
  <A> (m1: IntMap<A>) =>
  <B> (m2: IntMap<B>) =>
  <C> (f: (x: A) => (y: B) => C): Maybe<C> =>
    bind (lookup (key) (m1))
         (x => ReOption.Functor_fmap (f (x), lookup (key) (m2)))

/**
 * `fromArray :: Array (k, a) -> Map k a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const { fromArray } = ReIntMap

// /**
//  * `mapMEitherWithKey :: (k -> a -> Either e b) -> OrderedMap k a -> Either e (OrderedMap k b)`
//  *
//  * `mapMEitherWithKey f map` takes a function and a map and maps the function
//  * over every element in the list. If the function returns a `Left`, it is
//  * immediately returned by the function. If `f` did not return any `Left`, the
//  * map of unwrapped return values is returned as a `Right`. If `map` is empty,
//  * `Right empty` is returned.
//  */
// export const mapMEitherWithKey =
//   <K, E, A, B>
//   (f: (key: Key) => (x: A) => Either<E, B>) =>
//   (m: IntMap<A>): Either<E, IntMap<B>> => {
//     if (fnull (m)) {
//       return Right (empty)
//     }

//     const arr: [K, B][] = []

//     for (const [ key, value ] of m .value) {
//       const res = f (key) (value)

//       if (isLeft (res)) {
//         return res
//       }

//       arr .push ([ key, fromRight_ (res) ])
//     }

//     return Right (fromArray (arr))
//   }

// /**
//  * `adjustDef :: Ord k => a -> (a -> a) -> k -> Map k a -> Map k a`
//  *
//  * Update a value at a specific key with the result of the provided function.
//  * When the key is not a member of the map, the default value passed to this
//  * function is used as the parameter passed to the provided function and the
//  * result is inserted into the map.
//  */
// export const adjustDef =
//   <A>
//   (def: A) =>
//   (f: (value: A) => A) =>
//   <K>
//   (key: Key) =>
//   (mp: IntMap<A>): IntMap<A> =>
//     maybe_ (() => insert (key) (f (def)) (mp))
//            ((x: A) => {
//              const x1 = f (x)

//              return x === x1 ? mp : insert (key) (x1) (mp)
//            })
//            (lookup (key) (mp))

// NAMESPACED FUNCTIONS

export const IntMap = {
  fromUniquePairs,
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
  concat,
  concatMap,
  and,
  or,
  any,
  all,
  notElem,
  find,

  mapMEither,

  size,
  member,
  memberF,
  notMember,
  lookup,
  lookupF,
  findWithDefault,

  empty,
  singleton,

  insert,
  insertF,
  insertWith,
  insertWithKey,
  insertLookupWithKey,

  sdelete,
  adjust,
  adjustWithKey,
  update,
  updateWithKey,
  updateLookupWithKey,
  alter,

  union,

  map,
  mapWithKey,

  foldrWithKey,
  foldlWithKey,

  elems,
  keys,
  assocs,
  // keysSet,
  // fromSet,

  fromList,

  filter,
  filterWithKey,
  filterWithKeyF,
  mapMaybe,
  mapMaybeWithKey,

  deleteLookupWithKey,
  lookup2,
  lookup2F,
}


// TYPE HELPERS

export type IntMapValueElement<A> = A extends IntMap<infer V> ? V : never

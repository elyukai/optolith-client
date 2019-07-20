/**
 * @module Data.Map
 *
 * A map is a data structure for storing values of the same type by keys of the
 * same type. Keys and values do not need to have the same type.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { not } from "./Bool";
import { flip, ident, on } from "./Function";
import { fmapF } from "./Functor";
import { Internals } from "./Internals";
import { consF, List, trimStart } from "./List";
import { fromMaybe, Just, Maybe, Nothing } from "./Maybe";
import { abs, inc, max } from "./Num";
import { showP, showPDepth } from "./Show";
import { curry, fst, Pair, snd, uncurry } from "./Tuple";
import { upd2 } from "./Tuple/Update";

import Map = Internals.Map
import Bin = Internals.Bin
import Tip = Internals.Tip
import isTip = Internals.isTip

type Key = number
export type IntMap<A> = Map<Key, A>
type IntBin<A> = Bin<Key, A>


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> IntMap a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A, B>
  (f: (current: A) => (acc: B) => B) =>
  (init: B) =>
  (mp: IntMap<A>): B =>
    isTip (mp)
    ? init
    : foldr (f) (f (mp .value) (foldr (f) (init) (mp .right))) (mp .left)

/**
 * `toList :: IntMap a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A> (mp: IntMap<A>): List<A> =>
    foldr (consF) (List<A> ()) (mp)


// Specialized folds

/**
 * `all :: (a -> Bool) -> IntMap a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) =>
  (mp: IntMap<A>): boolean =>
    isTip (mp)
    ? true
    : f (mp .value) && all (f) (mp .left) && all (f) (mp .right)


// QUERY

/**
 * `null :: IntMap a -> Bool`
 *
 * Is the map empty?
 */
export const fnull = (mp: IntMap<any>): mp is Tip => isTip (mp)

/**
 * `size :: IntMap a -> Int`
 *
 * The number of elements in the map.
 */
export const size = (mp: IntMap<any>) => isTip (mp) ? 0 : mp .size

/**
 * `member :: Key -> IntMap a -> Bool`
 *
 * Is the key a member of the map?
 */
export const member =
  (key: Key) =>
  (mp: IntMap<any>): boolean =>
    isTip (mp)
    ? false
    : mp .key === key
      || member (key) (mp .left)
      || member (key) (mp .right)

/**
 * `memberF :: IntMap a -> Key -> Bool`
 *
 * Is the key a member of the map?
 *
 * Flipped version of `member`.
 */
export const memberF = flip (member)

/**
 * `notMember :: Key -> IntMap a -> Bool`
 *
 * Is the key not a member of the map?
 */
export const notMember = (key: Key) => pipe (member (key), not)

/**
 * `notMemberF :: IntMap a -> Key -> Bool`
 *
 * Is the key not a member of the map?
 *
 * Flipped version of `notMember`.
 */
export const notMemberF = flip (notMember)

/**
 * `lookup :: Key -> IntMap a -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 */
export const lookup =
  (key: Key) =>
  <A>
  (mp: IntMap<A>): Maybe<A> =>
    isTip (mp)
    ? Nothing
    : mp .key === key
    ? Just (mp .value)
    : key < mp .key
    ? lookup (key) (mp .left)
    : lookup (key) (mp .right)

/**
 * `lookupF :: IntMap a -> Key -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 *
 * Flipped version of `lookup`.
 */
export const lookupF = <A> (mp: IntMap<A>) => (key: Key): Maybe<A> => lookup (key) (mp)

/**
 * `findWithDefault :: a -> Key -> IntMap a -> a`
 *
 * The expression `(findWithDefault def k map)` returns the value at key `k`
 * or returns default value `def` when the key is not in the map.
 */
export const findWithDefault =
  <A> (def: A) => (key: Key) => (mp: IntMap<A>): A =>
    fromMaybe (def) (lookup (key) (mp))


// CONSTRUCTION

/**
 * `empty :: IntMap a`
 *
 * The empty map.
 */
export const empty = Tip

/**
 * `singleton :: Key -> a -> IntMap a`
 *
 * A map with a single element.
 */
export const singleton =
  (key: Key) =>
  <A> (x: A): IntMap<A> =>
    Bin (1) (1) (key) (x) (Tip) (Tip)


// INSERTION

/**
 * `insert :: Key -> a -> IntMap a -> IntMap a`
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
    isTip (mp)
    ? singleton (key) (value)
    : mp .key === key
    ? Bin (mp .size) (mp .height) (key) (value) (mp .left) (mp .right)
    : key < mp .key
    ? (() => {
        const left = insert (key) (value) (mp .left)
        const leftSize = (left as Bin<number, A>) .size

        return rebalance (Bin (1 + leftSize + size (mp .right))
                              (calcHeight (left) (mp .right))
                              (mp .key)
                              (mp .value)
                              (left)
                              (mp .right))
      }) ()
    : (() => {
        const right = insert (key) (value) (mp .right)
        const rightSize = (right as Bin<number, A>) .size

        return rebalance (Bin (1 + size (mp .left) + rightSize)
                              (calcHeight (mp .left) (right))
                              (mp .key)
                              (mp .value)
                              (mp .left)
                              (right))
      }) ()

/**
 * `insertWith :: (a -> a -> a) -> Key -> a -> IntMap a -> IntMap a`
 *
 * Insert with a combining function. `insertWith f key value mp` will insert the
 * pair (key, value) into `mp` if key does not exist in the map. If the key does
 * exist, the function will insert `f new_value old_value`.
 */
export const insertWith =
  <A> (f: (new_value: A) => (old_value: A) => A) =>
  (key: Key) =>
  (value: A) =>
  (mp: IntMap<A>): IntMap<A> =>
    isTip (mp)
    ? singleton (key) (value)
    : mp .key === key
    ? Bin (mp .size) (mp .height) (key) (f (value) (mp .value)) (mp .left) (mp .right)
    : key < mp .key
    ? (() => {
        const left = insertWith (f) (key) (value) (mp .left)
        const leftSize = (left as Bin<number, A>) .size

        return rebalance (Bin (1 + leftSize + size (mp .right))
                              (calcHeight (left) (mp .right))
                              (mp .key)
                              (mp .value)
                              (left)
                              (mp .right))
      }) ()
    : (() => {
        const right = insertWith (f) (key) (value) (mp .right)
        const rightSize = (right as Bin<number, A>) .size

        return rebalance (Bin (1 + size (mp .left) + rightSize)
                              (calcHeight (mp .left) (right))
                              (mp .key)
                              (mp .value)
                              (mp .left)
                              (right))
      }) ()

/**
 * `insertWithKey :: (Key -> a -> a -> a) -> Key -> a -> IntMap a -> IntMap a`
 *
 * Insert with a combining function. `insertWithKey f key value mp` will insert
 * the pair (key, value) into `mp` if key does not exist in the map. If the key
 * does exist, the function will insert `f key new_value old_value`.
 */
export const insertWithKey =
  <A> (f: (key: Key) => (new_value: A) => (old_value: A) => A) =>
  (key: Key) =>
  (value: A) =>
  (mp: IntMap<A>): IntMap<A> =>
    isTip (mp)
    ? singleton (key) (value)
    : mp .key === key
    ? Bin (mp .size) (mp .height) (key) (f (key) (value) (mp .value)) (mp .left) (mp .right)
    : key < mp .key
    ? (() => {
        const left = insertWithKey (f) (key) (value) (mp .left)
        const leftSize = (left as Bin<number, A>) .size

        return rebalance (Bin (1 + leftSize + size (mp .right))
                              (calcHeight (left) (mp .right))
                              (mp .key)
                              (mp .value)
                              (left)
                              (mp .right))
      }) ()
    : (() => {
        const right = insertWithKey (f) (key) (value) (mp .right)
        const rightSize = (right as Bin<number, A>) .size

        return rebalance (Bin (1 + size (mp .left) + rightSize)
                              (calcHeight (mp .left) (right))
                              (mp .key)
                              (mp .value)
                              (mp .left)
                              (right))
      }) ()

/**
 * `insertLookupWithKey :: (Key -> a -> a -> a) -> Key -> a -> IntMap a -> (Maybe a, IntMap a)`
 *
 * The expression `(insertLookupWithKey f k x map)` is a pair where the first element is equal to `(lookup k map)` and the second element equal to `(insertWithKey f k x map)`.
 */
export const insertLookupWithKey =
  <A> (f: (key: Key) => (new_value: A) => (old_value: A) => A) =>
  (key: Key) =>
  (value: A) =>
  (mp: IntMap<A>): Pair<Maybe<A>, IntMap<A>> =>
    isTip (mp)
    ? Pair (Nothing, singleton (key) (value))
    : mp .key === key
    ? Pair (
        Just (mp .value),
        Bin (mp .size) (mp .height) (key) (f (key) (value) (mp .value)) (mp .left) (mp .right)
      )
    : key < mp .key
    ? (() => {
        const left = insertLookupWithKey (f) (key) (value) (mp .left)
        const leftSize = (snd (left) as Bin<number, A>) .size

        return upd2 (rebalance (Bin (1 + leftSize + size (mp .right))
                                    (calcHeight (snd (left)) (mp .right))
                                    (mp .key)
                                    (mp .value)
                                    (snd (left))
                                    (mp .right)))
                    (left)
      }) ()
    : (() => {
        const right = insertLookupWithKey (f) (key) (value) (mp .right)
        const rightSize = (snd (right) as Bin<number, A>) .size

        return upd2 (rebalance (Bin (1 + size (mp .left) + rightSize)
                                    (calcHeight (mp .left) (snd (right)))
                                    (mp .key)
                                    (mp .value)
                                    (mp .left)
                                    (snd (right))))
                    (right)
      }) ()


// DELETE/UPDATE

/**
 * `delete :: Key -> IntMap a -> IntMap a`
 *
 * Delete a key and its value from the map. When the key is not a member of the
 * map, the original map is returned.
 */
export const sdelete =
  (key: Key) =>
  <A> (mp: IntMap<A>): IntMap<A> =>
    fromMaybe (mp) (sdeleteMaybe (key) (mp))

const minKeyValue =
  <A> (mp: IntBin<A>): Pair<number, A> =>
    isTip (mp .left) ? Pair (mp .key, mp .value) : minKeyValue (mp .left)

const sdeleteMaybe =
  (key: Key) =>
  <A> (mp: IntMap<A>): Maybe<IntMap<A>> =>
    isTip (mp)
    ? Nothing
    : mp .key === key
    ? isTip (mp .left) && isTip (mp .right)
      ? Just (Tip)
      : isTip (mp .left)
      ? Just (mp .left)
      : isTip (mp .right)
      ? Just (mp .right)
      : (() => {
          const keyValue_ = minKeyValue (mp .right as IntBin<A>)
          const right_ = sdelete (fst (keyValue_)) (mp .right)

          return Just (rebalance (Bin (calcSizeLR (mp .left) (mp .right))
                                      (calcHeight (mp .left) (mp .right))
                                      (fst (keyValue_))
                                      (snd (keyValue_))
                                      (mp .left)
                                      (right_)))
        }) ()
    : key < mp .key
    ? fmapF (sdeleteMaybe (key) (mp .left))
            (left => rebalance (Bin (calcSize (left) (mp .right))
                                    (calcHeight (left) (mp .right))
                                    (mp .key)
                                    (mp .value)
                                    (left)
                                    (mp .right)))
    : fmapF (sdeleteMaybe (key) (mp .right))
            (right => rebalance (Bin (calcSize (mp .left) (right))
                                     (calcHeight (mp .left) (right))
                                     (mp .key)
                                     (mp .value)
                                     (mp .left)
                                     (right)))


// MAP

/**
 * `map :: (a -> b) -> IntMap a -> IntMap b`
 *
 * Map a function over all values in the map.
 */
export const map =
  <A, B>
  (f: (value: A) => B) =>
  (mp: IntMap<A>): IntMap<B> =>
    isTip (mp)
    ? Tip
    : Bin (mp .size)
          (mp .height)
          (mp .key)
          (f (mp .value))
          (map (f) (mp .left))
          (map (f) (mp .right))


// FOLD

/**
 * `foldrWithKey :: (Key -> a -> b -> b) -> b -> IntMap a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldrWithKey =
  <A, B>
  (f: (key: Key) => (current: A) => (acc: B) => B) =>
  (init: B) =>
  (mp: IntMap<A>): B =>
    isTip (mp)
    ? init
    : foldrWithKey (f) (f (mp .key) (mp .value) (foldrWithKey (f) (init) (mp .right))) (mp .left)


// CONVERSION

/**
 * `elems :: IntMap a -> [a]`
 *
 * Return all elements of the map.
 */
export const elems =
  <A> (mp: IntMap<A>): List<A> =>
    toList (mp)

/**
 * `keys :: IntMap a -> [Key]`
 *
 * Return all keys of the map.
 */
export const keys =
  <A> (mp: IntMap<A>): List<Key> =>
    foldrWithKey (key => () => consF (key)) (List ()) (mp)

/**
 * `assocs :: IntMap a -> [(Key, a)]`
 *
 * Return all key/value pairs in the map.
 */
export const assocs =
  <A> (mp: IntMap<A>): List<Pair<Key, A>> =>
    foldrWithKey<A, List<Pair<Key, A>>> (curry (consF)) (List ()) (mp)


// LISTS

/**
 * `fromList :: [(Key, a)] -> IntMap a`
 *
 * Create a map from a list of key/value pairs.
 */
export const fromList =
  <A> (xs: List<Pair<Key, A>>): IntMap<A> =>
    List.foldr (uncurry<Key, A, ident<IntMap<A>>> (insert)) (empty) (xs)

/**
 * `fromListN :: [[Key, a]] -> IntMap a`
 *
 * Create a map from a native array of key/value pairs.
 */
export const fromListN =
  <A> (xs: [Key, A][]): IntMap<A> =>
    xs .reduce<IntMap<A>> ((map, [k, v]) => insert (k) (v) (map), empty)


// DEBUGGING

export const showTree = <A> (mp: IntMap<A>): string => {
  if (isTip (mp)) {
    return "0"
  }
  else {
    const key_str = showP (mp .key)
    const value_str = trimStart (showPDepth ((key_str .length + 3) / 2) (mp .value))

    const l_str = showBranch (1) (mp .left)
    const r_str = showBranch (1) (mp .right)

    return `${key_str} = ${value_str}\n|\n| ${l_str}\n|\n| ${r_str}`
  }
}

const showBranch = (depth: number) => <A> (mp: IntMap<A>): string => {
  const dws = " " .repeat (depth * 2) // depth whitespace

  if (isTip (mp)) {
    return "0"
  }
  else {
    const key_str = showP (mp .key)
    const value_str = trimStart (showPDepth ((key_str .length + 3) / 2 + depth) (mp .value))

    const l_str = showBranch (depth + 1) (mp .left)
    const r_str = showBranch (depth + 1) (mp .right)

    return `${key_str} = ${value_str}\n${dws}|\n${dws}| ${l_str}\n${dws}|\n${dws}| ${r_str}`
  }
}


// Internal

const rebalance =
  <A> (mp: IntBin<A>): IntBin<A> => {
    const slope_current = slope (mp)
    const slope_left = slope (mp .left)
    const slope_right = slope (mp .right)

    return abs (slope_current) < 2
    ? mp
    : slope_current === 2 && slope_left !== -1
    ? rotateRight (mp)
    : slope_current === 2 && slope_left === -1
    ? rotateRight (Bin (mp .size)
                       (mp .height)
                       (mp .key)
                       (mp .value)
                       (rotateLeft (mp .left as IntBin<A>))
                       (mp .right))
    : slope_current === -2 && slope_right !== 1
    ? rotateLeft (mp)
    : slope_current === -2 && slope_right === 1
    ? rotateLeft (Bin (mp .size)
                      (mp .height)
                      (mp .key)
                      (mp .value)
                      (mp .left)
                      (rotateRight (mp .right as IntBin<A>)))
    : (() => { throw new TypeError ("rebalance: BST was not balanced before") }) ()
  }

// "Slope" = difference in heights between the left and right subtrees of a node

const slope = <A> (mp: IntMap<A>): number => isTip (mp) ? 0 : height (mp .left) - height (mp .right)

const height = <A> (mp: IntMap<A>): number => isTip (mp) ? 0 : mp .height

const calcHeight: <A> (l: IntMap<A>) => (r: IntMap<A>) => number =
  l => pipe (on (max) (height) (l), inc)

const calcSizeLR = on (max) (size)

const calcSize: <A> (l: IntMap<A>) => (r: IntMap<A>) => number =
  l => pipe (calcSizeLR (l), inc)

const rotateRight =
  <A> (mp: IntBin<A>): IntBin<A> => {
    const left = mp .left as IntBin<A>
    const t1 = left .left
    const t2 = left .right
    const t3 = mp .right
    const y_key = left .key
    const y_value = left .value
    const x_key = mp .key
    const x_value = mp .value

    const right_height = calcHeight (t2) (t3)
    const right = Bin (calcSize (t2) (t3)) (right_height) (x_key) (x_value) (t2) (t3)

    return Bin (mp .size)
               (calcHeight (t1) (right))
               (y_key)
               (y_value)
               (t1)
               (right)
  }

const rotateLeft =
  <A> (mp: IntBin<A>): IntBin<A> => {
    const right = mp .right as IntBin<A>
    const t1 = mp .left
    const t2 = right .left
    const t3 = right .right
    const y_key = mp .key
    const y_value = mp .value
    const x_key = right .key
    const x_value = right .value

    const left_height = calcHeight (t1) (t2)
    const left = Bin (calcSize (t1) (t2)) (left_height) (y_key) (y_value) (t1) (t2)

    return Bin (mp .size)
               (calcHeight (left) (t3))
               (x_key)
               (x_value)
               (left)
               (t3)
  }

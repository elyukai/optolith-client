/**
 * @module Data.Map
 *
 * A map is a data structure for storing values of the same type by keys of the
 * same type. Keys and values do not need to have the same type.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe"
import { not } from "./Bool"
import { equals } from "./Eq"
import { cnst, flip, ident, on } from "./Function"
import { fmapF } from "./Functor"
import { Internals } from "./Internals"
import { consF, intercalate, List, notNull } from "./List"
import { alt, fromJust, fromMaybe, isJust, Just, Maybe, maybe, Nothing } from "./Maybe"
import { abs, add, inc, max } from "./Num"
import { show } from "./Show"
import { curry, fst, Pair, second, snd, uncurry } from "./Tuple"
import { upd2 } from "./Tuple/Update"

import Map = Internals.Map
import Bin = Internals.Bin
import Tip = Internals.Tip
import isTip = Internals.isTip

type Key = number
export type IntMap<A> = Map<Key, A>
type IntBin<A> = Bin<Key, A>


// Internal

// "Slope" = difference in heights between the left and right subtrees of a node

const height = <A> (mp: IntMap<A>): number => isTip (mp) ? 0 : mp .height

const slope = <A> (mp: IntMap<A>): number => isTip (mp) ? 0 : height (mp .left) - height (mp .right)

const calcHeight: <A> (l: IntMap<A>) => (r: IntMap<A>) => number =
  l => pipe (on (max) (height) (l), inc)

const calcSize: <A> (l: IntMap<A>) => (r: IntMap<A>) => number =
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  l => pipe (on (add) (size) (l), inc)

// /**
//  * If the trees are balanced but the left side weights less than the right side,
//  * we need to ensure the left side is heavier so that we can compare trees by
//  * structural equality.
//  */
// const isRotationNeededForLeftWeight =
//   <A> (mp: IntBin<A>) =>
//     slope (mp) === -1 && size (mp .left) >= 1 && size (mp .right) >= 2

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

    const right = Bin (calcSize (t2) (t3)) (calcHeight (t2) (t3)) (x_key) (x_value) (t2) (t3)

    return Bin (calcSize (t1) (right))
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

    const left = Bin (calcSize (t1) (t2)) (calcHeight (t1) (t2)) (y_key) (y_value) (t1) (t2)

    return Bin (calcSize (left) (t3))
               (calcHeight (left) (t3))
               (x_key)
               (x_value)
               (left)
               (t3)
  }

const rebalance =
  <A> (mp: IntBin<A>): IntBin<A> => {
    const slope_current = slope (mp)
    const slope_left = slope (mp .left)
    const slope_right = slope (mp .right)

    // const is_rotation_needed_for_left_weight = isRotationNeededForLeftWeight (mp)

    // if (is_rotation_needed_for_left_weight) {
    //   console.log (`slope_current = ${slope_current}`)
    //   console.log (`slope_left = ${slope_left}`)
    //   console.log (`slope_right = ${slope_right}`)
    //   console.log (`before\n${showTree (mp)}`)
    //   if (isTip ((mp .right as IntBin<A>) .right)) {
    //     console.log (`after alt\n${showTree ((() => {
    //       const new_left = Bin (calcSize (mp .left) (Tip))
    //                            (calcHeight (mp .left) (Tip))
    //                            (mp .key)
    //                            (mp .value)
    //                            (mp .left)
    //                            (Tip)

    //       const new_right = singleton ((mp .right as IntBin<A>) .key)
    //                                   ((mp .right as IntBin<A>) .value)

    //       const new_main = (mp .right as IntBin<A>) .left as IntBin<A>

    //       return Bin (calcSize (mp .left) (new_right))
    //                  (calcHeight (mp .left) (new_right))
    //                  (new_main .key)
    //                  (new_main .value)
    //                  (new_left)
    //                  (new_right)
    //     }) ())}`)
    //   }
    //   console.log (`after\n${showTree (rotateLeft (mp))}`)
    // }

    // return is_rotation_needed_for_left_weight
    // ? isTip ((mp .right as IntBin<A>) .right)
    //   ? (() => {
    //       const new_left = Bin (calcSize (mp .left) (Tip))
    //                            (calcHeight (mp .left) (Tip))
    //                            (mp .key)
    //                            (mp .value)
    //                            (mp .left)
    //                            (Tip)

    //       const new_right = singleton ((mp .right as IntBin<A>) .key)
    //                                   ((mp .right as IntBin<A>) .value)

    //       const new_main = (mp .right as IntBin<A>) .left as IntBin<A>

    //       return Bin (calcSize (mp .left) (new_right))
    //                  (calcHeight (mp .left) (new_right))
    //                  (new_main .key)
    //                  (new_main .value)
    //                  (new_left)
    //                  (new_right)
    //     }) ()
    //   : rotateLeft (mp)
    // : abs (slope_current) < 2
    return abs (slope_current) < 2
    ? mp
    : slope_current === 2 && slope_left !== -1
    ? rotateRight (mp)
    : slope_current === 2 && slope_left === -1
    ? (() => {
        const new_left = rotateLeft (mp .left as IntBin<A>)

        return rotateRight (Bin (calcSize (new_left) (mp .right))
                                (calcHeight (new_left) (mp .right))
                                (mp .key)
                                (mp .value)
                                (new_left)
                                (mp .right))
      }) ()
    : slope_current === -2 && slope_right !== 1
    ? rotateLeft (mp)
    : slope_current === -2 && slope_right === 1
    ? (() => {
        const new_right = rotateRight (mp .right as IntBin<A>)

        return rotateLeft (Bin (calcSize (mp .left) (new_right))
                               (calcHeight (mp .left) (new_right))
                               (mp .key)
                               (mp .value)
                               (mp .left)
                               (new_right))
      }) ()
    : (() => {
        throw new TypeError ("rebalance: BST was not balanced before")
      }) ()
  }


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
export const fnull = isTip

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

        return rebalance (Bin (calcSize (left) (mp .right))
                              (calcHeight (left) (mp .right))
                              (mp .key)
                              (mp .value)
                              (left)
                              (mp .right))
      }) ()
    : (() => {
        const right = insert (key) (value) (mp .right)

        return rebalance (Bin (calcSize (mp .left) (right))
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

        return rebalance (Bin (calcSize (left) (mp .right))
                              (calcHeight (left) (mp .right))
                              (mp .key)
                              (mp .value)
                              (left)
                              (mp .right))
      }) ()
    : (() => {
        const right = insertWith (f) (key) (value) (mp .right)

        return rebalance (Bin (calcSize (mp .left) (right))
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

        return rebalance (Bin (calcSize (left) (mp .right))
                              (calcHeight (left) (mp .right))
                              (mp .key)
                              (mp .value)
                              (left)
                              (mp .right))
      }) ()
    : (() => {
        const right = insertWithKey (f) (key) (value) (mp .right)

        return rebalance (Bin (calcSize (mp .left) (right))
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

        return upd2 (rebalance (Bin (calcSize (snd (left)) (mp .right))
                                    (calcHeight (snd (left)) (mp .right))
                                    (mp .key)
                                    (mp .value)
                                    (snd (left))
                                    (mp .right)))
                    (left)
      }) ()
    : (() => {
        const right = insertLookupWithKey (f) (key) (value) (mp .right)

        return upd2 (rebalance (Bin (calcSize (mp .left) (snd (right)))
                                    (calcHeight (mp .left) (snd (right)))
                                    (mp .key)
                                    (mp .value)
                                    (mp .left)
                                    (snd (right))))
                    (right)
      }) ()


// DELETE/UPDATE

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
      ? Just (mp .right)
      : isTip (mp .right)
      ? Just (mp .left)
      : (() => {
          const keyValue_ = minKeyValue (mp .right)
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const right_ = sdelete (fst (keyValue_)) (mp .right)

          return Just (rebalance (Bin (calcSize (mp .left) (right_))
                                      (calcHeight (mp .left) (right_))
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

const adjustWithKeyMaybe =
  <A>
  (f: (key: Key) => (value: A) => A) =>
  (key: Key) =>
  (mp: IntMap<A>): Maybe<IntMap<A>> =>
    isTip (mp)
    ? Nothing
    : mp .key === key
    ? Just (Bin (mp .size)
                (mp .height)
                (key)
                (f (key) (mp .value))
                (mp .left)
                (mp .right))
    : key < mp .key
    ? fmapF (adjustWithKeyMaybe (f) (key) (mp .left))
            (left => Bin (mp .size)
                         (mp .height)
                         (mp .key)
                         (mp .value)
                         (left)
                         (mp .right))
    : fmapF (adjustWithKeyMaybe (f) (key) (mp .right))
            (right => Bin (mp .size)
                          (mp .height)
                          (mp .key)
                          (mp .value)
                          (mp .left)
                          (right))

/**
 * `adjust :: (a -> a) -> Key -> IntMap a -> IntMap a`
 *
 * Update a value at a specific key with the result of the provided function.
 * When the key is not a member of the map, the original map is returned.
 */
export const adjust =
  <A>
  (f: (value: A) => A) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    fromMaybe (mp) (adjustWithKeyMaybe (cnst (f)) (key) (mp))

/**
 * `adjustWithKey :: (Key -> a -> a) -> Key -> IntMap a -> IntMap a`
 *
 * Adjust a value at a specific key. When the key is not a member of the map,
 * the original map is returned.
 */
export const adjustWithKey =
  <A>
  (f: (key: Key) => (value: A) => A) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    fromMaybe (mp) (adjustWithKeyMaybe (f) (key) (mp))

const updateLookupWithKeyMaybe =
  <A>
  (f: (key: Key) => (value: A) => Maybe<A>) =>
  (key: Key) =>
  (mp: IntMap<A>): Maybe<Pair<Maybe<A>, IntMap<A>>> =>
    isTip (mp)
    ? Nothing
    : mp .key === key
    ? (() => {
        const mupd = f (mp .key) (mp .value)

        if (isJust (mupd)) {
          const upd = fromJust (mupd)

          if (equals (upd) (mp .value)) {
            return Nothing
          }
          else {
            return Just (Pair (Just (mp .value), Bin (mp .size)
                                                     (mp .height)
                                                     (key)
                                                     (upd)
                                                     (mp .left)
                                                     (mp .right)))
          }
        }
        else {
          return isTip (mp .left) && isTip (mp .right)
          ? Just (Pair (Just (mp .value), Tip))
          : isTip (mp .left)
          ? Just (Pair (Just (mp .value), mp .right))
          : isTip (mp .right)
          ? Just (Pair (Just (mp .value), mp .left))
          : (() => {
              const keyValue_ = minKeyValue (mp .right)
              const right_ = sdelete (fst (keyValue_)) (mp .right)

              return Just (Pair (Just (mp .value), rebalance (Bin (calcSize (mp .left) (right_))
                                                                  (calcHeight (mp .left) (right_))
                                                                  (fst (keyValue_))
                                                                  (snd (keyValue_))
                                                                  (mp .left)
                                                                  (right_))))
            }) ()
        }
      }) ()
    : key < mp .key
    ? fmapF (updateLookupWithKeyMaybe (f) (key) (mp .left))
            (second (left => rebalance (Bin (calcSize (left) (mp .right))
                                            (calcHeight (left) (mp .right))
                                            (mp .key)
                                            (mp .value)
                                            (left)
                                            (mp .right))))
    : fmapF (updateLookupWithKeyMaybe (f) (key) (mp .right))
            (second (right => rebalance (Bin (calcSize (mp .left) (right))
                                             (calcHeight (mp .left) (right))
                                             (mp .key)
                                             (mp .value)
                                             (mp .left)
                                             (right))))

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
    maybe (mp) <Pair<Maybe<A>, IntMap<A>>> (snd) (updateLookupWithKeyMaybe (cnst (f)) (key) (mp))

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
    maybe (mp) <Pair<Maybe<A>, IntMap<A>>> (snd) (updateLookupWithKeyMaybe (f) (key) (mp))

/**
 * `updateLookupWithKey :: (Key -> a -> Maybe a) -> Key -> IntMap a -> (Maybe a, IntMap a)`
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
    fromMaybe<Pair<Maybe<A>, IntMap<A>>> (Pair (Nothing, mp))
                                         (updateLookupWithKeyMaybe (f) (key) (mp))

/**
 * `alter :: (Maybe a -> Maybe a) -> Key -> IntMap a -> IntMap a`
 *
 * The expression `(alter f k map)` alters the value `x` at `k`, or absence
 * thereof. `alter` can be used to insert, delete, or update a value in a
 * `Map`. In short: `lookup k (alter f k m) = f (lookup k m)`.
 */
export const alter =
  <A>
  (f: (old_value: Maybe<A>) => Maybe<A>) =>
  (key: Key) =>
  (mp: IntMap<A>): IntMap<A> =>
    maybe<ident<IntMap<A>>> (sdelete (key))
                            <A> (insert (key))
                            (f (lookup (key) (mp)))
                            (mp)


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

/**
 * `mapWithKey :: (Key -> a -> b) -> IntMap a -> IntMap b`
 *
 * Map a function over all values in the map.
 */
export const mapWithKey =
  <A, B>
  (f: (key: Key) => (value: A) => B) =>
  (mp: IntMap<A>): IntMap<B> =>
    isTip (mp)
    ? Tip
    : Bin (mp .size)
          (mp .height)
          (mp .key)
          (f (mp .key) (mp .value))
          (mapWithKey (f) (mp .left))
          (mapWithKey (f) (mp .right))


// FOLDS

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
export const elems = toList

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
    xs .reduce<IntMap<A>> ((mp, [ k, v ]) => insert (k) (v) (mp), empty)


// DEBUGGING

const showBranch =
  (start: boolean) =>
  <A> (showelem: (key: Key) => (x: A) => string) =>
  (wide: boolean) =>
  (depthLinesStart: Maybe<number>) =>
  (depth: number) =>
  (mp: IntMap<A>): List<string> => {
    const dls = fromMaybe (depth) (depthLinesStart)
    const with_line = depth - dls
    const without_line = depth - with_line

    // depth whitespace
    const dws = "   " .repeat (without_line) + "|  " .repeat (with_line)
    const elem_dws = dws .slice (0, -3) + (start ? "" : "+--")

    if (isTip (mp)) {
      return List ()
    }
    else {
      const elem_str = showelem (mp .key) (mp .value)
      const s_str = show (mp .size)
      const h_str = show (mp .height)
      const full_elem = `${elem_dws}${elem_str} {{ s = ${s_str}, h = ${h_str} }}`

      const l_str = showBranch (false)
                               (showelem)
                               (wide)
                               (alt (depthLinesStart) (Just (depth)))
                               (depth + 1)
                               (mp .left)

      const r_str = showBranch (false) (showelem) (wide) (depthLinesStart) (depth + 1) (mp .right)

      return List (
        full_elem,
        ...(notNull (l_str) && wide ? List (`${dws}|`) : List<string> ()),
        ...l_str,
        ...(notNull (r_str) && wide ? List (`${dws}|`) : List<string> ()),
        ...r_str
      )
    }
  }

export const showTreeWith =
  <A> (showelem: (key: Key) => (x: A) => string) =>
  (wide: boolean) =>
  (mp: IntMap<A>): string => {
  if (isTip (mp)) {
    return "+"
  }
  else {
    return intercalate ("\n") (showBranch (true) (showelem) (wide) (Nothing) (0) (mp))
  }
}

export const showTree = showTreeWith<any> (k => x => `(${show (k)}, ${show (x)})`) (true)

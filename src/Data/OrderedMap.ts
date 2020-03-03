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
import { Either, fromRight_, isLeft, Right } from "./Either"
import { equals } from "./Eq"
import { ident } from "./Function"
import { fmapF } from "./Functor"
import { Internals } from "./Internals"
import { append, List } from "./List"
import { bind, fromMaybe, Just, Maybe, maybe, maybe_ } from "./Maybe"
import { add, multiply } from "./Num"
import { show } from "./Show"
import { Pair, Tuple } from "./Tuple"

import _OrderedMap = Internals._OrderedMap
import OrderedSet = Internals.OrderedSet
import mapFromArray = Internals.mapFromArray

interface StringKeyObject<V> {
  readonly [id: string]: V
}


// CONSTRUCTOR

export interface OrderedMap<K, A> extends Internals.OrderedMapPrototype<K, A> {
  readonly value: ReadonlyMap<K, A>
}

/**
 * `fromUniquePairs :: ...(k, a) -> Map k a`
 *
 * Creates a new `Map` instance from the passed arguments.
 */
export const fromUniquePairs =
  <K, A> (...xs: [K, A][]): OrderedMap<K, A> =>
    _OrderedMap (new Map (xs))

/**
 * `fromMap :: NMap a -> Map k a`
 *
 * Creates a new `Map` instance from the passed native `Map`.
 */
export const fromMap =
  <K, A> (xs: ReadonlyMap<K, A>): OrderedMap<K, A> => {
    if (xs instanceof Map) {
      return _OrderedMap (xs)
    }

    throw new TypeError (
      `fromArray requires a native Map but instead it received ${show (xs)}`
    )
  }


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
  (xs: OrderedMap<any, A>): B =>
    [ ...xs .value ] .reduceRight<B> ((acc, e) => f (e [1]) (acc), initial)

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
  (xs: OrderedMap<any, A>): B =>
    [ ...xs .value ] .reduce<B> ((acc, e) => f (acc) (e [1]), initial)

/**
 * `foldr1 :: (a -> a -> a) -> Map k a -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A>
  (f: (current: A) => (acc: A) => A) =>
  (xs: OrderedMap<any, A>): A => {
    if (xs .value .size > 0) {
      const arr = [ ...xs .value ]
      const _init = arr .slice (0, -1)
      const _last = arr [arr .length - 1]

      return _init .reduceRight<A> ((acc, e) => f (e [1]) (acc), _last [1])
    }

    throw new TypeError ("Cannot apply foldr1 to an empty Set.")
  }

/**
 * `foldl1 :: (a -> a -> a) -> Map k a -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A>
  (f: (acc: A) => (current: A) => A) =>
  (xs: OrderedMap<any, A>): A => {
    if (xs .value .size > 0) {
      const [ _head, ..._tail ] = xs

      return _tail .reduce<A> ((acc, e) => f (acc) (e [1]), _head [1])
    }

    throw new TypeError ("Cannot apply foldl1 to an empty Set.")
  }

/**
 * `toList :: Map k a -> [(k, a)]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <K, A>
  (xs: OrderedMap<K, A>): List<Pair<K, A>> =>
    List.fromArray ([ ...xs .value ] .map (([ k, a ]) => Pair (k, a)))

/**
 * `null :: Map k a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull =
  (xs: OrderedMap<any, any>): boolean =>
    xs .value .size === 0

/**
 * `length :: Map k a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (xs: OrderedMap<any, any>): number => xs .value .size

/**
 * `elem :: Eq a => a -> Map k a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A> (e: A) => (xs: OrderedMap<any, A>): boolean =>
    [ ...xs .value .values () ] .some (equals (e))

/**
 * `elemF :: Eq a => Map k a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF =
  <A> (xs: OrderedMap<any, A>) => (e: A): boolean => elem (e) (xs)

/**
 * `sum :: Num a => Map k a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = foldr (add) (0)

/**
 * `product :: Num a => Map k a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = foldr (multiply) (1)

/**
 * `maximum :: Ord a => Map k a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum =
  (xs: OrderedMap<any, number>): number =>
    Math.max (...xs .value .values ())

/**
 * `minimum :: Ord a => Map k a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum =
  (xs: OrderedMap<any, number>): number =>
    Math.min (...xs .value .values ())

// Specialized folds

/**
 * `concat :: Map k [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A> (xs: OrderedMap<any, List<A>>): List<A> =>
    foldl<List<A>, List<A>> (append) (List.empty) (xs)

/**
 * `concatMap :: (a -> Map k b) -> Map k a -> Map k b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <K, A, B>
  (f: (value: A) => OrderedMap<K, B>) =>
  (xs: OrderedMap<K, A>): OrderedMap<K, B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray (
      [ ...xs .value ] .reduce<[K, B][]> (
        (acc, e) => [ ...acc, ...f (e [1]) .value ],
        []
      )
    )

/**
 * `and :: Map k Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and =
  (xs: OrderedMap<any, boolean>): boolean =>
    [ ...xs .value .values () ] .every (ident)

/**
 * `or :: Map k Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or =
  (xs: OrderedMap<any, boolean>): boolean =>
    [ ...xs .value .values () ] .some (ident)

/**
 * `any :: (a -> Bool) -> Map k a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (xs: OrderedMap<any, A>): boolean =>
    [ ...xs .value .values () ] .some (f)

/**
 * `all :: (a -> Bool) -> Map k a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (xs: OrderedMap<any, A>): boolean =>
    [ ...xs .value .values () ] .every (f)

// Searches

/**
 * `notElem :: Eq a => a -> Map k a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (e: A) => pipe (elem<A> (e), not)

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
  (xs: OrderedMap<any, A>) => Maybe<A1>

  /**
   * `find :: (a -> Bool) -> Map k a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A>
  (pred: (x: A) => boolean):
  (xs: OrderedMap<any, A>) => Maybe<A>
}

/**
 * `find :: (a -> Bool) -> Map k a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: OrderedMap<any, A>): Maybe<A> =>
    Maybe ([ ...xs .value .values () ] .find (pred))


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
  <K>
  (m: OrderedMap<K, A>): Either<E, OrderedMap<K, B>> => {
    if (fnull (m)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return Right (empty)
    }

    const arr: [K, B][] = []

    for (const [ key, value ] of m .value) {
      const res = f (value)

      if (isLeft (res)) {
        return res
      }

      arr .push ([ key, fromRight_ (res) ])
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return Right (fromArray (arr))
  }


// QUERY

/**
 * `size :: Map k a -> Int`
 *
 * The number of elements in the map.
 */
export const size = flength

/**
 * `member :: Ord k => k -> Map k a -> Bool`
 *
 * Is the key a member of the map?
 */
export const member =
  <K> (key: K) => (mp: OrderedMap<K, any>): boolean =>
    mp .value .has (key)

/**
 * `memberF :: Ord k => Map k a -> k -> Bool`
 *
 * Is the key a member of the map?
 *
 * Flipped version of `member`.
 */
export const memberF =
  <K> (mp: OrderedMap<K, any>) => (key: K): boolean =>
    mp .value .has (key)

/**
 * `notMember :: Ord k => k -> Map k a -> Bool`
 *
 * Is the key not a member of the map?
 */
export const notMember = <K> (key: K) => pipe (member (key), not)

/**
 * `lookup :: Ord k => k -> Map k a -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 */
export const lookup =
  <K>
  (key: K) =>
  <A>
  (m: OrderedMap<K, A>): Maybe<A> =>
    Maybe (m .value .get (key))

export type lookup<K, A> = (key: K) => (m: OrderedMap<K, A>) => Maybe<A>

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
  <K, A>
  (m: OrderedMap<K, A>) => (key: K): Maybe<A> =>
    lookup (key) (m)

/**
 * `findWithDefault :: Ord k => a -> k -> Map k a -> a`
 *
 * The expression `(findWithDefault def k map)` returns the value at key `k`
 * or returns default value `def` when the key is not in the map.
 */
export const findWithDefault =
  <A> (def: A) => <K> (key: K) => (m: OrderedMap<K, A>): A =>
    fromMaybe (def) (lookup (key) (m))


// CONSTRUCTION

/**
 * `empty :: Map k a`
 *
 * The empty map.
 */
export const empty = fromUniquePairs<any, any> ()

/**
 * `singleton :: k -> a -> Map k a`
 *
 * A map with a single element.
 */
export const singleton =
  <K, A> (key: K) => (x: A): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ [ key, x ] ])


// INSERTION

/**
 * `insert :: Ord k => k -> a -> Map k a -> Map k a`
 *
 * Insert a new key and value in the map. If the key is already present in the
 * map, the associated value is replaced with the supplied value. `insert` is
 * equivalent to `insertWith const`.
 */
export const insert =
  <K>
  (key: K) =>
  <A>
  (value: A) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...mp .value, [ key, value ] ])

export type insert<K, A> = (key: K) => (value: A) => (mp: OrderedMap<K, A>) => OrderedMap<K, A>

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
  <K>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...mp .value, [ key, value ] ])

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
  <K> (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    insert (key)
           (maybe (value)
                  (f (value))
                  (lookup (key) (mp)))
           (mp)

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
  <K, A>
  (f: (key: K) => (new_value: A) => (old_value: A) => A) =>
  (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    insert (key)
           (maybe (value)
                  (f (key) (value))
                  (lookup (key) (mp)))
           (mp)

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
  <K, A>
  (f: (key: K) => (new_value: A) => (old_value: A) => A) =>
  (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): Pair<Maybe<A>, OrderedMap<K, A>> => {
    const maybe_old_value = lookup (key) (mp)

    return Pair (
      maybe_old_value,
      insert (key)
             (maybe (value)
                    (f (key) (value))
                    (maybe_old_value))
             (mp)
    )
  }


// DELETE/UPDATE

/**
 * Removes a key without checking its existence before. For internal use only.
 */
const removeKey =
  <K> (key: K) => <A> (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...mp .value ] .filter (([ k ]) => k !== key))

/**
 * `delete :: Ord k => k -> Map k a -> Map k a`
 *
 * Delete a key and its value from the map. When the key is not a member of
 * the map, the original map is returned.
 */
export const sdelete =
  <K> (key: K) => <A> (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    member (key) (mp) ? removeKey (key) (mp) : mp

/**
 * `adjust :: Ord k => (a -> a) -> k -> Map k a -> Map k a`
 *
 * Update a value at a specific key with the result of the provided function.
 * When the key is not a member of the map, the original map is returned.
 */
export const adjust =
  <A>
  (f: (value: A) => A) =>
  <K>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe (mp)
          ((x: A) => {
            const x1 = f (x)

            return x === x1 ? mp : insert (key) (x1) (mp)
          })
          (lookup (key) (mp))

/**
 * `adjustWithKey :: Ord k => (k -> a -> a) -> k -> Map k a -> Map k a`
 *
 * Adjust a value at a specific key. When the key is not a member of the map,
 * the original map is returned.
 */
export const adjustWithKey =
  <K, A>
  (f: (key: K) => (value: A) => A) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe (mp)
          ((x: A) => insert (key) (f (key) (x)) (mp))
          (lookup (key) (mp))

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
  <K>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe
      (mp)
      (pipe (
        f,
        maybe_ (() => removeKey (key) (mp))
               (y => insert (key) (y) (mp))
      ))
      (lookup (key) (mp))

/**
 * `updateWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> Map k a`
 *
 * The expression `(updateWithKey f k map)` updates the value `x` at `k` (if
 * it is in the map). If `(f k x)` is `Nothing`, the element is deleted. If it
 * is `(Just y)`, the key `k` is bound to the new value `y`.
 */
export const updateWithKey =
  <K, A>
  (f: (key: K) => (value: A) => Maybe<A>) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe
      (mp)
      (pipe (
        f (key),
        maybe_ (() => removeKey (key) (mp))
               (y => insert (key) (y) (mp))
      ))
      (lookup (key) (mp))

/**
 * `updateLookupWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> (Maybe a, Map k a)`
 *
 * Lookup and update. See also `updateWithKey`. The function returns changed
 * value, if it is updated. Returns the original key value if the map entry is
 * deleted.
 */
export const updateLookupWithKey =
  <K, A>
  (f: (key: K) => (value: A) => Maybe<A>) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): Pair<Maybe<A>, OrderedMap<K, A>> => {
    const maybe_old_value = lookup (key) (mp)

    return maybe_
      (() => Pair (maybe_old_value, mp))
      (pipe (
        f (key),
        maybe_
          (() => Pair (maybe_old_value, removeKey (key) (mp)))
          (x => Pair (Just (x), insert (key) (x) (mp)))
      ))
      (maybe_old_value)
  }

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
  <K>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe<(mp: OrderedMap<K, A>) => OrderedMap<K, A>>
      (sdelete (key))
      <A> (insert (key))
      (f (lookup (key) (mp)))
      (mp)


// COMBINE

/**
  * `union :: Ord k => Map k a -> Map k a -> Map k a`
  *
  *  The expression `(union t1 t2)` takes the left-biased union of `t1` and
  * `t2`. It prefers `t1` when duplicate keys are encountered, i.e.
  * `(union == unionWith const)`.
  */
export const union =
  <K, A>
  (t1: OrderedMap<K, A>) =>
  (t2: OrderedMap<K, A>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...t1, ...[ ...t2 ] .filter (([ key ]) => !t1 .value .has (key)) ])


// MAP

/**
 * `map :: (a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const map =
  <A, B>
  (f: (value: A) => B) =>
  <K> (xs: OrderedMap<K, A>): OrderedMap<K, B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .map (([ k, a ]) => [ k, f (a) ] as [K, B]))

/**
 * `mapWithKey :: (k -> a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const mapWithKey =
  <K, A, B>
  (f: (key: K) => (value: A) => B) =>
  (xs: OrderedMap<K, A>): OrderedMap<K, B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .map (([ k, a ]) => [ k, f (k) (a) ] as [K, B]))


// FOLDS

/**
 * `foldrWithKey :: (k -> a -> b -> b) -> b -> Map k a -> b`
 *
 * Fold the keys and values in the map using the given right-associative binary
 * operator, such that
 * `foldrWithKey f z == foldr (uncurry f) z . toAscList`.
 */
export const foldrWithKey =
  <K, A, B>
  (f: (key: K) => (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: OrderedMap<K, A>): B =>
    [ ...xs .value ] .reduceRight<B> (
      (acc, e) => f (e [0]) (e [1]) (acc),
      initial
    )

/**
 * `foldlWithKey :: (a -> k -> b -> a) -> a -> Map k b -> a`
 *
 * Fold the values in the map using the given left-associative binary
 * operator, such that
 * `foldlWithKey f z == foldl (\z' (kx, x) -> f z' kx x) z . toAscList`.
 */
export const foldlWithKey =
  <K, A, B>
  (f: (acc: B) => (key: K) => (current: A) => B) =>
  (initial: B) =>
  (xs: OrderedMap<K, A>): B =>
    [ ...xs .value ] .reduce<B> (
      (acc, e) => f (acc) (e [0]) (e [1]),
      initial
    )


// CONVERSION

/**
 * `elems :: Map k a -> [a]`
 *
 * Return all elements of the map.
 */
export const elems =
  <A> (mp: OrderedMap<any, A>): List<A> =>
    List (...mp .value .values ())

/**
 * `keys :: Map k a -> [k]`
 *
 * Return all keys of the map.
 */
export const keys =
  <K> (mp: OrderedMap<K, any>): List<K> =>
    List (...mp .value .keys ())

/**
 * `assocs :: Map k a -> [(k, a)]`
 *
 * Return all key/value pairs in the map.
 */
export const assocs = <K, A> (mp: OrderedMap<K, A>): List<Pair<K, A>> =>
  List.fromArray ([ ...mp ] .map (p => Pair (...p)))

/**
 * `keysSet :: Map k a -> Set k`
 *
 * The set of all keys of the map.
 */
export const keysSet = <K> (mp: OrderedMap<K, any>): OrderedSet<K> =>
  Internals._OrderedSet (new Set (mp .value .keys ()))

/**
 * `fromSet :: (k -> a) -> Set k -> Map k a`
 *
 * Build a map from a set of keys and a function which for each key computes
 * its value.
 */
export const fromSet =
  <K, A>
  (f: (key: K) => A) =>
  (ks: OrderedSet<K>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...ks ] .map (k => [ k, f (k) ] as [K, A]))


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
  <K, A> (xs: List<Pair<K, A>>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray (List.toArray (List.map<Pair<K, A>, [K, A]> (Tuple.toArray) (xs)))


// FILTER

interface Filter {

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  <A, A1 extends A>
  (pred: (x: A) => x is A1): <K> (list: OrderedMap<K, A>) => OrderedMap<K, A1>

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  <A> (pred: (x: A) => boolean): <K> (list: OrderedMap<K, A>) => OrderedMap<K, A>
}

/**
 * `filter :: (a -> Bool) -> Map k a -> Map k a`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter: Filter =
  <K, A>
  (pred: (x: A) => boolean) => (xs: OrderedMap<K, A>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .filter (([ _, value ]) => pred (value)))

interface FilterWithKey {

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  <K, A, A1 extends A>
  (pred: (key: K) => (x: A) => x is A1):
  (list: OrderedMap<K, A>) => OrderedMap<K, A1>

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  <K, A>
  (pred: (key: K) => (x: A) => boolean):
  (list: OrderedMap<K, A>) => OrderedMap<K, A>
}

/**
 * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
 *
 * Filter all keys/values that satisfy the predicate.
 */
export const filterWithKey: FilterWithKey =
  <K, A>
  (pred: (key: K) => (x: A) => boolean) =>
  (xs: OrderedMap<K, A>): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .filter (([ key, value ]) => pred (key) (value)))

interface FilterWithKeyFPred<K, A> {
  <A1 extends A> (pred: (key: K) => (x: A) => x is A1): OrderedMap<K, A1>
  (pred: (key: K) => (x: A) => boolean): OrderedMap<K, A>
}

/**
 * `filterWithKeyF :: Map k a -> (k -> a -> Bool) -> Map k a`
 *
 * Filter all keys/values that satisfy the predicate.
 *
 * Same as `filterWithKey` but with arguments flipped.
 */
export const filterWithKeyF =
  <K, A>
  (xs: OrderedMap<K, A>): FilterWithKeyFPred<K, A> =>
  (pred: (key: K) => (x: A) => boolean): OrderedMap<K, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray ([ ...xs .value ] .filter (([ key, value ]) => pred (key) (value)))

/**
 * `mapMaybe :: (a -> Maybe b) -> Map k a -> Map k b`
 *
 * Map values and collect the `Just` results.
 */
export const mapMaybe =
  <A, B>
  (f: (value: A) => Maybe<B>) =>
  <K>
  (mp: OrderedMap<K, A>): OrderedMap<K, B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray (
      [ ...mp ] .reduce<[K, B][]> (
        (acc, [ key, value ]) => maybe (acc)
                                     ((x: B) => [ ...acc, [ key, x ] ])
                                     (f (value)),
        []
      )
    )

/**
 * `mapMaybeWithKey :: (k -> a -> Maybe b) -> Map k a -> Map k b`
 *
 * Map keys/values and collect the `Just` results.
 */
export const mapMaybeWithKey =
  <K, A, B>
  (f: (key: K) => (value: A) => Maybe<B>) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray (
      [ ...mp ] .reduce<[K, B][]> (
        (acc, [ key, value ]) => maybe (acc)
                                     ((x: B) => [ ...acc, [ key, x ] ])
                                     (f (key) (value)),
        []
      )
    )


// CUSTOM FUNCTIONS

/**
  * Transforms an `OrderedMap` into a native object, where the keys in the map are the
  * object keys and the values of the `OrderedMap` are the corresponding
  * values of the object, applied to the provided `fn` function before.
  * @param f Transforms the value before inserting it into the object.
  */
export const toObjectWith =
  <A, B>
  (f: (x: A) => B) =>
  (mp: OrderedMap<string, A>): StringKeyObject<B> =>
    foldlWithKey<string, A, StringKeyObject<B>> (acc => key => value => ({
                                                  ...acc,
                                                  [key]: f (value),
                                                }))
                                                ({ })
                                                (mp)


export const fromObject = <A>(obj: StringKeyObject<A>) => fromMap (new Map (Object.entries (obj)))


export const fromObjectWith =
  <A, B> (f: (x: A) => B) =>
  (obj: StringKeyObject<A>) =>
    fromMap (new Map (Object.entries (obj) .map (([ k, v ]) => [ k, f (v) ])))

/**
  * Transforms the `OrderedMap` instance into a native `Map`.
  */
export const toMap = <K, A> (mp: OrderedMap<K, A>): ReadonlyMap<K, A> =>
  mp .value

/**
 * `deleteLookupWithKey :: Ord k => k -> Map k a -> (Maybe a, Map k a)`
 *
 * Lookup and delete. The function returns the deleted value, if there was any
 * to delete. Returns the map without the deleted key as well.
 */
export const deleteLookupWithKey =
  <K>
  (key: K) =>
  <A>
  (mp: OrderedMap<K, A>): Pair<Maybe<A>, OrderedMap<K, A>> =>
    Pair (lookup (key) (mp), removeKey (key) (mp))

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
  <K> (key: K) =>
  (m1: OrderedMap<K, A>) =>
  (m2: OrderedMap<K, B>): Maybe<C> =>
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
  <K> (key: K) =>
  <A> (m1: OrderedMap<K, A>) =>
  <B> (m2: OrderedMap<K, B>) =>
  <C> (f: (x: A) => (y: B) => C): Maybe<C> =>
    bind (lookup (key) (m1))
         (x => fmapF (lookup (key) (m2))
                     (f (x)))

export import isOrderedMap = Internals.isOrderedMap

/**
 * `fromArray :: Array (k, a) -> Map k a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const fromArray = mapFromArray (show)

/**
 * `mapMEitherWithKey :: (k -> a -> Either e b) -> OrderedMap k a -> Either e (OrderedMap k b)`
 *
 * `mapMEitherWithKey f map` takes a function and a map and maps the function
 * over every element in the list. If the function returns a `Left`, it is
 * immediately returned by the function. If `f` did not return any `Left`, the
 * map of unwrapped return values is returned as a `Right`. If `map` is empty,
 * `Right empty` is returned.
 */
export const mapMEitherWithKey =
  <K, E, A, B>
  (f: (key: K) => (x: A) => Either<E, B>) =>
  (m: OrderedMap<K, A>): Either<E, OrderedMap<K, B>> => {
    if (fnull (m)) {
      return Right (empty)
    }

    const arr: [K, B][] = []

    for (const [ key, value ] of m .value) {
      const res = f (key) (value)

      if (isLeft (res)) {
        return res
      }

      arr .push ([ key, fromRight_ (res) ])
    }

    return Right (fromArray (arr))
  }

/**
 * `adjustDef :: Ord k => a -> (a -> a) -> k -> Map k a -> Map k a`
 *
 * Update a value at a specific key with the result of the provided function.
 * When the key is not a member of the map, the default value passed to this
 * function is used as the parameter passed to the provided function and the
 * result is inserted into the map.
 */
export const adjustDef =
  <A>
  (def: A) =>
  (f: (value: A) => A) =>
  <K>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe_ (() => insert (key) (f (def)) (mp))
           ((x: A) => {
             const x1 = f (x)

             return x === x1 ? mp : insert (key) (x1) (mp)
           })
           (lookup (key) (mp))

// NAMESPACED FUNCTIONS

export const OrderedMap = {
  fromUniquePairs,
  fromArray,
  fromMap,

  foldr,
  foldl,
  foldr1,
  foldl1,
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
  keysSet,
  fromSet,

  fromList,

  filter,
  filterWithKey,
  filterWithKeyF,
  mapMaybe,
  mapMaybeWithKey,

  toObjectWith,
  toMap,
  isOrderedMap,
  deleteLookupWithKey,
  lookup2,
  lookup2F,
  mapMEitherWithKey,
  adjustDef,
}


// TYPE HELPERS

export type OrderedMapValueElement<A> = A extends OrderedMap<any, infer V> ? V : never

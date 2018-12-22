/**
 * @module OrderedMap
 *
 * A map is a data structure for storing values of the same type by keys of the
 * same type. Keys and values do not need to have the same type.
 *
 * @author Lukas Obermann
 */

import { not, pipe } from 'ramda';
import { add, multiply } from '../mathUtils';
import { equals } from './Eq';
import { cnst, id } from './Function';
import { List, mappend } from './List';
import { fromMaybe, fromNullable, Just, Maybe, maybe, maybe_, Some } from './Maybe';
import { fromUniqueElements, OrderedSet } from './OrderedSet';
import { fromBoth, Pair } from './Pair';
import { StringKeyObject } from './Record';
import { show } from './Show';


// CONSTRUCTOR

interface OrderedMapPrototype<K extends Some, A extends Some> {
  [Symbol.iterator] (): IterableIterator<[K, A]>;
  readonly isOrderedMap: true;
}

export interface OrderedMap<K extends Some, A extends Some> extends OrderedMapPrototype<K, A> {
  readonly value: ReadonlyMap<K, A>;
  readonly prototype: OrderedMapPrototype<K, A>;
}

const OrderedMapPrototype: OrderedMapPrototype<Some, Some> =
  Object.create (
    Object.prototype,
    {
      [Symbol.iterator]: {
        value (this: OrderedMap<Some, Some>) {
          return this .value [Symbol.iterator] ()
        },
      },
      isOrderedMap: { value: true },
    }
  )

const _OrderedMap =
  <K extends Some, A extends Some> (x: ReadonlyMap<K, A>): OrderedMap<K, A> =>
    Object.create (OrderedMapPrototype, { value: { value: x, enumerable: true }})

/**
 * `fromUniquePairs :: ...(k, a) -> Map k a`
 *
 * Creates a new `Map` instance from the passed arguments.
 */
export const fromUniquePairs =
  <K extends Some, A extends Some> (...xs: [K, A][]): OrderedMap<K, A> =>
    _OrderedMap (new Map (xs))

/**
 * `fromArray :: Array (k, a) -> Map k a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const fromArray =
  <K extends Some, A extends Some> (xs: ReadonlyArray<[K, A]>): OrderedMap<K, A> => {
    if (Array.isArray (xs)) {
      return _OrderedMap (new Map (xs))
    }

    throw new TypeError (`fromArray requires an array but instead it received ${show (xs)}`)
  }

/**
 * `fromMap :: NMap a -> Map k a`
 *
 * Creates a new `Map` instance from the passed native `Map`.
 */
export const fromMap =
  <K extends Some, A extends Some> (xs: ReadonlyMap<K, A>): OrderedMap<K, A> => {
    if (xs instanceof Map) {
      return _OrderedMap (xs)
    }

    throw new TypeError (`fromArray requires a native Map but instead it received ${show (xs)}`)
  }


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const fmap =
  <K extends Some, A extends Some, B extends Some>
  (f: (value: A) => B) =>
  (xs: OrderedMap<K, A>): OrderedMap<K, B> =>
    fromArray ([...xs .value] .map (([k, a]) => [k, f (a)] as [K, B]))

/**
 * `(<$) :: a -> Map k b -> Map k a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <K extends Some, A extends Some> (x: A) => fmap<K, any, A> (cnst (x))


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Map k a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A extends Some, B extends Some>
  (f: (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: OrderedMap<any, A>): B =>
    [...xs .value] .reduceRight<B> ((acc, e) => f (e [1]) (acc), initial);

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
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: OrderedMap<any, A>): B =>
    [...xs .value] .reduce<B> ((acc, e) => f (acc) (e [1]), initial);

/**
 * `foldr1 :: (a -> a -> a) -> Map k a -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A extends Some>
  (f: (current: A) => (acc: A) => A) =>
  (xs: OrderedMap<any, A>): A => {
    if (xs .value .size > 0) {
      const arr = [...xs .value];
      const _init = arr .slice (0, -1);
      const _last = arr [arr .length - 1];

      return _init .reduceRight<A> ((acc, e) => f (e [1]) (acc), _last [1]);
    }

    throw new TypeError ('Cannot apply foldr1 to an empty Set.');
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
  <A extends Some>
  (f: (acc: A) => (current: A) => A) =>
  (xs: OrderedMap<any, A>): A => {
    if (xs .value .size > 0) {
      const [_head, ..._tail] = xs

      return _tail .reduce<A> ((acc, e) => f (acc) (e [1]), _head [1])
    }

    throw new TypeError ('Cannot apply foldl1 to an empty Set.')
  }

/**
 * `toList :: Map k a -> [(k, a)]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <K extends Some, A extends Some>
  (xs: OrderedMap<K, A>): List<Pair<K, A>> =>
    List.fromArray ([...xs .value] .map (([k, a]) => fromBoth<K, A> (k) (a)))

/**
 * `null :: Map k a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: OrderedMap<any, any>): boolean => xs .value .size === 0

/**
 * `length :: Map k a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (xs: OrderedMap<any, any>): number => xs .value .size

/**
 * `elem :: Eq a => a -> Map k a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A extends Some>(e: A) => (xs: OrderedMap<any, A>): boolean =>
    [...xs .value .values ()] .some (equals (e));

/**
 * `elem_ :: Eq a => Map k a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Same as `List.elem` but with arguments switched.
 */
export const elem_ = <A extends Some>(xs: OrderedMap<any, A>) => (e: A): boolean => elem (e) (xs)

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
export const maximum = (xs: OrderedMap<any, number>): number => Math.max (...xs .value .values ())

/**
 * `minimum :: Ord a => Map k a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = (xs: OrderedMap<any, number>): number => Math.min (...xs .value .values ())

// Specialized folds

/**
 * `concat :: Map k [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A extends Some> (xs: OrderedMap<any, List<A>>): List<A> =>
    foldl<List<A>, List<A>> (mappend) (List.empty) (xs)

/**
 * `concatMap :: (a -> Map k b) -> Map k a -> Map k b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <K extends Some, A extends Some, B extends Some>
  (f: (value: A) => OrderedMap<K, B>) =>
  (xs: OrderedMap<K, A>): OrderedMap<K, B> =>
    fromArray (
      [...xs .value] .reduce<[K, B][]> (
        (acc, e) => [...acc, ...f (e [1]) .value],
        []
      )
    )

/**
 * `and :: Map k Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite; `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = (xs: OrderedMap<any, boolean>): boolean => [...xs .value .values ()] .every (id)

/**
 * `or :: Map k Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite; `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = (xs: OrderedMap<any, boolean>): boolean => [...xs .value .values ()] .some (id)

/**
 * `any :: (a -> Bool) -> Map k a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Some>(f: (x: A) => boolean) => (xs: OrderedMap<any, A>): boolean =>
    [...xs .value .values ()] .some (f)

/**
 * `all :: (a -> Bool) -> Map k a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Some>(f: (x: A) => boolean) => (xs: OrderedMap<any, A>): boolean =>
    [...xs .value .values ()] .every (f)

// Searches

/**
 * `notElem :: Eq a => a -> Map k a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A extends Some> (e: A) => pipe (
  elem<A> (e),
  not
)

interface Find {
  /**
   * `find :: (a -> Bool) -> Map k a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A extends Some, A1 extends A> (pred: (x: A) => x is A1): (xs: OrderedMap<any, A>) => Maybe<A1>;
  /**
   * `find :: (a -> Bool) -> Map k a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A extends Some> (pred: (x: A) => boolean): (xs: OrderedMap<any, A>) => Maybe<A>;
}

/**
 * `find :: (a -> Bool) -> Map k a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A extends Some> (pred: (x: A) => boolean) => (xs: OrderedMap<any, A>): Maybe<A> =>
    fromNullable ([...xs .value .values ()] .find (pred))


// QUERY

/**
 * `size :: Map k a -> Int`
 *
 * The number of elements in the map.
 */
export const size = length

/**
 * `member :: Ord k => k -> Map k a -> Bool`
 *
 * Is the key a member of the map?
 */
export const member = <K extends Some> (key: K) => (mp: OrderedMap<K, any>): boolean =>
  mp .value .has (key)

/**
 * `member_ :: Ord k => Map k a -> k -> Bool`
 *
 * Is the key a member of the map?
 *
 * Same as `member` but with arguments flipped.
 */
export const member_ = <K extends Some> (mp: OrderedMap<K, any>) => (key: K): boolean =>
  mp .value .has (key)

/**
 * `notMember :: Ord k => k -> Map k a -> Bool`
 *
 * Is the key not a member of the map?
 */
export const notMember = <K extends Some> (key: K) => pipe (member (key), not)

/**
 * `lookup :: Ord k => k -> Map k a -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 */
export const lookup =
  <K extends Some, A extends Some>
  (key: K) => (m: OrderedMap<K, A>): Maybe<A> =>
    fromNullable (m .value .get (key))

/**
 * `lookup_ :: Ord k => Map k a -> k -> Maybe a`
 *
 * Lookup the value at a key in the map. The function will return the
 * corresponding value as `Just value`, or `Nothing` if the key isn't in the
 * map.
 *
 * Same as `OrderedMap.lookup` but with arguments switched.
 */
export const lookup_ =
  <K extends Some, A extends Some>
  (m: OrderedMap<K, A>) => (key: K): Maybe<A> =>
    lookup<K, A> (key) (m)

/**
 * `findWithDefault :: Ord k => a -> k -> Map k a -> a`
 *
 * The expression `(findWithDefault def k map)` returns the value at key `k`
 * or returns default value `def` when the key is not in the map.
 */
export const findWithDefault =
  <K extends Some, A extends Some>
  (def: A) => (key: K) => (m: OrderedMap<K, A>): A =>
    fromMaybe (def) (lookup<K, A> (key) (m))


// CONSTRUCTION

/**
 * `empty :: Map k a`
 *
 * The empty map.
 */
export const empty = fromUniquePairs<any, any> ();

/**
 * `singleton :: k -> a -> Map k a`
 *
 * A map with a single element.
 */
export const singleton =
  <K extends Some, A extends Some> (key: K) => (x: A): OrderedMap<K, A> =>
    fromArray ([[key, x]])


// INSERTION

/**
 * `insert :: Ord k => k -> a -> Map k a -> Map k a`
 *
 * Insert a new key and value in the map. If the key is already present in the
 * map, the associated value is replaced with the supplied value. `insert` is
 * equivalent to `insertWith const`.
 */
export const insert =
  <K extends Some, A extends Some>
  (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    fromArray ([...mp .value, [key, value]])

/**
 * `insertWith :: Ord k => (a -> a -> a) -> k -> a -> Map k a -> Map k a`
 *
 * Insert with a function, combining new value and old value.
 * `insertWith f key value mp` will insert the pair `(key, value)` into `mp`
 * if `key` does not exist in the map. If the `key` does exist, the function
 * will insert the pair `(key, f new_value old_value)`.
 */
export const insertWith =
  <K extends Some, A extends Some>
  (f: (new_value: A) => (old_value: A) => A) =>
  (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    insert<K, A> (key)
                 (maybe<A, A> (value)
                              (f (value))
                              (lookup<K, A> (key) (mp)))
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
  <K extends Some, A extends Some>
  (f: (key: K) => (new_value: A) => (old_value: A) => A) =>
  (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    insert<K, A> (key)
                 (maybe<A, A> (value)
                              (f (key) (value))
                              (lookup<K, A> (key) (mp)))
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
  <K extends Some, A extends Some>
  (f: (key: K) => (new_value: A) => (old_value: A) => A) =>
  (key: K) =>
  (value: A) =>
  (mp: OrderedMap<K, A>): Pair<Maybe<A>, OrderedMap<K, A>> => {
    const maybe_old_value = lookup<K, A> (key) (mp)

    return fromBoth<Maybe<A>, OrderedMap<K, A>> (maybe_old_value)
                                                (insert<K, A> (key)
                                                              (maybe<A, A> (value)
                                                                           (f (key) (value))
                                                                           (maybe_old_value))
                                                              (mp))
  }


// DELETE/UPDATE

/**
 * Removes a key without checking its existence before. For internal use only.
 */
const removeKey =
  <K extends Some, A extends Some> (key: K) => (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    fromArray ([...mp .value] .filter (([k]) => k !== key));

/**
 * `delete :: Ord k => k -> Map k a -> Map k a`
 *
 * Delete a key and its value from the map. When the key is not a member of
 * the map, the original map is returned.
 */
export const sdelete =
  <K extends Some, A extends Some> (key: K) => (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    member (key) (mp) ? removeKey<K, A> (key) (mp) : mp

/**
 * `adjust :: Ord k => (a -> a) -> k -> Map k a -> Map k a`
 *
 * Update a value at a specific key with the result of the provided function.
 * When the key is not a member of the map, the original map is returned.
 */
export const adjust =
  <K extends Some, A extends Some>
  (f: (value: A) => A) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe<A, OrderedMap<K, A>> (mp)
                               (x => insert<K, A> (key) (f (x)) (mp))
                               (lookup<K, A> (key) (mp))

/**
 * `adjustWithKey :: Ord k => (k -> a -> a) -> k -> Map k a -> Map k a`
 *
 * Adjust a value at a specific key. When the key is not a member of the map,
 * the original map is returned.
 */
export const adjustWithKey =
  <K extends Some, A extends Some>
  (f: (key: K) => (value: A) => A) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe<A, OrderedMap<K, A>> (mp)
                               (x => insert<K, A> (key) (f (key) (x)) (mp))
                               (lookup<K, A> (key) (mp))

/**
 * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
 *
 * The expression `(update f k map)` updates the value `x` at `k` (if it is in
 * the map). If `(f x)` is `Nothing`, the element is deleted. If it is
 * `(Just y)`, the key `k` is bound to the new value `y`.
 */
export const update =
  <K extends Some, A extends Some>
  (f: (value: A) => Maybe<A>) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe<A, OrderedMap<K, A>> (mp)
                               (pipe (
                                 f,
                                 maybe_<A, OrderedMap<K, A>> (() => removeKey<K, A> (key) (mp))
                                                             (y => insert<K, A> (key) (y) (mp))
                               ))
                               (lookup<K, A> (key) (mp))

/**
 * `updateWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> Map k a`
 *
 * The expression `(updateWithKey f k map)` updates the value `x` at `k` (if
 * it is in the map). If `(f k x)` is `Nothing`, the element is deleted. If it
 * is `(Just y)`, the key `k` is bound to the new value `y`.
 */
export const updateWithKey =
  <K extends Some, A extends Some>
  (f: (key: K) => (value: A) => Maybe<A>) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe<A, OrderedMap<K, A>> (mp)
                               (pipe (
                                 f (key),
                                 maybe_<A, OrderedMap<K, A>> (() => removeKey<K, A> (key) (mp))
                                                             (y => insert<K, A> (key) (y) (mp))
                               ))
                               (lookup<K, A> (key) (mp))

/**
 * `updateLookupWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a ->
   (Maybe a, Map k a)`
 *
 * Lookup and update. See also `updateWithKey`. The function returns changed
 * value, if it is updated. Returns the original key value if the map entry is
 * deleted.
 */
export const updateLookupWithKey =
  <K extends Some, A extends Some>
  (f: (key: K) => (value: A) => Maybe<A>) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): Pair<Maybe<A>, OrderedMap<K, A>> => {
    const maybe_old_value = lookup<K, A> (key) (mp)

    return maybe_<A, Pair<Maybe<A>, OrderedMap<K, A>>>
      (() => fromBoth<Maybe<A>, OrderedMap<K, A>> (maybe_old_value) (mp))
      (pipe (
        f (key),
        maybe_<A, Pair<Maybe<A>, OrderedMap<K, A>>>
          (() => fromBoth<Maybe<A>, OrderedMap<K, A>> (maybe_old_value)
                                                      (removeKey<K, A> (key) (mp)))
          (x => fromBoth<Maybe<A>, OrderedMap<K, A>> (Just (x))
                                                     (insert<K, A> (key) (x) (mp)))
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
  <K extends Some, A extends Some>
  (f: (old_value: Maybe<A>) => Maybe<A>) =>
  (key: K) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, A> =>
    maybe<A, (mp: OrderedMap<K, A>) => OrderedMap<K, A>> (sdelete<K, A> (key))
                                                         (insert<K, A> (key))
                                                         (f (lookup<K, A> (key) (mp)))
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
  <K extends Some, A extends Some>
  (t1: OrderedMap<K, A>) =>
  (t2: OrderedMap<K, A>): OrderedMap<K, A> =>
    fromArray ([...t1, ...[...t2] .filter (([key]) => !t1 .value .has (key))])


// MAP

/**
 * `map :: (a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const map = fmap;

/**
 * `mapWithKey :: (k -> a -> b) -> Map k a -> Map k b`
 *
 * Map a function over all values in the map.
 */
export const mapWithKey =
  <K extends Some, A extends Some, B extends Some>
  (f: (key: K) => (value: A) => B) =>
  (xs: OrderedMap<K, A>): OrderedMap<K, B> =>
    fromArray ([...xs .value] .map (([k, a]) => [k, f (k) (a)] as [K, B]))


// FOLDS

/**
 * `foldrWithKey :: (k -> a -> b -> b) -> b -> Map k a -> b`
 *
 * Fold the keys and values in the map using the given right-associative binary
 * operator, such that
 * `foldrWithKey f z == foldr (uncurry f) z . toAscList`.
 */
export const foldrWithKey =
  <K extends Some, A extends Some, B extends Some>
  (f: (key: K) => (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: OrderedMap<K, A>): B =>
    [...xs .value] .reduceRight<B> ((acc, e) => f (e [0]) (e [1]) (acc), initial);

/**
 * `foldlWithKey :: (a -> k -> b -> a) -> a -> Map k b -> a`
 *
 * Fold the values in the map using the given left-associative binary
 * operator, such that
 * `foldlWithKey f z == foldl (\z' (kx, x) -> f z' kx x) z . toAscList`.
 */
export const foldlWithKey =
  <K extends Some, A extends Some, B extends Some>
  (f: (acc: B) => (key: K) => (current: A) => B) =>
  (initial: B) =>
  (xs: OrderedMap<K, A>): B =>
    [...xs .value] .reduce<B> ((acc, e) => f (acc) (e [0]) (e [1]), initial);


// CONVERSION

/**
 * `elems :: Map k a -> [a]`
 *
 * Return all elements of the map.
 */
export const elems =
  <A extends Some> (mp: OrderedMap<any, A>): List<A> =>
    List.fromElements (...mp .value .values ())

/**
 * `keys :: Map k a -> [k]`
 *
 * Return all keys of the map.
 */
export const keys =
  <K extends Some> (mp: OrderedMap<K, any>): List<K> =>
    List.fromElements (...mp .value .keys ())

/**
 * `assocs :: Map k a -> [(k, a)]`
 *
 * Return all key/value pairs in the map.
 */
export const assocs = <K extends Some, A extends Some> (mp: OrderedMap<K, A>): List<Pair<K, A>> =>
  List.fromArray ([...mp] .map (([key, value]) => fromBoth<K, A> (key) (value)))

/**
 * `keysSet :: Map k a -> Set k`
 *
 * The set of all keys of the map.
 */
export const keysSet = <K extends Some> (mp: OrderedMap<K, any>): OrderedSet<K> =>
  fromUniqueElements (...mp .value .keys ())

/**
 * `fromSet :: (k -> a) -> Set k -> Map k a`
 *
 * Build a map from a set of keys and a function which for each key computes
 * its value.
 */
export const fromSet =
  <K extends Some, A extends Some>
  (f: (key: K) => A) =>
  (ks: OrderedSet<K>): OrderedMap<K, A> =>
    fromArray ([...ks] .map (k => [k, f (k)] as [K, A]))


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
  <K extends Some, A extends Some> (xs: List<Pair<K, A>>): OrderedMap<K, A> =>
    fromArray (xs .value .map (Pair.toArray))


// FILTER

interface Filter {
  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  <K extends Some, A extends Some, A1 extends A>
  (pred: (x: A) => x is A1): (list: OrderedMap<K, A>) => OrderedMap<K, A1>;

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  <K extends Some, A extends Some>
  (pred: (x: A) => boolean): (list: OrderedMap<K, A>) => OrderedMap<K, A>;
}

/**
 * `filter :: (a -> Bool) -> Map k a -> Map k a`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter: Filter =
  <K extends Some, A extends Some>
  (pred: (x: A) => boolean) => (xs: OrderedMap<K, A>): OrderedMap<K, A> =>
    fromArray ([...xs .value] .filter (([_, value]) => pred (value)));

interface FilterWithKey {
  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  <K extends Some, A extends Some, A1 extends A>
  (pred: (key: K) => (x: A) => x is A1): (list: OrderedMap<K, A>) => OrderedMap<K, A1>;

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  <K extends Some, A extends Some>
  (pred: (key: K) => (x: A) => boolean): (list: OrderedMap<K, A>) => OrderedMap<K, A>;
}

/**
 * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
 *
 * Filter all keys/values that satisfy the predicate.
 */
export const filterWithKey: FilterWithKey =
  <K extends Some, A extends Some>
  (pred: (key: K) => (x: A) => boolean) => (xs: OrderedMap<K, A>): OrderedMap<K, A> =>
    fromArray ([...xs .value] .filter (([key, value]) => pred (key) (value)));

/**
 * `mapMaybe :: (a -> Maybe b) -> Map k a -> Map k b`
 *
 * Map values and collect the `Just` results.
 */
export const mapMaybe =
  <K extends Some, A extends Some, B extends Some>
  (f: (value: A) => Maybe<B>) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, B> =>
    fromArray (
      [...mp] .reduce<[K, B][]> (
        (acc, [key, value]) => maybe<B, [K, B][]> (acc) (x => [...acc, [key, x]]) (f (value)),
        []
      )
    )

/**
 * `mapMaybeWithKey :: (k -> a -> Maybe b) -> Map k a -> Map k b`
 *
 * Map keys/values and collect the `Just` results.
 */
export const mapMaybeWithKey =
  <K extends Some, A extends Some, B extends Some>
  (f: (key: K) => (value: A) => Maybe<B>) =>
  (mp: OrderedMap<K, A>): OrderedMap<K, B> =>
    fromArray (
      [...mp] .reduce<[K, B][]> (
        (acc, [key, value]) => maybe<B, [K, B][]> (acc) (x => [...acc, [key, x]]) (f (key) (value)),
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
  <A extends Some, B extends Some>
  (f: (x: A) => B) =>
  (mp: OrderedMap<string, A>): StringKeyObject<B> =>
    foldlWithKey<string, A, StringKeyObject<B>> (acc => key => value => ({
                                                  ...acc,
                                                  [key]: f (value),
                                                }))
                                                ({})
                                                (mp)

/**
  * Transforms the `OrderedMap` instance into a native `Map`.
  */
export const toMap = <K extends Some, A extends Some> (mp: OrderedMap<K, A>): ReadonlyMap<K, A> =>
  mp .value

/**
 * Checks if the given value is a `OrderedMap`.
 * @param x The value to test.
 */
export const isOrderedMap =
  (x: any): x is OrderedMap<any, any> =>
    typeof x === 'object' && x !== null && x.isOrderedMap;


// NAMESPACED FUNCTIONS

export const OrderedMap = {
  fromUniquePairs,
  fromArray,
  fromMap,

  fmap,
  mapReplace,

  foldr,
  foldl,
  foldr1,
  foldl1,
  toList,
  fnull,
  length,
  elem,
  elem_,
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

  size,
  member,
  member_,
  notMember,
  lookup,
  lookup_,
  findWithDefault,

  empty,
  singleton,

  insert,
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
  mapMaybe,
  mapMaybeWithKey,

  toObjectWith,
  toMap,
  isOrderedMap,
}


// TYPE HELPERS

export type OrderedMapValueElement<A> = A extends OrderedMap<any, infer V> ? V : never

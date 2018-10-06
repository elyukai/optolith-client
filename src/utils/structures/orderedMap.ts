import * as Al from '../../types/algebraic';
import { List } from './list';
import { Just, Maybe, Some } from './maybe';
import { OrderedSet } from './orderedSet';
import { StringKeyObject } from './record';
import { Tuple } from './tuple';

type LookupWithKey<K, V> = Tuple<Maybe<V>, OrderedMap<K, V>>;

export type OrderedMapValueElement<T> =
  T extends OrderedMap<any, infer I> ? I : never;

export class OrderedMap<K, V> implements Al.Functor<V>, Al.Filterable<V>,
  Al.Foldable<V> {
  private readonly value: ReadonlyMap<K, V>;

  private constructor (initial?: ReadonlyMap<K, V> | [K, V][] | List<Tuple<K, V>>) {
    if (initial instanceof Map) {
      this.value = initial;
    }
    else if (initial instanceof List) {
      this.value = new Map (List.toArray (initial).map (e =>
        [Tuple.fst (e), Tuple.snd (e)] as [K, V]
      ));
    }
    // tslint:disable-next-line:prefer-conditional-expression
    else if (initial !== undefined) {
      this.value = new Map (initial);
    }
    else {
      this.value = new Map ();
    }
  }

  [Symbol.iterator] (): IterableIterator<[K, V]> {
    return this.value[Symbol.iterator] ();
  }

  // QUERY

  /**
   * `null :: Map k a -> Bool`
   *
   * Is the map empty?
   */
  null (): boolean {
    return this.value.size === 0;
  }

  /**
   * `size :: Map k a -> Int`
   *
   * The number of elements in the map.
   */
  size (): number {
    return this.value.size;
  }

  /**
   * `member :: Ord k => k -> Map k a -> Bool`
   *
   * Is the key a member of the map?
   */
  member (key: K): boolean {
    return this.value.has (key);
  }

  /**
   * `notMember :: Ord k => k -> Map k a -> Bool`
   *
   * Is the key not a member of the map?
   */
  notMember (key: K): boolean {
    return !this.member (key);
  }

  /**
   * `lookup :: Ord k => k -> Map k a -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   */
  lookup (key: K): Maybe<V> {
    return Maybe.of (this.value.get (key));
  }

  /**
   * `lookup :: Ord k => k -> Map k a -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   */
  static lookup<K, V> (key: K): (m: OrderedMap<K, V>) => Maybe<V> {
    return m => Maybe.fromNullable (m.value .get (key));
  }

  /**
   * `lookup_ :: Ord k => Map k a -> k -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   *
   * Same as `OrderedMap.lookup` but with arguments switched.
   */
  static lookup_<K, V> (m: OrderedMap<K, V>): (key: K) => Maybe<V> {
    return key => OrderedMap.lookup<K, V> (key) (m);
  }

  /**
   * `findWithDefault :: Ord k => a -> k -> Map k a -> a`
   *
   * The expression `(findWithDefault def k map)` returns the value at key `k`
   * or returns default value `def` when the key is not in the map.
   */
  findWithDefault (def: V): (key: K) => V {
    return key => Maybe.fromMaybe (def) (this.lookup (key));
  }

  // CONSTRUCTION

  /**
   * Creates a new `OrderedMap` from a native Map or an array of arrays of
   * values of length 2.
   */
  static of<K, V> (map: ReadonlyMap<K, V> | [K, V][]): OrderedMap<K, V> {
    return new OrderedMap (map);
  }

  /**
   * `empty :: Map k a`
   *
   * The empty map.
   */
  static empty<K, V> (): OrderedMap<K, V> {
    return new OrderedMap ();
  }

  /**
   * `singleton :: k -> a -> Map k a`
   *
   * A map with a single element.
   */
  static singleton<K, V> (key: K): (value: V) => OrderedMap<K, V> {
    return value => new OrderedMap ([[key, value]]);
  }

  // INSERTION

  /**
   * `insert :: Ord k => k -> a -> Map k a -> Map k a`
   *
   * Insert a new key and value in the map. If the key is already present in the
   * map, the associated value is replaced with the supplied value. `insert` is
   * equivalent to `insertWith const`.
   */
  insert (key: K): (value: V) => OrderedMap<K, V> {
    return value => OrderedMap.of ([...this.value, [key, value]]);
  }

  /**
   * `insert :: Ord k => k -> a -> Map k a -> Map k a`
   *
   * Insert a new key and value in the map. If the key is already present in the
   * map, the associated value is replaced with the supplied value. `insert` is
   * equivalent to `insertWith const`.
   */
  static insert<K, V> (key: K): (value: V) => (map: OrderedMap<K, V>) => OrderedMap<K, V> {
    return value => map => OrderedMap.of ([...map.value, [key, value]]);
  }

  /**
   * `insertWith :: Ord k => (a -> a -> a) -> k -> a -> Map k a -> Map k a`
   *
   * Insert with a function, combining new value and old value.
   * `insertWith f key value mp` will insert the pair `(key, value)` into `mp`
   * if `key` does not exist in the map. If the `key` does exist, the function
   * will insert the pair `(key, f new_value old_value)`.
   */
  insertWith (
    fn: (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => OrderedMap<K, V> {
    return (key: K) => (value: V) => {
      const entry = this.lookup (key);
      if (Maybe.isJust (entry)) {
        return OrderedMap.of ([
          ...this.value,
          [key, fn (Maybe.fromJust (entry)) (value)],
        ]);
      }
      else {
        return OrderedMap.of ([...this.value, [key, value]]);
      }
    };
  }

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
  insertWithKey (
    fn: (key: K) => (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => OrderedMap<K, V> {
    return (key: K) => (value: V) => {
      const entry = this.lookup (key);
      if (Maybe.isJust (entry)) {
        return OrderedMap.of ([
          ...this.value,
          [key, fn (key) (Maybe.fromJust (entry)) (value)],
        ]);
      }
      else {
        return OrderedMap.of ([...this.value, [key, value]]);
      }
    };
  }

  /**
   * `insertLookupWithKey :: Ord k => (k -> a -> a -> a) -> k -> a -> Map k a ->
     (Maybe a, Map k a)`
   *
   * Combines insert operation with old value retrieval. The expression
   * `(insertLookupWithKey f k x map)` is a pair where the first element is
   * equal to `(lookup k map)` and the second element equal to
   * `(insertWithKey f k x map)`.
   */
  insertLookupWithKey (
    fn: (key: K) => (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => LookupWithKey<K, V> {
    return key => value =>
      Tuple.of<Maybe<V>, OrderedMap<K, V>> (this.lookup (key))
        (this.insertWithKey (fn) (key) (value));
  }

  // DELETE/UPDATE

  /**
   * Removes a key without checking its existence before. For internal use only.
   */
  private removeKey (key: K): OrderedMap<K, V> {
    return List.toMap (OrderedMap.toList (this)
      .filter (t => Tuple.fst (t) !== key));
  }

  /**
   * `delete :: Ord k => k -> Map k a -> Map k a`
   *
   * Delete a key and its value from the map. When the key is not a member of
   * the map, the original map is returned.
   */
  delete (key: K): OrderedMap<K, V> {
    return this.member (key) ? this.removeKey (key) : this;
  }

  /**
   * `adjust :: Ord k => (a -> a) -> k -> Map k a -> Map k a`
   *
   * Update a value at a specific key with the result of the provided function.
   * When the key is not a member of the map, the original map is returned.
   */
  adjust (fn: (value: V) => V): (key: K) => OrderedMap<K, V> {
    return key => {
      const entry = this.lookup (key);

      return Maybe.isJust (entry)
        ? OrderedMap.of ([...this.value, [key, fn (Maybe.fromJust (entry))]])
        : this;
    };
  }

  /**
   * `adjustWithKey :: Ord k => (k -> a -> a) -> k -> Map k a -> Map k a`
   *
   * Adjust a value at a specific key. When the key is not a member of the map,
   * the original map is returned.
   */
  adjustWithKey (fn: (key: K) => (value: V) => V): (key: K) => OrderedMap<K, V> {
    return key => {
      const entry = this.lookup (key);

      return Maybe.isJust (entry)
        ? new OrderedMap ([...this.value, [key, fn (key) (Maybe.fromJust (entry))]])
        : this;
    };
  }

  /**
   * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(update f k map)` updates the value `x` at `k` (if it is in
   * the map). If `(f x)` is `Nothing`, the element is deleted. If it is
   * `(Just y)`, the key `k` is bound to the new value `y`.
   */
  update (fn: (value: V) => Maybe<V>): (key: K) => OrderedMap<K, V> {
    return key => {
      const entry = this.lookup (key);

      if (Maybe.isJust (entry)) {
        const res = fn (Maybe.fromJust (entry));

        if (Maybe.isJust (res)) {
          return new OrderedMap ([...this.value, [key, Maybe.fromJust (res)]]);
        }
        else {
          return this.removeKey (key);
        }
      }
      else {
        return this;
      }
    };
  }

  /**
   * `updateWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(updateWithKey f k map)` updates the value `x` at `k` (if
   * it is in the map). If `(f k x)` is `Nothing`, the element is deleted. If it
   * is `(Just y)`, the key `k` is bound to the new value `y`.
   */
  updateWithKey (fn: (key: K) => (value: V) => Maybe<V>): (key: K) => OrderedMap<K, V> {
    return key => {
      const entry = this.lookup (key);

      if (Maybe.isJust (entry)) {
        const res = fn (key) (Maybe.fromJust (entry));

        if (Maybe.isJust (res)) {
          return new OrderedMap ([...this.value, [key, Maybe.fromJust (res)]]);
        }
        else {
          return this.removeKey (key);
        }
      }
      else {
        return this;
      }
    };
  }

  /**
   * `updateLookupWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a ->
   * (Maybe a, Map k a)`
   *
   * Lookup and update. See also `updateWithKey`. The function returns changed
   * value, if it is updated. Returns the original key value if the map entry is
   * deleted.
   */
  updateLookupWithKey (
    fn: (key: K) => (value: V) => Maybe<V>
  ): (key: K) => LookupWithKey<K, V> {
    return key => {
      const entry = this.lookup (key);

      if (Maybe.isJust (entry)) {
        const res = fn (key) (Maybe.fromJust (entry));

        if (Maybe.isJust (res)) {
          return Tuple.of<Maybe<V>, OrderedMap<K, V>> (res) (new OrderedMap ([
            ...this.value,
            [key, Maybe.fromJust (res)],
          ]));
        }
        else {
          return Tuple.of<Maybe<V>, OrderedMap<K, V>> (entry) (this.removeKey (key));
        }
      }
      else {
        return Tuple.of<Maybe<V>, OrderedMap<K, V>> (entry) (this);
      }
    };
  }

  /**
   * `alter :: Ord k => (Maybe a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(alter f k map)` alters the value `x` at `k`, or absence
   * thereof. `alter` can be used to insert, delete, or update a value in a
   * `Map`. In short : `lookup k (alter f k m) = f (lookup k m)`.
   */
  alter (fn: (x: Maybe<V>) => Maybe<V>): (key: K) => OrderedMap<K, V> {
    return key => {
      const entry = this.lookup (key);
      const res = fn (entry);

      if (Maybe.isJust (res)) {
        return this.insert (key) (Maybe.fromJust (res));
      }
      else {
        return this.delete (key);
      }
    };
  }

  /**
   * `union :: Ord k => Map k a -> Map k a -> Map k a`
   *
   *  The expression `(union t1 t2)` takes the left-biased union of `t1` and
   * `t2`. It prefers `t1` when duplicate keys are encountered, i.e.
   * `(union == unionWith const)`.
   */
  union (add: OrderedMap<K, V>) {
    return OrderedMap.of ([
      ...this.value,
      ...[...add.value].filter (e => !this.value.has (e[0])),
    ]);
  }

  /**
   * `fmap :: (a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  fmap<U> (fn: (value: V) => U): OrderedMap<K, U> {
    return OrderedMap.of ([...this.value].map (([k, x]) =>
      [k, fn (x)] as [K, U]
    ));
  }

  /**
   * `map :: (a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  map<U> (fn: (value: V) => U): OrderedMap<K, U> {
    return this.fmap (fn);
  }

  /**
   * `map :: (a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  static map<K, A, B> (fn: (value: A) => B): (map: OrderedMap<K, A>) => OrderedMap<K, B> {
    return map => OrderedMap.of ([...map.value].map (([k, x]) =>
      [k, fn (x)] as [K, B]
    ));
  }

  /**
   * `mapWithKey :: (k -> a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  mapWithKey<U> (fn: (key: K) => (value: V) => U): OrderedMap<K, U> {
    return OrderedMap.of ([...this.value].map (([k, x]) =>
      [k, fn (k) (x)] as [K, U]
    ));
  }

  // FOLDS

  foldl<U extends Some> (fn: (acc: U) => (current: V) => U): (initial: U) => U {
    return initial => [...this.value].reduce<U> ((acc, [_, value]) => fn (acc) (value), initial);
  }

  static foldl<V, U extends Some> (fn: (acc: U) => (current: V) => U): (initial: U) =>
    (map: OrderedMap<any, V>) => U {
    return initial => map => [...map.value].reduce<U> (
      (acc, [_, value]) => fn (acc) (value),
      initial
    );
  }

  /**
   * `foldlWithKey :: (a -> k -> b -> a) -> a -> Map k b -> a`
   *
   * Fold the values in the map using the given left-associative binary
   * operator, such that
   * `foldlWithKey f z == foldl (\z' (kx, x) -> f z' kx x) z . toAscList`.
   */
  foldlWithKey<U extends Some> (fn: (acc: U) => (key: K) => (current: V) => U): (initial: U) => U {
    return initial => [...this.value].reduce<U> (
      (acc, [key, value]) => fn (acc) (key) (value),
      initial
    );
  }

  /**
   * `foldr :: (a -> b -> b) -> b -> Map k a -> b`
   *
   * Fold the values in the map using the given right-associative binary
   * operator, such that `foldr f z == foldr f z . elems`.
   *
   * For example,
   *
   * `elems map = foldr (:) [] map`
   */
  foldr<U extends Some> (fn: (acc: U) => (current: V) => U): (initial: U) => U {
    return initial => OrderedMap.foldr (fn) (initial) (this);
  }

  /**
   * `foldr :: (a -> b -> b) -> b -> Map k a -> b`
   *
   * Fold the values in the map using the given right-associative binary
   * operator, such that `foldr f z == foldr f z . elems`.
   *
   * For example,
   *
   * `elems map = foldr (:) [] map`
   */
  static foldr<V, U extends Some> (fn: (acc: U) => (current: V) => U): (initial: U) =>
    (map: OrderedMap<any, V>) => U {
    return initial => map => [...map.value].reduceRight<U> (
      (acc, [_, value]) => fn (acc) (value),
      initial
    );
  }

  // CONVERSION

  /**
   * `elems :: Map k a -> [a]`
   *
   * Return all elements of the map.
   */
  elems (): List<V> {
    return List.return (...this.value.values ());
  }

  /**
   * `elems :: Map k a -> [a]`
   *
   * Return all elements of the map.
   */
  static elems<K, V> (map: OrderedMap<K, V>): List<V> {
    return map.elems ();
  }

  /**
   * `keys :: Map k a -> [k]`
   *
   * Return all keys of the map.
   */
  keys (): List<K> {
    return List.return (...this.value.keys ());
  }

  /**
   * `assocs :: Map k a -> [(k, a)]`
   *
   * Return all key/value pairs in the map.
   */
  assocs (): List<Tuple<K, V>> {
    return List.fromArray (
      [...this.value].map (([key, value]) => Tuple.of<K, V> (key) (value))
    );
  }

  /**
   * `keysSet :: Map k a -> Set k`
   *
   * The set of all keys of the map.
   */
  keysSet (): OrderedSet<K> {
    return OrderedSet.of ([...this.value.keys ()]);
  }

  /**
   * `fromSet :: (k -> a) -> Set k -> Map k a`
   *
   * Build a map from a set of keys and a function which for each key computes
   * its value.
   */
  static fromSet<K, V> (f: (key: K) => V): (keys: OrderedSet<K>) => OrderedMap<K, V> {
    return keys =>
      keys.foldl<OrderedMap<K, V>> (acc => key => acc.insert (key) (f (key))) (OrderedMap.empty ());
  }

  // LISTS

  /**
   * `toList :: Map k a -> [(k, a)]`
   *
   * Convert the map to a list of key/value pairs. Subject to list fusion.
   */
  toList (): List<Tuple<K, V>> {
    return List.fromArray (
      [...this.value].map (([key, value]) => Tuple.of<K, V> (key) (value))
    );
  }

  /**
   * `toList :: Map k a -> [(k, a)]`
   *
   * Convert the map to a list of key/value pairs. Subject to list fusion.
   */
  static toList<K, V> (map: OrderedMap<K, V>): List<Tuple<K, V>> {
    return map.toList ();
  }

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
  static fromList<K, V> (list: List<Tuple<K, V>>): OrderedMap<K, V> {
    return list.foldl<OrderedMap<K, V>> (
      map => tuple => map.insert (Tuple.fst (tuple)) (Tuple.snd (tuple))
    ) (OrderedMap.empty<K, V> ());
  }

  // FILTER

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  filter<U extends V> (pred: (value: V) => value is U): OrderedMap<K, U>;
  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  filter (pred: (value: V) => boolean): OrderedMap<K, V>;
  filter (pred: (value: V) => boolean): OrderedMap<K, V> {
    return OrderedMap.of ([...this.value].filter (([_, value]) => pred (value)));
  }

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  filterWithKey<U extends V> (
    pred: (key: K) => (value: V) => value is U
  ): OrderedMap<K, U>;
  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  filterWithKey (pred: (key: K) => (value: V) => boolean): OrderedMap<K, V>;
  filterWithKey (pred: (key: K) => (value: V) => boolean): OrderedMap<K, V> {
    return OrderedMap.of ([...this.value]
      .filter (([key, value]) => pred (key) (value)));
  }

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  static filterWithKey<K, A, B extends A> (
    pred: (key: K) => (value: A) => value is B
  ): (map: OrderedMap<K, A>) => OrderedMap<K, B>;
  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  static filterWithKey<K, A> (
    pred: (key: K) => (value: A) => boolean
  ): (map: OrderedMap<K, A>) => OrderedMap<K, A>;
  static filterWithKey<K, A> (
    pred: (key: K) => (value: A) => boolean
  ): (map: OrderedMap<K, A>) => OrderedMap<K, A> {
    return map => OrderedMap.of (
      [...map.value]
        .filter (([key, value]) => pred (key) (value))
    );
  }

  /**
   * `mapMaybe :: (a -> Maybe b) -> Map k a -> Map k b`
   *
   * Map values and collect the `Just` results.
   */
  mapMaybe<T> (f: (value: V) => Maybe<T>): OrderedMap<K, T> {
    return OrderedMap.of (
      [...this.value]
        .map (([k, v]) => [k, f (v)] as [K, Maybe<T>])
        .filter ((pair): pair is [K, Just<T>] => Maybe.isJust (pair[1]))
        .map (([k, v]) => [k, Maybe.fromJust (v)] as [K, T])
    );
  }

  /**
   * `mapMaybe :: (a -> Maybe b) -> Map k a -> Map k b`
   *
   * Map values and collect the `Just` results.
   */
  static mapMaybe<K, A, B> (f: (value: A) => Maybe<B>):
    (map: OrderedMap<K, A>) => OrderedMap<K, B> {
    return map => OrderedMap.of (
      [...map.value]
        .map (([k, v]) => [k, f (v)] as [any, Maybe<B>])
        .filter ((pair): pair is [any, Just<B>] => Maybe.isJust (pair[1]))
        .map (([k, v]) => [k, Maybe.fromJust (v)] as [any, B])
    );
  }

  /**
   * `mapMaybeWithKey :: (k -> a -> Maybe b) -> Map k a -> Map k b`
   *
   * Map keys/values and collect the `Just` results.
   */
  mapMaybeWithKey<T> (f: (key: K) => (value: V) => Maybe<T>): OrderedMap<K, T> {
    return OrderedMap.of (
      [...this.value]
        .map (([k, v]) => [k, f (k) (v)] as [K, Maybe<T>])
        .filter ((pair): pair is [K, Just<T>] => Maybe.isJust (pair[1]))
        .map (([k, v]) => [k, Maybe.fromJust (v)] as [K, T])
    );
  }

  /**
   * Transforms an `OrderedMap` into a native object, where the keys in the map are the
   * object keys and the values of the `OrderedMap` are the corresponding
   * values of the object, applied to the provided `fn` function before.
   * @param fn Transforms the value before inserting it into the object.
   */
  toKeyValueObjectWith<U> (
    this: OrderedMap<string, V>,
    fn: (x: V) => U
  ): StringKeyObject<U> {
    return this.foldlWithKey<StringKeyObject<U>> (
      acc => key => value => ({ ...acc, [key]: fn (value) })
    ) ({});
  }

  /**
   * Transforms the `OrderedMap` instance into a native `Map`.
   */
  toMap (): ReadonlyMap<K, V> {
    return this.value;
  }
}

import * as Al from '../../types/algebraic.d';
import { List } from './list';
import { Maybe, Some } from './maybe';
import { StringKeyObject } from './record';
import { Tuple } from './tuple';

type LookupWithKey<K, V> = Tuple<Maybe<V>, OrderedMap<K, V>>;

export type OrderedMapValueElement<T> =
  T extends OrderedMap<any, infer I> ? I : never;

export class OrderedMap<K, V> implements Al.Functor<V>, Al.Filterable<V>,
  Al.Foldable<V> {
  private readonly value: ReadonlyMap<K, V>;

  private constructor(initial?: ReadonlyMap<K, V> | [K, V][] | List<Tuple<K, V>>) {
    if (initial instanceof Map) {
      this.value = initial;
    }
    else if (initial instanceof List) {
      this.value = new Map(List.toArray(initial).map(e =>
        [Tuple.fst(e), Tuple.snd(e)] as [K, V]
      ));
    }
    // tslint:disable-next-line:prefer-conditional-expression
    else if (initial !== undefined) {
      this.value = new Map(initial);
    }
    else {
      this.value = new Map();
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.value[Symbol.iterator]();
  }

  // QUERY

  /**
   * `null :: Map k a -> Bool`
   *
   * Is the map empty?
   */
  null(): boolean {
    return this.value.size === 0;
  }

  /**
   * `size :: Map k a -> Int`
   *
   * The number of elements in the map.
   */
  size(): number {
    return this.value.size;
  }

  /**
   * `member :: Ord k => k -> Map k a -> Bool`
   *
   * Is the key a member of the map?
   */
  member(key: K): boolean {
    return this.value.has(key);
  }

  /**
   * `notMember :: Ord k => k -> Map k a -> Bool`
   *
   * Is the key not a member of the map?
   */
  notMember(key: K): boolean {
    return !this.member(key);
  }

  /**
   * `lookup :: Ord k => k -> Map k a -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   */
  lookup(key: K): Maybe<V> {
    return Maybe.of(this.value.get(key));
  }

  /**
   * `findWithDefault :: Ord k => a -> k -> Map k a -> a`
   *
   * The expression `(findWithDefault def k map)` returns the value at key `k`
   * or returns default value `def` when the key is not in the map.
   */
  findWithDefault(def: V): (key: K) => V;
  findWithDefault(def: V, key: K): V;
  findWithDefault(def: V, key?: K): V | ((key: K) => V) {
    if (arguments.length === 2) {
      return Maybe.fromMaybe(def)(this.lookup(key!));
    }

    return x2 => Maybe.fromMaybe(def)(this.lookup(x2));
  }

  // INSERTION

  /**
   * `insert :: Ord k => k -> a -> Map k a -> Map k a`
   *
   * Insert a new key and value in the map. If the key is already present in the
   * map, the associated value is replaced with the supplied value. `insert` is
   * equivalent to `insertWith const`.
   */
  insert(key: K): (value: V) => OrderedMap<K, V>;
  insert(key: K, value: V): OrderedMap<K, V>;
  insert(
    key: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>) {
    if (arguments.length === 2) {
      return new OrderedMap([...this.value, [key, value!]]);
    }
    else {
      return x2 => new OrderedMap([...this.value, [key, x2]]);
    }
  }

  /**
   * `insertWith :: Ord k => (a -> a -> a) -> k -> a -> Map k a -> Map k a`
   *
   * Insert with a function, combining new value and old value.
   * `insertWith f key value mp` will insert the pair `(key, value)` into `mp`
   * if `key` does not exist in the map. If the `key` does exist, the function
   * will insert the pair `(key, f new_value old_value)`.
   */
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => OrderedMap<K, V>;
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V, key: K
  ): (value: V) => OrderedMap<K, V>;
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V, key: K, value: V
  ): OrderedMap<K, V>;
  insertWith(
    fn: (oldValue: V) => (newValue: V) => V, key?: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>)
    | ((key: K) => (value: V) => OrderedMap<K, V>) {
    const resultFn =
      (x1: (oldValue: V) => (newValue: V) => V, x2: K, x3: V) => {
        const entry = this.lookup(x2);
        if (Maybe.isJust(entry)) {
          return new OrderedMap([
            ...this.value,
            [x2, x1(Maybe.fromJust(entry))(x3)]
          ]);
        }
        else {
          return new OrderedMap([...this.value, [x2, x3]]);
        }
      };

    if (arguments.length === 3) {
      return resultFn(fn, key!, value!);
    }
    else if (arguments.length === 2) {
      return (x3: V) => resultFn(fn, key!, x3);
    }
    else {
      return (x2: K) => (x3: V) => resultFn(fn, x2, x3);
    }
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
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => OrderedMap<K, V>;
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K
  ): (value: V) => OrderedMap<K, V>;
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K, value: V
  ): OrderedMap<K, V>;
  insertWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key?: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>)
    | ((key: K) => (value: V) => OrderedMap<K, V>) {
    const resultFn =
      (x1: (key: K) => (oldValue: V) => (newValue: V) => V, x2: K, x3: V) => {
        const entry = this.lookup(x2);
        if (Maybe.isJust(entry)) {
          return new OrderedMap([
            ...this.value,
            [x2, x1(x2)(Maybe.fromJust(entry))(x3)]
          ]);
        }
        else {
          return new OrderedMap([...this.value, [x2, x3]]);
        }
      };

    if (arguments.length === 3) {
      return resultFn(fn, key!, value!);
    }
    else if (arguments.length === 2) {
      return (x3: V) => resultFn(fn, key!, x3);
    }
    else {
      return (x2: K) => (x3: V) => resultFn(fn, x2, x3);
    }
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
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V
  ): (key: K) => (value: V) => LookupWithKey<K, V>;
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K
  ): (value: V) => LookupWithKey<K, V>;
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key: K, value: V
  ): LookupWithKey<K, V>;
  insertLookupWithKey(
    fn: (key: K) => (oldValue: V) => (newValue: V) => V, key?: K, value?: V
  ): LookupWithKey<K, V> | ((value: V) => LookupWithKey<K, V>)
    | ((key: K) => (value: V) => LookupWithKey<K, V>) {
    const resultFn = (
      x1: (key: K) => (oldValue: V) => (newValue: V) => V,
      x2: K,
      x3: V
    ) => Tuple.of(this.lookup(x2), this.insertWithKey(x1, x2, x3!));

    if (arguments.length === 3) {
      return resultFn(fn, key!, value!);
    }
    else if (arguments.length === 2) {
      return (x3: V) => resultFn(fn, key!, x3);
    }
    else {
      return (x2: K) => (x3: V) => resultFn(fn, x2, x3);
    }
  }

  // DELETE/UPDATE

  /**
   * Removes a key without checking its existence before. For internal use only.
   */
  private removeKey(key: K): OrderedMap<K, V> {
    return List.toMap(OrderedMap.toList(this)
      .filter(t => Tuple.fst(t) !== key));
  }

  /**
   * `delete :: Ord k => k -> Map k a -> Map k a`
   *
   * Delete a key and its value from the map. When the key is not a member of
   * the map, the original map is returned.
   */
  delete(key: K): OrderedMap<K, V> {
    return this.member(key) ? this.removeKey(key) : this;
  }

  /**
   * `adjust :: Ord k => (a -> a) -> k -> Map k a -> Map k a`
   *
   * Update a value at a specific key with the result of the provided function.
   * When the key is not a member of the map, the original map is returned.
   */
  adjust(fn: (value: V) => V): (key: K) => OrderedMap<K, V>;
  adjust(fn: (value: V) => V, key: K): OrderedMap<K, V>;
  adjust(
    fn: (value: V) => V,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (x1: (value: V) => V, x2: K) => {
      const entry = this.lookup(x2);

      return Maybe.isJust(entry)
        ? new OrderedMap([...this.value, [x2, x1(Maybe.fromJust(entry))]])
        : this;
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (x2: K) => resultFn(fn, x2);
    }
  }

  /**
   * `adjustWithKey :: Ord k => (k -> a -> a) -> k -> Map k a -> Map k a`
   *
   * Adjust a value at a specific key. When the key is not a member of the map,
   * the original map is returned.
   */
  adjustWithKey(fn: (key: K) => (value: V) => V): (key: K) => OrderedMap<K, V>;
  adjustWithKey(fn: (key: K) => (value: V) => V, key: K): OrderedMap<K, V>;
  adjustWithKey(
    fn: (key: K) => (value: V) => V,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (x1: (key: K) => (value: V) => V, x2: K) => {
      const entry = this.lookup(x2);

      return Maybe.isJust(entry)
        ? new OrderedMap([...this.value, [x2, x1(x2)(Maybe.fromJust(entry))]])
        : this;
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (x2: K) => resultFn(fn, x2);
    }
  }

  /**
   * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(update f k map)` updates the value `x` at `k` (if it is in
   * the map). If `(f x)` is `Nothing`, the element is deleted. If it is
   * `(Just y)`, the key `k` is bound to the new value `y`.
   */
  update(fn: (value: V) => Maybe<V>): (key: K) => OrderedMap<K, V>;
  update(fn: (value: V) => Maybe<V>, key: K): OrderedMap<K, V>;
  update(
    fn: (value: V) => Maybe<V>,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (x1: (value: V) => Maybe<V>, x2: K) => {
      const entry = this.lookup(x2);
      if (Maybe.isJust(entry)) {
        const res = x1(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return new OrderedMap([...this.value, [x2, Maybe.fromJust(res)]]);
        }
        else {
          return this.removeKey(x2);
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (x2: K) => resultFn(fn, x2);
    }
  }

  /**
   * `updateWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(updateWithKey f k map)` updates the value `x` at `k` (if
   * it is in the map). If `(f k x)` is `Nothing`, the element is deleted. If it
   * is `(Just y)`, the key `k` is bound to the new value `y`.
   */
  updateWithKey(
    fn: (key: K) => (value: V) => Maybe<V>
  ): (key: K) => OrderedMap<K, V>;
  updateWithKey(
    fn: (key: K) => (value: V) => Maybe<V>, key: K
  ): OrderedMap<K, V>;
  updateWithKey(
    fn: (key: K) => (value: V) => Maybe<V>,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (x1: (key: K) => (value: V) => Maybe<V>, x2: K) => {
      const entry = this.lookup(x2);
      if (Maybe.isJust(entry)) {
        const res = x1(x2)(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return new OrderedMap([...this.value, [x2, Maybe.fromJust(res)]]);
        }
        else {
          return this.removeKey(x2);
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (x2: K) => resultFn(fn, x2);
    }
  }

  /**
   * `updateLookupWithKey :: Ord k => (k -> a -> Maybe a) -> k -> Map k a ->
   * (Maybe a, Map k a)`
   *
   * Lookup and update. See also `updateWithKey`. The function returns changed
   * value, if it is updated. Returns the original key value if the map entry is
   * deleted.
   */
  updateLookupWithKey(
    fn: (key: K) => (value: V) => Maybe<V>, key?: K
  ): LookupWithKey<K, V> | ((key: K) => LookupWithKey<K, V>)
    | ((key: K) => (value: V) => LookupWithKey<K, V>) {
      const resultFn = (
        x1: (key: K) => (value: V) => Maybe<V>,
        x2: K
      ): LookupWithKey<K, V> => {
        const entry = this.lookup(x2);
        if (Maybe.isJust(entry)) {
          const res = x1(x2)(Maybe.fromJust(entry));
          if (Maybe.isJust(res)) {
            return Tuple.of(res, new OrderedMap([
              ...this.value,
              [x2, Maybe.fromJust(res)]
            ]));
          }
          else {
            return Tuple.of(entry, this.removeKey(x2));
          }
        }
        else {
          return Tuple.of(entry, this);
        }
      };

      if (arguments.length === 2) {
        return resultFn(fn, key!);
      }
      else {
        return (x2: K) => resultFn(fn, x2);
      }
    }

  /**
   * `alter :: Ord k => (Maybe a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * The expression `(alter f k map)` alters the value `x` at `k`, or absence
   * thereof. `alter` can be used to insert, delete, or update a value in a
   * `Map`. In short : `lookup k (alter f k m) = f (lookup k m)`.
   */
  alter(fn: (x: Maybe<V>) => Maybe<V>): (key: K) => OrderedMap<K, V>;
  alter(fn: (x: Maybe<V>) => Maybe<V>, key: K): OrderedMap<K, V>;
  alter(
    fn: (x: Maybe<V>) => Maybe<V>,
    key?: K
  ): OrderedMap<K, V> | ((key: K) => OrderedMap<K, V>) {
    const resultFn = (x2: K) => {
      const entry = this.lookup(x2);
      const res = fn(entry);

      if (Maybe.isJust(res)) {
        return this.insert(x2, Maybe.fromJust(res));
      }
      else {
        return this.delete(x2);
      }
    };

    if (arguments.length === 2 && key !== undefined) {
      return resultFn(key);
    }
    else {
      return resultFn;
    }
  }

  /**
   * `union :: Ord k => Map k a -> Map k a -> Map k a`
   *
   *  The expression `(union t1 t2)` takes the left-biased union of `t1` and
   * `t2`. It prefers `t1` when duplicate keys are encountered, i.e. `(union ==
   * unionWith const)`.
   */
  union(add: OrderedMap<K, V>) {
    return OrderedMap.of(new Map([...this.value, ...add.value]));
  }

  /**
   * `map :: (a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  map<U>(fn: (value: V) => U): OrderedMap<K, U> {
    return OrderedMap.of(new Map([...this.value].map(([k, x]) =>
      [k, fn(x)] as [K, U]
    )));
  }

  /**
   * `mapWithKey :: (k -> a -> b) -> Map k a -> Map k b`
   *
   * Map a function over all values in the map.
   */
  mapWithKey<U>(fn: (key: K) => (value: V) => U): OrderedMap<K, U> {
    return OrderedMap.of(new Map([...this.value].map(([k, x]) =>
      [k, fn(k)(x)] as [K, U]
    )));
  }

  // FOLDS

  /**
   * `foldl :: (a -> b -> a) -> a -> Map k b -> a`
   *
   * Fold the values in the map using the given left-associative binary
   * operator, such that `foldl f z == foldl f z . elems`.
   */
  foldl<U extends Some>(fn: (acc: U) => (current: V) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: V) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: V) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (x1: (acc: U) => (current: V) => U) => (x2: U) =>
      [...this.value].reduce<U>((acc, [_, value]) => x1(acc)(value), x2);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  /**
   * `foldlWithKey :: (a -> k -> b -> a) -> a -> Map k b -> a`
   *
   * Fold the values in the map using the given left-associative binary
   * operator, such that
   * `foldlWithKey f z == foldl (\z' (kx, x) -> f z' kx x) z . toAscList`.
   */
  foldlWithKey<U extends Some>(
    fn: (acc: U) => (key: K) => (current: V) => U
  ): (initial: U) => U;
  foldlWithKey<U extends Some>(
    fn: (acc: U) => (key: K) => (current: V) => U, initial: U
  ): U;
  foldlWithKey<U extends Some>(
    fn: (acc: U) => (key: K) => (current: V) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (x1: (acc: U) => (key: K) => (current: V) => U) =>
      (x2: U) =>
        [...this.value].reduce<U>(
          (acc, [key, value]) => x1(acc)(key)(value),
          x2
        );

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  // CONVERSION

  /**
   * `elems :: Map k a -> [a]`
   *
   * Return all elements of the map.
   */
  elems(): List<V> {
    return List.of(...this.value.values());
  }

  /**
   * `keys :: Map k a -> [k]`
   *
   * Return all keys of the map.
   */
  keys(): List<K> {
    return List.of(...this.value.keys());
  }

  /**
   * `assocs :: Map k a -> [(k, a)]`
   *
   * Return all key/value pairs in the map.
   */
  assocs(): List<Tuple<K, V>> {
    return List.of(
      ...[...this.value].map(([key, value]) => Tuple.of(key, value))
    );
  }

  // FILTER

  /**
   * `filter :: (a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all values that satisfy the predicate.
   */
  filter<U extends V>(pred: (value: V) => value is U): OrderedMap<K, U>;
  filter(pred: (value: V) => boolean): OrderedMap<K, V>;
  filter(pred: (value: V) => boolean): OrderedMap<K, V> {
    return OrderedMap.of([...this.value].filter(([_, value]) => pred(value)));
  }

  /**
   * `filterWithKey :: (k -> a -> Bool) -> Map k a -> Map k a`
   *
   * Filter all keys/values that satisfy the predicate.
   */
  filterWithKey<U extends V>(
    pred: (key: K) => (value: V) => value is U
  ): OrderedMap<K, U>;
  filterWithKey(pred: (key: K) => (value: V) => boolean): OrderedMap<K, V>;
  filterWithKey(pred: (key: K) => (value: V) => boolean): OrderedMap<K, V> {
    return OrderedMap.of([...this.value]
      .filter(([key, value]) => pred(key)(value)));
  }

  toJSObjectBy<U>(
    this: OrderedMap<string, V>,
    fn: (x: V) => U
  ): StringKeyObject<U> {
    return this.foldlWithKey<StringKeyObject<U>>(
      acc => key => value => ({ ...acc, [key]: fn(value) }),
      {}
    );
  }

  toMap(): ReadonlyMap<K, V> {
    return this.value;
  }

  static of<K, V>(
    map: ReadonlyMap<K, V> | [K, V][] | List<Tuple<K, V>>
  ): OrderedMap<K, V> {
    return new OrderedMap(map);
  }

  /**
   * `empty :: Map k a`
   *
   * The empty map.
   */
  static empty<K, V>(): OrderedMap<K, V> {
    return new OrderedMap();
  }

  /**
   * `singleton :: k -> a -> Map k a`
   *
   * A map with a single element.
   */
  static singleton<K, V>(key: K): (value: V) => OrderedMap<K, V>;
  static singleton<K, V>(key: K, value: V): OrderedMap<K, V>;
  static singleton<K, V>(
    key: K, value?: V
  ): OrderedMap<K, V> | ((value: V) => OrderedMap<K, V>) {
    if (arguments.length === 2) {
      return new OrderedMap([[key, value as V]]);
    }
    else {
      return x2 => new OrderedMap([[key, x2]]);
    }
  }

  static toList<K, V>(map: OrderedMap<K, V>): List<Tuple<K, V>> {
    return List.of(
      ...[...map.value].map(([key, value]) => Tuple.of(key, value))
    );
  }

  static toValueList<K, V>(map: OrderedMap<K, V>): List<V> {
    return List.of(...[...map.value.values()]);
  }

  // INSTANCE METHODS AS STATIC FUNCTIONS

  /**
   * `lookup :: Ord k => k -> Map k a -> Maybe a`
   *
   * Lookup the value at a key in the map. The function will return the
   * corresponding value as `Just value`, or `Nothing` if the key isn't in the
   * map.
   */
  static lookup<K, V>(key: K): (m: OrderedMap<K, V>) => Maybe<V>;
  static lookup<K, V>(key: K, m: OrderedMap<K, V>): Maybe<V>;
  static lookup<K, V>(
    key: K, m?: OrderedMap<K, V>
  ): Maybe<V> | ((m: OrderedMap<K, V>) => Maybe<V>) {
    const resultFn = (x1: K, x2: OrderedMap<K, V>) => x2.lookup(x1);

    if (arguments.length === 2) {
      return resultFn(key, m!);
    }
    else {
      return x2 => resultFn(key, x2);
    }
  }
}

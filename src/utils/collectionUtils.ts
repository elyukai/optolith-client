import R from 'ramda';
import { Maybe } from './dataUtils';

export type ArrayElement<T> = T extends ReadonlyArray<infer I> ? I : never;
export type ArrayFilter<T> = (list: T[]) => T[];
export type MapValueElement<T> = T extends ReadonlyMap<any, infer I> ? I : never;

type ReadonlyMapUpdater<K, V> = (list: ReadonlyMap<K, V>) => ReadonlyMap<K, V>;

/**
 * Appends an element to an array and returns a new array.
 * @param list
 */
export const addToArray = <T>(
  list: ReadonlyArray<T>,
) => (add: T) => R.append(add, list);

/**
 * Sets an element in an array by index and returns a new array.
 * @param list
 */
export const updateArrayItem = <T>(
  list: ReadonlyArray<T>,
) => (index: number, element: T) => R.update(index, element, list);

/**
 * Removes an element at the given index and returns a new array with the
 * remaining elements.
 * @param list
 */
export const removeFromArray = <T>(
  list: ReadonlyArray<T>,
) => (index: number) => R.remove(index, 1, list);

/**
 * Removes an element at the given index and returns a new array with the
 * remaining elements. Reversed funtion order.
 * @param index
 */
export const remove = (index: number) => {
  return R.remove(index, 1);
};

/**
 * If `add` is defined joins `add` and given `arr` and returns new array,
 * otherwise returns new instance of `arr`.
 * @param add
 */
export const spreadOptionalInArray = <T>(
  add: Maybe<ReadonlyArray<T>>,
) => (list: ReadonlyArray<T>) => [...list, ...Maybe.fromMaybe([], add)];

/**
 * Converts a Map to an array of key-value pairs.
 * @param map
 */
export const convertMapToArray = <K, V>(map: ReadonlyMap<K, V>) => [
  ...map.entries()
];

/**
 * Converts a Map to an array of values.
 * @param map
 */
export const convertMapToValues = <V>(map: ReadonlyMap<any, V>) => [
  ...map.values()
];

export interface StringKeyObject<V> {
  readonly [id: string]: V;
}

export interface NumberKeyObject<V> {
  readonly [id: number]: V;
}

/**
 * Converts a Map to an object with same key-value pairs as the Map.
 * @param list
 */
export const convertMapToObject = <V>(
  list: ReadonlyMap<string, V>,
): StringKeyObject<V> => {
  return R.reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {}, [...list]);
};

/**
 * Converts an object to a Map with same key-value pairs as the object.
 * @param obj
 */
export const convertObjectToMap = <V>(
  obj: StringKeyObject<V>,
): ReadonlyMap<string, V> => {
  return new Map(Object.entries(obj));
};

/**
 * Merges a Map into another Map. Returns a new Map if the second map has entries.
 * @param oldList The old Map.
 * @param newList The new/updated Map.
 */
export const mergeMaps = <K, V>(
  ...maps: ReadonlyMap<K, V>[]
): ReadonlyMap<K, V> => {
  return new Map(maps.reduce<[K, V][]>((merged, current) => [
    ...merged,
    ...current,
  ], []));
};

/**
 * Sets an item of a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 * @param value The entry itself.
 */
export const setMapItem = <K, V>(list: ReadonlyMap<K, V>, key: K, value: V) => {
  return R.pipe<ReadonlyMap<K, V>, [K, V][], [K, V][], ReadonlyMap<K, V>>(
    convertMapToArray,
    R.append<[K, V]>([key, value]),
    arr => new Map(arr),
  )(list);
};

/**
 * Sets an item of a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 * @param value The entry itself.
 */
export const setM = <K, V>(key: K, value: V): ReadonlyMapUpdater<K, V> => {
  return R.pipe(
    convertMapToArray,
    R.append<[K, V]>([key, value]),
    arr => new Map(arr),
  );
};

/**
 * Removes an item from a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 */
export const deleteMapItem = <K, V>(list: Map<K, V>, key: K) => {
  return R.pipe<Map<K, V>, [K, V][], [K, V][], Map<K, V>>(
    convertMapToArray,
    R.filter<[K, V]>(([k]) => k !== key) as (list: [K, V][]) => [K, V][],
    arr => new Map(arr),
  )(list);
};

/**
 * Removes an item from a Map and returns a new Map.
 * @param key
 */
export const deleteM = <K, V>(key: K): ReadonlyMapUpdater<K, V> => R.pipe(
  convertMapToArray,
  R.filter<[K, V]>(([k]) => k !== key) as ArrayFilter<[K, V]>,
  arr => new Map(arr),
);

/**
 * Gets a value from a Map by given key, returns a Maybe of that value.
 * @param key The key of the entry.
 */
export const getM = <K, V>(key: K) => (list: ReadonlyMap<K, V>) => {
  return Maybe.of(list.get(key));
};

/**
 * Updates an item of the passed Map based on the passed function and key. If
 * `undefined` is returned, removes item.
 * @param adjustFn Updates value of pair. If `undefined` is returned, removes
 * item.
 * @param key
 */
export const adjustM = <K, V>(
  adjustFn: (value: V) => V | undefined,
  key: K,
): ReadonlyMapUpdater<K, V> => {
  return R.pipe(
    convertMapToArray,
    R.reduce<[K, V], ReadonlyArray<[K, V]>>((acc, elem) => {
      return R.equals(elem[0], key) ? R.ifElse(
        R.complement(R.isNil),
        res => R.append([elem[0], res] as [K, V], acc),
        R.always(acc)
      )(adjustFn(elem[1])) : R.append(elem, acc);
    }, []),
    arr => new Map(arr),
  );
};

export const adjustOrM = <K, V>(
  createFn: (key: K) => V,
  adjustFn: (value: V) => V | undefined,
  key: K,
): ReadonlyMapUpdater<K, V> => {
  return R.ifElse(
    list => list.has(key),
    adjustM(adjustFn, key),
    setM(key, createFn(key)),
  );
}

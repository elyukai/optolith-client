import { pipe } from './pipe';

/**
 * Appends an element to an array and returns a new array.
 * @param array
 */
export const addToArray = <T>(array: T[]) => (add: T) => [ ...array, add ];

/**
 * Appends an element to an array and returns a new array. Reversed function
 * order.
 * @param add
 */
export const addToPipedArray = <T>(add: T) => {
  return (array: T[]) => addToArray(array)(add);
};

/**
 * Sets an element in an array by index and returns a new array.
 * @param array
 */
export const updateArrayItem = <T>(array: T[]) => (index: number, element: T) => {
  return array.map((e, i) => i === index ? element : e);
};

/**
 * Sets an element in an array by index and returns a new array. Reversed
 * function order.
 * @param index
 * @param element
 */
export const updatePipedArrayItem = <T>(index: number, element: T) => {
  return (array: T[]) => updateArrayItem(array)(index, element);
};

/**
 * Removes an element at the given index and returns a new array with the
 * remaining elements.
 * @param array
 */
export const removeFromArray = <T>(array: T[]) => (index: number) => {
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ];
};

/**
 * Removes an element at the given index and returns a new array with the
 * remaining elements. Reversed funtion order.
 * @param index
 */
export const removeFromPipedArray = <T>(index: number) => {
  return (array: T[]) => removeFromArray(array)(index);
};

/**
 * Removes all `undefined` values from `arr`.
 * @param arr
 */
export const filterExisting = <T>(arr: (T | undefined)[]) => {
  return arr.filter((e): e is T => e !== undefined);
};

/**
 * If `add` is defined joins `add` and given `arr` and returns new array,
 * otherwise returns new instance of `arr`.
 * @param add
 */
export const spreadOptionalInArray = <T>(add: T[] = []) => (arr: T[]) => [
  ...arr,
  ...add
];

/**
 * Converts a Map to an array of key-value pairs.
 * @param map
 */
export const convertMapToArray = <K, V>(map: Map<K, V>) => [...map.entries()];

/**
 * Converts a Map to an array of values.
 * @param map
 */
export const convertMapToValueArray = <V>(map: Map<any, V>) => [...map.values()];

interface StringKeyObject<V> {
  [id: string]: V;
}

/**
 * Converts a Map to an object with same key-value pairs as the Map.
 * @param map
 */
export const convertMapToObject = <V>(map: Map<string, V>) => {
  return convertMapToArray(map).reduce<StringKeyObject<V>>((obj, [k, v]) => ({
    ...obj,
    [k]: v,
  }), {});
};

/**
 * Converts an object to a Map with same key-value pairs as the object.
 * @param obj
 */
export const convertObjectToMap = <V>(obj: StringKeyObject<V>) => {
  return new Map<string, V>(Object.entries(obj));
};

/**
 * Merges a Map into another Map. Returns a new Map if the second map has entries.
 * @param oldList The old Map.
 * @param newList The new/updated Map.
 */
export const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
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
export const setMapItem = <K, V>(list: Map<K, V>, key: K, value: V) => {
  return pipe<Map<K, V>, [K, V][], [K, V][], Map<K, V>>(
    convertMapToArray,
    addToPipedArray<[K, V]>([key, value]),
    arr => new Map(arr),
  )(list);
};

/**
 * Removes an item from a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 */
export const deleteMapItem = <K, V>(list: Map<K, V>, key: K) => {
  return pipe<Map<K, V>, [K, V][], [K, V][], Map<K, V>>(
    convertMapToArray,
    arr => arr.filter(([k]) => k !== key),
    arr => new Map(arr),
  )(list);
};

/**
 * Removes an item from a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 */
export const getM = <K, V>(key: K) => (list: Map<K, V>) => {
  return list.get(key);
};

// export type HeroStateReducer<I extends Dependent> =
//   (state: HeroDependent, instance: I) =>
//     HeroDependent;

// export type HeroStateNoInstanceReducer =
//   (state: HeroDependent) =>
//     HeroDependent;

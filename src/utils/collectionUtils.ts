import { pipe } from './pipe';

/**
 * Appends an element to an array and returns a new array.
 * @param array
 * @param add
 */
export const addToArray = <T>(array: T[]) => (add: T) => [ ...array, add ];
export const addToPipedArray = <T>(add: T) => {
  return (array: T[]) => addToArray(array)(add);
};

/**
 * Sets an element in an array by index and returns a new array.
 * @param array
 * @param index
 * @param add
 */
export const updateArrayItem = <T>(array: T[]) => (index: number, add: T) => {
  return array.map((e, i) => i === index ? add : e);
};
export const updatePipedArrayItem = <T>(index: number, add: T) => {
  return (array: T[]) => updateArrayItem(array)(index, add);
};

/**
 * Removes an element at the given index and returns a new array with the
 * remaining elements.
 * @param array
 * @param index
 */
export const removeFromArray = <T>(array: T[]) => (index: number) => {
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ];
}
export const removeFromPipedArray = <T>(index: number) => {
  return (array: T[]) => removeFromArray(array)(index);
};

export const convertMapToArray = <K, V>(map: Map<K, V>) => [...map.entries()];
export const convertMapToValueArray = <V>(map: Map<any, V>) => [...map.values()];

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
}

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

interface StringObject<V> {
  [id: string]: V;
}

export const convertMapToObject = <V>(map: Map<string, V>) => {
  return convertMapToArray(map).reduce<StringObject<V>>((obj, [k, v]) => ({
    ...obj,
    [k]: v,
  }), {});
}

export const convertObjectToMap = <V>(obj: StringObject<V>) => {
  return new Map<string, V>(Object.entries(obj));
};

// export type HeroStateReducer<I extends Dependent> =
//   (state: HeroDependent, instance: I) =>
//     HeroDependent;

// export type HeroStateNoInstanceReducer =
//   (state: HeroDependent) =>
//     HeroDependent;

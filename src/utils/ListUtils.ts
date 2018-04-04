import { DependentInstancesState, DependentInstancesStateKeysForMaps } from '../reducers/dependentInstances';
import { ToOptionalKeys } from '../types/data.d';
import { AbilityInstanceExtended, Instance } from '../types/data.d';
import { getStateKeyById } from './IDUtils';

/**
 * Merges a Map into another Map. Returns a new Map if the second map has entries.
 * @param oldList The old Map.
 * @param newList The new/updated Map.
 */
export function mergeIntoList<TKey, TValue>(oldList: Map<TKey, TValue>, newList: Map<TKey, TValue>) {
  if (newList.size === 0) {
    return oldList;
  }
  return new Map([...oldList, ...newList]);
}

/**
 * Sets an item of a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 * @param value The entry itself.
 */
export function setListItem<TKey, TValue>(list: Map<TKey, TValue>, key: TKey, value: TValue) {
  return new Map(list).set(key, value);
}

/**
 * Removes an item from a Map and returns a new Map.
 * @param list The current Map.
 * @param key The key of the entry.
 */
export function removeListItem<TKey, TValue>(list: Map<TKey, TValue>, key: TKey) {
  const newlist = new Map(list);
  newlist.delete(key);
  return newlist;
}

export function setNewStateItem<T extends AbilityInstanceExtended>(newstate: ToOptionalKeys<DependentInstancesState>, id: string, item: T) {
  const key = getStateKeyById(id);
  if (key) {
    let slice = newstate[key] as Map<string, T> | undefined;
    if (slice) {
      slice = setListItem(slice, id, item);
    }
    else {
      slice = new Map().set(id, item);
    }
    return {
      ...newstate,
      [key]: slice
    };
  }
  return newstate;
}

export function setStateItem<T extends Instance>(newstate: DependentInstancesState, id: string, item: T) {
  const key = getStateKeyById(id);
  if (key) {
    return {
      ...newstate,
      [key]: setListItem(newstate[key] as Map<string, T>, id, item)
    };
  }
  return newstate;
}

export function mergeIntoState(
  oldState: DependentInstancesState,
  ...newStates: ToOptionalKeys<DependentInstancesState>[]
): DependentInstancesState {
  const total = { ...oldState };

  for (const newState of newStates) {
    const keys = Object.keys(newState) as (keyof DependentInstancesState)[];

    for (const key of keys) {
      if (key === 'blessedStyleDependencies' ||
        key === 'combatStyleDependencies' ||
        key === 'magicalStyleDependencies') {
        const arr = newState[key];
        if (typeof arr === 'object') {
          total[key] = arr;
        }
      }
      else {
        total[key] = mergeIntoStateSlice(total[key], newState[key]);
      }
    }
  }

  return total;
}

export type InstancesStateReducer<I extends Instance> =
  (state: DependentInstancesState, instance: I) =>
    ToOptionalKeys<DependentInstancesState>;

export type InstancesStateReducerNoInstance =
  (state: DependentInstancesState) =>
    ToOptionalKeys<DependentInstancesState>;

export type BothInstancesStateReducer<I extends Instance> =
  (state: DependentInstancesState, instance?: I) =>
    ToOptionalKeys<DependentInstancesState>;

export function mergeReducedOptionalState(
  oldState: DependentInstancesState,
  ...reducers: InstancesStateReducerNoInstance[]
): DependentInstancesState;
export function mergeReducedOptionalState<I extends Instance>(
  oldState: DependentInstancesState,
  instance: I,
  ...reducers: InstancesStateReducer<I>[]
): DependentInstancesState;
export function mergeReducedOptionalState<I extends Instance>(
  oldState: DependentInstancesState,
  instance?: I,
  ...reducers: BothInstancesStateReducer<I>[]
): DependentInstancesState {
  return reducers.reduce(
    (oldState, reducer) => {
      const oldStateCopy = {
        ...oldState
      };

      const newState = reducer(oldStateCopy, instance);

      const keys = Object.keys(newState) as (keyof DependentInstancesState)[];

      for (const key of keys) {
        if (key === 'blessedStyleDependencies' ||
          key === 'combatStyleDependencies' ||
          key === 'magicalStyleDependencies') {
          const arr = newState[key];
          if (typeof arr === 'object') {
            oldStateCopy[key] = arr;
          }
        }
        else {
          oldStateCopy[key] = mergeIntoStateSlice(oldStateCopy[key], newState[key]);
        }
      }

      return oldStateCopy;
    },
    { ...oldState }
  );
}

export function mergeIntoOptionalState(oldstate: ToOptionalKeys<DependentInstancesState>, newstate: ToOptionalKeys<DependentInstancesState>): ToOptionalKeys<DependentInstancesState> {
  const keys = Object.keys(newstate) as (keyof DependentInstancesState)[];

  const total = { ...oldstate };
  for (const key of keys) {
    if (key !== 'blessedStyleDependencies' && key !== 'combatStyleDependencies' && key !== 'magicalStyleDependencies') {
      total[key] = mergeIntoOptionalStateSlice(total[key], newstate[key]);
    }
  }

  return total;
}

function mergeIntoStateSlice<T extends DependentInstancesStateKeysForMaps>(oldslice: DependentInstancesState[T], newslice?: DependentInstancesState[T]) {
  if (newslice) {
    return mergeIntoList(oldslice, newslice) as DependentInstancesState[T];
  }
  return oldslice;
}

function mergeIntoOptionalStateSlice<T extends DependentInstancesStateKeysForMaps>(oldslice?: DependentInstancesState[T], newslice?: DependentInstancesState[T]) {
  if (newslice && oldslice) {
    return mergeIntoList(oldslice, newslice) as DependentInstancesState[T];
  }
  else if (newslice) {
    return newslice;
  }
  return oldslice;
}

interface StringObject<V> {
  [id: string]: V;
}

export function convertMapToObject<V>(map: Map<string, V>): StringObject<V> {
  const obj: StringObject<V> = {};

  for (const [id, entry] of map) {
    obj[id] = entry;
  }

  return obj;
}

export function convertObjectToMap<V>(obj: StringObject<V>): Map<string, V> {
  const map: Map<string, V> = new Map<string, V>();

  for (const [id, entry] of Object.entries(obj)) {
    map.set(id, entry);
  }

  return map;
}

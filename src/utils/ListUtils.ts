import { uniq } from 'lodash';
import { DependentInstancesState } from '../reducers/dependentInstances';
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

export function mergeIntoState(oldstate: DependentInstancesState, newstate: ToOptionalKeys<DependentInstancesState>): DependentInstancesState {
	const keys = Object.keys(newstate) as (keyof DependentInstancesState)[];

	type D = DependentInstancesState;

	const total = { ...oldstate };
	for (const key of keys) {
		total[key] = mergeIntoStateSlice<keyof D>(total[key], newstate[key]);
	}

	return total;
}

export function mergeIntoOptionalState(oldstate: ToOptionalKeys<DependentInstancesState>, newstate: ToOptionalKeys<DependentInstancesState>): ToOptionalKeys<DependentInstancesState> {
	const keys = Object.keys(newstate) as (keyof DependentInstancesState)[];

	type D = DependentInstancesState;

	const total = { ...oldstate };
	for (const key of keys) {
		total[key] = mergeIntoOptionalStateSlice<keyof D>(total[key], newstate[key]);
	}

	return total;
}

function mergeIntoStateSlice<T extends keyof DependentInstancesState>(oldslice: DependentInstancesState[T], newslice?: DependentInstancesState[T]) {
	if (newslice) {
		return mergeIntoList(oldslice, newslice) as DependentInstancesState[T];
	}
	return oldslice;
}

function mergeIntoOptionalStateSlice<T extends keyof DependentInstancesState>(oldslice?: DependentInstancesState[T], newslice?: DependentInstancesState[T]) {
	if (newslice && oldslice) {
		return mergeIntoList(oldslice, newslice) as DependentInstancesState[T];
	}
	else if (newslice) {
		return newslice;
	}
	return oldslice;
}

/**
 * Merges a Map into another Map. Returns a new Map.
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

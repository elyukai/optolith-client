/**
 * Updates a map with new items. Returns a new Map.
 * @param oldList The old Map.
 * @param newList The new/updated items.
 */
export function mergeIntoList<TKey, TValue>(oldList: Map<TKey, TValue>, newList: Map<TKey, TValue>) {
	return new Map([...oldList, ...newList]);
}

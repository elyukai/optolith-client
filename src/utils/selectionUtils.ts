import * as Wiki from '../types/wiki.d';

/**
 * Get a selection option with the given id from given wiki entry. Returns
 * `undefined` if not found.
 * @param obj The entry.
 */
export function findSelectOption<S extends Wiki.SelectionObject>(
  obj: Wiki.Activatable,
  id?: string | number,
): S | undefined {
  if (obj.select) {
    return obj.select.find<S>((e): e is S => e.id === id);
  }
  return undefined;
}

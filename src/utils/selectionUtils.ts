import R from 'ramda';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { filterExisting, setMapItem } from './collectionUtils';
import { Maybe } from './maybe';

/**
 * Get a selection option with the given id from given wiki entry. Returns
 * `undefined` if not found.
 * @param obj The entry.
 */
export const findSelectOption = <S extends Wiki.SelectionObject>(
  obj: Wiki.Activatable,
  id?: string | number,
): Maybe<S | undefined> => Maybe.from(obj.select)
  .map(select => select.find<S>((e): e is S => {
    return e.id === id;
  }));

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export const getSelectOptionName = (
  obj: Wiki.Activatable,
  id?: string | number,
): Maybe<string | undefined> => {
  return findSelectOption(obj, id)
    .map(e => e.name);
};

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export const getSelectOptionCost = (
  obj: Wiki.Activatable,
  id?: string | number,
): Maybe<number | undefined> => {
  return findSelectOption(obj, id)
    .map(e => e.cost);
};

interface SelectionNameAndCost {
  name: string;
  cost: number;
}

/**
 * Get a selection option's `name` and `cost` with the given id from given
 * entry. Returns `undefined` if not found.
 * @param obj The entry.
 */
export const getSelectionNameAndCost = (
  obj: Wiki.Activatable,
  id?: string | number,
): Maybe<SelectionNameAndCost | undefined> => {
  return findSelectOption(obj, id)
    .map(e => {
      return typeof e.cost === 'number' ? {
        name: e.name,
        cost: e.cost,
      } : undefined;
    });
};

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getActiveSelections = R.pipe(
  (obj: Data.ActivatableDependent | undefined) => Maybe.from(obj),
  obj => obj
    .map(R.pipe(
      obj => obj.active,
      R.map<Data.ActiveObject, Data.ActiveObject["sid"]>(e => e.sid),
      filterExisting,
    ))
    .valueOr<(string | number)[]>([]),
);

type SecondarySelections = ReadonlyMap<number | string, (string | number)[]>;

/**
 * Get all `ActiveObject.sid2` values from the given instance, sorted by
 * `ActiveObject.sid` in Map.
 * @param entry
 */
export const getActiveSecondarySelections = R.pipe(
  (entry: Data.ActivatableDependent | undefined) => Maybe.from(entry),
  obj => obj
    .map(R.pipe(
      obj => obj.active,
      (obj: Data.ActiveObject[]) => obj.reduce<SecondarySelections>(
        (map, obj) => {
          const { sid, sid2 } = obj;
          if (sid !== undefined && sid2 !== undefined) {
            return setMapItem(map, sid, [...(map.get(sid) || []), sid2]);
          }
          return map;
        },
        new Map()
      ),
    ))
    .valueOr<SecondarySelections>(new Map()),
);

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getRequiredSelections = R.pipe(
  (obj: Data.ActivatableDependent | undefined) => obj ? obj.dependencies : [],
  list => list.filter((e): e is Data.DependencyObject => isObject(e)),
  (list: Data.DependencyObject[]) => R.map(e => e.sid, list),
  filterExisting
);

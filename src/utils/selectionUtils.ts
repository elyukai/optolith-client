import R from 'ramda';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { setMapItem } from './collectionUtils';
import { Maybe } from './maybe';

/**
 * Get a selection option with the given id from given wiki entry. Returns
 * `undefined` if not found.
 * @param obj The entry.
 */
export const findSelectOption = <S extends Wiki.SelectionObject>(
  obj: Wiki.Activatable,
  id?: string | number,
): Maybe<S> => Maybe.of(obj.select)
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
): Maybe<string> => {
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
): Maybe<number> => {
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
): Maybe<SelectionNameAndCost> => {
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
export const getActiveSelections =
  (obj: Maybe<Data.ActivatableDependent>) =>
    obj.map(R.pipe(
      obj => obj.active,
      Maybe.mapMaybe<Data.ActiveObject, string | number>(e => Maybe.of(e.sid)),
    ))
    .valueOr<ReadonlyArray<string | number>>([]);

type SecondarySelections = ReadonlyMap<number | string, (string | number)[]>;

/**
 * Get all `ActiveObject.sid2` values from the given instance, sorted by
 * `ActiveObject.sid` in Map.
 * @param entry
 */
export const getActiveSecondarySelections =
  (obj: Maybe<Data.ActivatableDependent>) =>
    obj.map(R.pipe(
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
    .valueOr<SecondarySelections>(new Map());

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getRequiredSelections =
  (obj: Maybe<Data.ActivatableDependent>) => obj
    .map(obj => obj.dependencies)
    .map(list => list.filter((e): e is Data.DependencyObject => isObject(e)))
    .map(Maybe.mapMaybe(e => Maybe.of(e.sid)))
    .valueOr<ReadonlyArray<number | string | number[]>>([]);

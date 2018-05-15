import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { filterExisting, setMapItem } from './collectionUtils';
import { Maybe, MaybeFunctor } from './maybe';
import { pipe } from './pipe';

/**
 * Get a selection option with the given id from given wiki entry. Returns
 * `undefined` if not found.
 * @param obj The entry.
 */
export const findSelectOption = <S extends Wiki.SelectionObject>(
  obj: Wiki.Activatable,
  id?: string | number,
): MaybeFunctor<S | undefined> => Maybe(obj.select)
  .fmap(select => select.find<S>((e): e is S => {
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
): MaybeFunctor<string | undefined> => {
  return findSelectOption(obj, id)
    .fmap(e => e.name);
};

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export const getSelectOptionCost = (
  obj: Wiki.Activatable,
  id?: string | number,
): MaybeFunctor<number | undefined> => {
  return findSelectOption(obj, id)
    .fmap(e => e.cost);
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
): MaybeFunctor<SelectionNameAndCost | undefined> => {
  return findSelectOption(obj, id)
    .fmap(e => {
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
export const getActiveSelections = (obj: Data.ActivatableDependent | undefined) => {
  return obj ? filterExisting(obj.active.map(e => e.sid)) : [];
}

type SecondarySelections = ReadonlyMap<number | string, (string | number)[]>;

/**
 * Get all `ActiveObject.sid2` values from the given instance, sorted by
 * `ActiveObject.sid` in Map.
 * @param entry
 */
export function getActiveSecondarySelections(
  entry: Data.ActivatableDependent | undefined,
): SecondarySelections {
  return (entry ? entry.active : []).reduce<SecondarySelections>((map, obj) => {
    const { sid, sid2 } = obj;
    if (sid !== undefined && sid2 !== undefined) {
      return setMapItem(map, sid, [...(map.get(sid) || []), sid2]);
    }
    return map;
  }, new Map());
}

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getRequiredSelections = (obj: Data.ActivatableDependent | undefined) => pipe(
  (list: Data.ActivatableInstanceDependency[]) => {
    return list.filter((e): e is Data.DependencyObject => {
      return typeof e === 'object';
    });
  },
  list => list.map(e => e.sid),
  filterExisting
)(obj ? obj.dependencies : []);

import R from 'ramda';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { List, Maybe, OrderedMap, Record } from './dataUtils';

/**
 * Get a selection option with the given id from given wiki entry. Returns
 * `undefined` if not found.
 * @param obj The entry.
 */
export const findSelectOption = <S extends Wiki.SelectionObject>(
  obj: Wiki.Activatable,
  id: Maybe<string | number>,
): Maybe<Record<S>> =>
  obj.lookup ('select').bind (select => select.find<any> (
    (e): e is any => id.equals (e.lookup ('id'))
  ));

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export const getSelectOptionName = (
  obj: Wiki.Activatable,
  id: Maybe<string | number>,
): Maybe<string> =>
  findSelectOption (obj, id).bind (e => e.lookup ('name'));

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `undefined` if not found.
 * @param obj The entry.
 */
export const getSelectOptionCost = (
  obj: Wiki.Activatable,
  id: Maybe<string | number>,
): Maybe<number> =>
  findSelectOption (obj, id).bind (e => e.lookup ('cost'));

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
  id: Maybe<string | number>,
): Maybe<SelectionNameAndCost> =>
  findSelectOption (obj, id)
    .bind (e => e.lookup ('cost').fmap (cost => ({
      name: e.get ('name'),
      cost,
    })));

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getActiveSelections =
  (obj: Maybe<Record<Data.ActivatableDependent>>) =>
    obj.bind (justObj => justObj.lookup ('active'))
      .fmap (Maybe.mapMaybe (e => e.lookup ('sid')));

type SecondarySelections = OrderedMap<number | string, List<string | number>>;

/**
 * Get all `ActiveObject.sid2` values from the given instance, sorted by
 * `ActiveObject.sid` in Map.
 * @param entry
 */
export const getActiveSecondarySelections =
  (obj: Maybe<Record<Data.ActivatableDependent>>) =>
    obj.bind (justObj => justObj
      .lookup ('active')
      .fmap (
        r => r.foldl<SecondarySelections> (
          map => selection => {
            const sid = selection.lookup ('sid');
            const sid2 = selection.lookup ('sid2');

            if (Maybe.isJust (sid) && Maybe.isJust (sid2)) {
              return map.alter (
                e => e
                  .alt (Maybe.pure (List.of ()))
                  .fmap (
                    listForSid => listForSid.append (Maybe.fromJust (sid2))
                  )
              ) (Maybe.fromJust (sid));
            }

            return map;
          }
        ) (OrderedMap.empty ())
      )
    );

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export const getRequiredSelections =
  (obj: Maybe<Record<Data.ActivatableDependent>>) => obj
    .fmap (
      justObj => Maybe.mapMaybe (
        R.pipe (
          Maybe.ensure ((e): e is Record<Data.DependencyObject> => e instanceof Record),
          Maybe.bind_ (e => e.lookup ('sid'))
        )
      ) (justObj.get ('dependencies'))
    );

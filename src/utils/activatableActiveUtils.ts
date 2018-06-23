import * as Data from '../types/data.d';
import { WikiAll } from '../types/wiki.d';
import { getCost } from './activatableCostUtils';
import { getName } from './activatableNameUtils';
import { Maybe, Record } from './dataUtils';

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param state The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export const getNameCost = (
  obj: Record<Data.ActiveObjectWithId>,
  wiki: Record<WikiAll>,
  state: Record<Data.HeroDependent>,
  costToAdd: boolean,
  locale: Maybe<Record<Data.UIMessages>>
): Maybe<Record<Data.ActivatableNameCost>> =>
  getCost(obj, wiki, state, costToAdd)
    .bind(
      currentCost => getName(obj, wiki, locale)
        .map(
          names => names
            .merge(obj)
            .merge(Record.of({
              currentCost
            }))
        )
    );

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param locale The locale-dependent messages.
 */
export const getNameCostForWiki = (
  obj: Record<Data.ActiveObjectWithId>,
  wiki: Record<WikiAll>,
  locale: Maybe<Record<Data.UIMessages>>
): Maybe<Record<Data.ActivatableNameCost>> =>
  getCost(obj, wiki)
    .bind(
      currentCost => getName(obj, wiki, locale)
        .map(
          names => names
            .merge(obj)
            .merge(Record.of({
              currentCost
            }))
        )
    );

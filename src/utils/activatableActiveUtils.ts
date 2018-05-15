import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import { getCost } from './activatableCostUtils';
import { getName } from './activatableNameUtils';
import { MaybeFunctor } from './maybe';

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
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  state: Data.HeroDependent,
  costToAdd: boolean,
  locale?: Data.UIMessages,
): MaybeFunctor<Data.ActivatableNameCost | undefined> => {
  return getCost(obj, wiki, state, costToAdd)
    .fmap(currentCost => {
      return getName(obj, wiki, locale)
        .fmap(names => {
          return {
            ...obj,
            ...names,
            currentCost
          };
        })
        .value;
    })
};

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param locale The locale-dependent messages.
 */
export const getNameCostForWiki = (
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  locale?: Data.UIMessages,
): MaybeFunctor<Data.ActivatableNameCost | undefined> => {
  return getCost(obj, wiki)
    .fmap(currentCost => {
      return getName(obj, wiki, locale)
        .fmap(names => {
          return {
            ...obj,
            ...names,
            currentCost
          };
        })
        .value;
    });
};

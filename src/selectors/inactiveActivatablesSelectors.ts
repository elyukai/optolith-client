import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data.d';
import * as stateSelectors from './stateSelectors';
import { createSelector } from 'reselect';
import { getValidPact } from './pactSelectors';
import { getAllAvailableExtendedSpecialAbilities } from '../utils/ExtendedStyleUtils';
import { getMapByCategory } from './dependentInstancesSelectors';
import { getDeactiveView } from '../utils/ActivatableUtils';
import { getRuleBooksEnabled } from './rulesSelectors';
import { filterByInstancePropertyAvailability } from '../utils/RulesUtils';
import { getAdventurePointsObject } from './adventurePointsSelectors';

export const getExtendedSpecialAbilitiesToAdd = createSelector(
  stateSelectors.getBlessedStyleDependencies,
  stateSelectors.getCombatStyleDependencies,
  stateSelectors.getMagicalStyleDependencies,
  (...styleDependencles: Data.StyleDependency[][]) => {
    return getAllAvailableExtendedSpecialAbilities(...styleDependencles);
  }
);

export const getDeactiveForView = <T extends ActivatableCategory>(category: T) => {
  return createSelector(
    stateSelectors.getCurrentHeroPresent,
    stateSelectors.getLocaleMessages,
    getExtendedSpecialAbilitiesToAdd,
    getAdventurePointsObject,
    getValidPact,
    (state, locale, validExtendedSpecialAbilities, adventurePoints, pact) => {
      const { dependent } = state;
      const allEntries = getMapByCategory(dependent, category) as Map<string, Data.InstanceByCategory[T]>;
      const finalEntries: Data.DeactiveViewObject<Data.InstanceByCategory[T]>[] = [];
      if (locale) {
        for (const entry of allEntries) {
          const obj = getDeactiveView(
            entry[1],
            state,
            validExtendedSpecialAbilities,
            locale,
            adventurePoints,
            pact,
          );
          if (obj) {
            finalEntries.push(obj);
          }
        }
      }
      return finalEntries;
    }
  );
};

export const getDeactiveAdvantages = createSelector(
  getDeactiveForView(Categories.ADVANTAGES),
  getRuleBooksEnabled,
  (list, availablility) => {
    return filterByInstancePropertyAvailability(list, availablility);
  }
);

export const getDeactiveDisadvantages = createSelector(
  getDeactiveForView(Categories.DISADVANTAGES),
  getRuleBooksEnabled,
  (list, availablility) => {
    return filterByInstancePropertyAvailability(list, availablility);
  }
);

export const getDeactiveSpecialAbilities = createSelector(
  getDeactiveForView(Categories.SPECIAL_ABILITIES),
  getRuleBooksEnabled,
  (list, availablility) => {
    return filterByInstancePropertyAvailability(list, availablility);
  }
);

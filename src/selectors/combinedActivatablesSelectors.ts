import { createSelector } from 'reselect';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import * as activatableSelectors from './activatableSelectors';
import * as inactiveActivatablesSelectors from './inactiveActivatablesSelectors';
import { getSpecialAbilitiesSortOptions } from './sortOptionsSelectors';
import * as stateSelectors from './stateSelectors';
import { getEnableActiveItemHints } from './uisettingsSelectors';


export const getFilteredInactiveAdvantages = createSelector(
  inactiveActivatablesSelectors.getDeactiveAdvantages,
  activatableSelectors.getAdvantagesForEdit,
  stateSelectors.getInactiveAdvantagesFilterText,
  stateSelectors.getLocaleMessages,
  getEnableActiveItemHints,
  (inactive, active, filterText, locale, areActiveItemHintsEnabled) => {
    if (areActiveItemHintsEnabled) {
      return filterAndSortObjects([...inactive, ...active], locale!.id, filterText);
    }

    return filterAndSortObjects(inactive, locale!.id, filterText);
  }
);

export const getFilteredInactiveDisadvantages = createSelector(
  inactiveActivatablesSelectors.getDeactiveDisadvantages,
  activatableSelectors.getDisadvantagesForEdit,
  stateSelectors.getInactiveDisadvantagesFilterText,
  stateSelectors.getLocaleMessages,
  getEnableActiveItemHints,
  (inactive, active, filterText, locale, areActiveItemHintsEnabled) => {
    if (areActiveItemHintsEnabled) {
      return filterAndSortObjects([...inactive, ...active], locale!.id, filterText);
    }

    return filterAndSortObjects(inactive, locale!.id, filterText);
  }
);

export const getFilteredInactiveSpecialAbilities = createSelector(
  inactiveActivatablesSelectors.getDeactiveSpecialAbilities,
  activatableSelectors.getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  stateSelectors.getInactiveSpecialAbilitiesFilterText,
  stateSelectors.getLocaleMessages,
  getEnableActiveItemHints,
  (inactive, active, sortOptions, filterText, locale, areActiveItemHintsEnabled) => {
    if (areActiveItemHintsEnabled) {
      return filterAndSortObjects([...inactive, ...active], locale!.id, filterText, sortOptions);
    }

    return filterAndSortObjects(inactive, locale!.id, filterText, sortOptions);
  }
);

import { ActionTypes } from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getDependentInstances, getLocaleMessages, getSpecialAbilities, getWiki } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { ActivateArgs, DeactivateArgs } from '../types/data';
import { SpecialAbility } from '../types/wiki';
import { convertPerTierCostToFinalCost, getNameCost } from '../utils/ActivatableUtils';
import { validate } from '../utils/APUtils';
import { Record } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { addAlert } from './AlertActions';

interface SpecialAbilityActivateArgs extends ActivateArgs {
  wikiEntry: Record<SpecialAbility>;
}

export interface ActivateSpecialAbilityAction {
  type: ActionTypes.ACTIVATE_SPECIALABILITY;
  payload: SpecialAbilityActivateArgs;
}

export function _addToList(args: ActivateArgs): AsyncAction {
  return (dispatch, getState) => {
    const state = getState();
    const validCost = validate(args.cost, getAvailableAdventurePoints(state), isInCharacterCreation(state));
    const messages = getLocaleMessages(state);
    if (!validCost && messages) {
      dispatch(addAlert({
        title: translate(messages, 'notenoughap.title'),
        message: translate(messages, 'notenoughap.content'),
      }));
    }
    else {
      dispatch({
        type: ActionTypes.ACTIVATE_SPECIALABILITY,
        payload: args
      } as ActivateSpecialAbilityAction);
    }
  };
}

interface SpecialAbilityDeactivateArgs extends DeactivateArgs {
  wikiEntry: Record<SpecialAbility>;
}

export interface DeactivateSpecialAbilityAction {
  type: ActionTypes.DEACTIVATE_SPECIALABILITY;
  payload: SpecialAbilityDeactivateArgs;
}

export function _removeFromList(args: DeactivateArgs): DeactivateSpecialAbilityAction {
  return {
    type: ActionTypes.DEACTIVATE_SPECIALABILITY,
    payload: {
      ...args,
      cost: args.cost * -1 // the entry should be removed
    }
  };
}

export interface SetSpecialAbilityTierAction {
  type: ActionTypes.SET_SPECIALABILITY_TIER;
  payload: {
    id: string;
    index: number;
    tier: number;
    cost: number;
    wikiEntry: Record<SpecialAbility>;
  };
}

export function _setTier(id: string, index: number, tier: number): AsyncAction {
  return (dispatch, getState) => {
    const state = getState();
    const dependent = getDependentInstances(state);
    const activeObjectWithId = { id, index, ...getSpecialAbilities(state).get(id)!.active[index] };
    const previousCost = convertPerTierCostToFinalCost(getNameCost(activeObjectWithId, getWiki(state), dependent, false)).currentCost;
    const nextCost = convertPerTierCostToFinalCost(getNameCost({ ...activeObjectWithId, tier }, getWiki(state), dependent, true)).currentCost;
    const cost = nextCost - previousCost;
    const validCost = validate(cost, getAvailableAdventurePoints(state), isInCharacterCreation(state));
    const messages = getLocaleMessages(state);
    if (!validCost && messages) {
      dispatch(addAlert({
        title: translate(messages, 'notenoughap.title'),
        message: translate(messages, 'notenoughap.content'),
      }));
    }
    else {
      dispatch({
        type: ActionTypes.SET_SPECIALABILITY_TIER,
        payload: {
          id,
          tier,
          cost,
          index
        }
      } as SetSpecialAbilityTierAction);
    }
  };
}

export interface SetSpecialAbilitiesSortOrderAction {
  type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export function _setSortOrder(sortOrder: string): SetSpecialAbilitiesSortOrderAction {
  return {
    type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  };
}

export interface SetActiveSpecialAbilitiesFilterTextAction {
  type: ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export function setActiveFilterText(filterText: string): SetActiveSpecialAbilitiesFilterTextAction {
  return {
    type: ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT,
    payload: {
      filterText
    }
  };
}

export interface SetInactiveSpecialAbilitiesFilterTextAction {
  type: ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export function setInactiveFilterText(filterText: string): SetInactiveSpecialAbilitiesFilterTextAction {
  return {
    type: ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT,
    payload: {
      filterText
    }
  };
}

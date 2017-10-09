import * as ActionTypes from '../constants/ActionTypes';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { getTheme } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { ActivateArgs, DeactivateArgs, UndoExtendedActivateArgs, UndoExtendedDeactivateArgs } from '../types/data.d';
import { alert } from '../utils/alertNew';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';

export interface ActivateSpecialAbilityAction {
	type: ActionTypes.ACTIVATE_SPECIALABILITY;
	payload: UndoExtendedActivateArgs;
}

export function _addToList(args: ActivateArgs): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const validCost = validate(args.cost, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			alert(_translate(messages, 'notenoughap.content'), getTheme(state), _translate(messages, 'notenoughap.title'));
			return;
		}
		dispatch({
			type: ActionTypes.ACTIVATE_SPECIALABILITY,
			payload: args
		} as ActivateSpecialAbilityAction);
	};
}

export interface DeactivateSpecialAbilityAction {
	type: ActionTypes.DEACTIVATE_SPECIALABILITY;
	payload: UndoExtendedDeactivateArgs;
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
	};
}

export function _setTier(id: string, index: number, tier: number, cost: number): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const validCost = validate(cost, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			alert(_translate(messages, 'notenoughap.content'), getTheme(state), _translate(messages, 'notenoughap.title'));
			return;
		}
		dispatch({
			type: ActionTypes.SET_SPECIALABILITY_TIER,
			payload: {
				id,
				tier,
				cost,
				index
			}
		} as SetSpecialAbilityTierAction);
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

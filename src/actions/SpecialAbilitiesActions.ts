import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { ActivateArgs, DeactivateArgs, UndoExtendedActivateArgs, UndoExtendedDeactivateArgs } from '../types/data.d';
import { alert } from '../utils/alert';
import { validate } from '../utils/APUtils';
import { translate } from '../utils/I18n';

export interface ActivateSpecialAbilityAction {
	type: ActionTypes.ACTIVATE_SPECIALABILITY;
	payload: UndoExtendedActivateArgs;
}

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateSpecialAbilityAction>({
	type: ActionTypes.ACTIVATE_SPECIALABILITY,
	payload: args,
});

export function _addToList(args: ActivateArgs): ActivateSpecialAbilityAction | undefined {
	const validCost = validate(args.cost, store.getState().currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ACTIVATE_SPECIALABILITY,
		payload: args
	};
}

export interface DeactivateSpecialAbilityAction {
	type: ActionTypes.DEACTIVATE_SPECIALABILITY;
	payload: UndoExtendedDeactivateArgs;
}

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateSpecialAbilityAction>({
	type: ActionTypes.DEACTIVATE_SPECIALABILITY,
	payload: args,
});

export function _removeFromList(args: DeactivateArgs): DeactivateSpecialAbilityAction {
	return {
		type: ActionTypes.DEACTIVATE_SPECIALABILITY,
		payload: args
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

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetSpecialAbilityTierAction>({
	type: ActionTypes.SET_SPECIALABILITY_TIER,
	payload: {
		id,
		tier,
		cost,
		index,
	},
});

export function _setTier(id: string, index: number, tier: number, cost: number): SetSpecialAbilityTierAction | undefined {
	const validCost = validate(cost, store.getState().currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.SET_SPECIALABILITY_TIER,
		payload: {
			id,
			tier,
			cost,
			index
		}
	};
}

export interface SetSpecialAbilitiesSortOrderAction {
	type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetSpecialAbilitiesSortOrderAction>({
	type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER,
	payload: {
		sortOrder,
	},
});

export function _setSortOrder(sortOrder: string): SetSpecialAbilitiesSortOrderAction {
	return {
		type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER,
		payload: {
			sortOrder,
		},
	};
}

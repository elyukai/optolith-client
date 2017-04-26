import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { ActivateArgs, DeactivateArgs, UndoExtendedActivateArgs, UndoExtendedDeactivateArgs } from '../types/data.d';

export interface ActivateSpecialAbilityAction extends Action {
	type: ActionTypes.ACTIVATE_SPECIALABILITY;
	payload: UndoExtendedActivateArgs;
}

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateSpecialAbilityAction>({
	type: ActionTypes.ACTIVATE_SPECIALABILITY,
	payload: args,
});

export interface DeactivateSpecialAbilityAction extends Action {
	type: ActionTypes.DEACTIVATE_SPECIALABILITY;
	payload: UndoExtendedDeactivateArgs;
}

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateSpecialAbilityAction>({
	type: ActionTypes.DEACTIVATE_SPECIALABILITY,
	payload: args,
});

export interface SetSpecialAbilityTierAction extends Action {
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

export interface SetSpecialAbilitiesSortOrderAction extends Action {
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

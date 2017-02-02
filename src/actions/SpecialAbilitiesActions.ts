import { ACTIVATE_SPECIALABILITY, DEACTIVATE_SPECIALABILITY, SET_SPECIALABILITY_TIER, SET_SPECIALABILITIES_SORT_ORDER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (args: ActivateArgs): void => AppDispatcher.dispatch(<ActivateSpecialAbilityAction>{
	type: ACTIVATE_SPECIALABILITY,
	payload: args
});

export const removeFromList = (args: DeactivateArgs): void => AppDispatcher.dispatch(<DeactivateSpecialAbilityAction>{
	type: DEACTIVATE_SPECIALABILITY,
	payload: args
});

export const setTier = (id: string, tier: number, cost: number, sid: number | string): void => AppDispatcher.dispatch(<SetSpecialAbilityTierAction>{
	type: SET_SPECIALABILITY_TIER,
	payload: {
		id,
		tier,
		cost,
		sid
	}
});

export const setSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetSpecialAbilitiesSortOrderAction>{
	type: SET_SPECIALABILITIES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

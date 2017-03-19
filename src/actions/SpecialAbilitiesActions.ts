import { ACTIVATE_SPECIALABILITY, DEACTIVATE_SPECIALABILITY, SET_SPECIALABILITIES_SORT_ORDER, SET_SPECIALABILITY_TIER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateSpecialAbilityAction>({
	type: ACTIVATE_SPECIALABILITY,
	payload: args,
});

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateSpecialAbilityAction>({
	type: DEACTIVATE_SPECIALABILITY,
	payload: args,
});

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetSpecialAbilityTierAction>({
	type: SET_SPECIALABILITY_TIER,
	payload: {
		id,
		tier,
		cost,
		index,
	},
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetSpecialAbilitiesSortOrderAction>({
	type: SET_SPECIALABILITIES_SORT_ORDER,
	payload: {
		sortOrder,
	},
});

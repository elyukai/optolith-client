import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateSpecialAbilityAction>({
	type: ActionTypes.ACTIVATE_SPECIALABILITY,
	payload: args,
});

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateSpecialAbilityAction>({
	type: ActionTypes.DEACTIVATE_SPECIALABILITY,
	payload: args,
});

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetSpecialAbilityTierAction>({
	type: ActionTypes.SET_SPECIALABILITY_TIER,
	payload: {
		id,
		tier,
		cost,
		index,
	},
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetSpecialAbilitiesSortOrderAction>({
	type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER,
	payload: {
		sortOrder,
	},
});

export const switchEnableActiveItemHints = () => AppDispatcher.dispatch<SwitchEnableActiveItemHintsAction>({
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
});

import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateDisAdvAction>({
	type: ActionTypes.ACTIVATE_DISADV,
	payload: args
});

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateDisAdvAction>({
	type: ActionTypes.DEACTIVATE_DISADV,
	payload: args
});

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetDisAdvTierAction>({
	type: ActionTypes.SET_DISADV_TIER,
	payload: {
		id,
		tier,
		cost,
		index
	}
});

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchDisAdvRatingVisibilityAction>({
	type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY
});

export const switchEnableActiveItemHints = () => AppDispatcher.dispatch<SwitchEnableActiveItemHintsAction>({
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
});

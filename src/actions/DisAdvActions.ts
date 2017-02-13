import { ACTIVATE_DISADV, DEACTIVATE_DISADV, SET_DISADV_TIER, SWITCH_DISADV_RATING_VISIBILITY } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateDisAdvAction>({
	type: ACTIVATE_DISADV,
	payload: args
});

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateDisAdvAction>({
	type: DEACTIVATE_DISADV,
	payload: args
});

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetDisAdvTierAction>({
	type: SET_DISADV_TIER,
	payload: {
		id,
		tier,
		cost,
		index
	}
});

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchDisAdvRatingVisibilityAction>({
	type: SWITCH_DISADV_RATING_VISIBILITY
});

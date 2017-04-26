import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { ActivateArgs, DeactivateArgs, UndoExtendedActivateArgs, UndoExtendedDeactivateArgs } from '../types/data.d';

export interface ActivateDisAdvAction extends Action {
	type: ActionTypes.ACTIVATE_DISADV;
	payload: UndoExtendedActivateArgs;
}

export const addToList = (args: ActivateArgs) => AppDispatcher.dispatch<ActivateDisAdvAction>({
	type: ActionTypes.ACTIVATE_DISADV,
	payload: args
});

export interface DeactivateDisAdvAction extends Action {
	type: ActionTypes.DEACTIVATE_DISADV;
	payload: UndoExtendedDeactivateArgs;
}

export const removeFromList = (args: DeactivateArgs) => AppDispatcher.dispatch<DeactivateDisAdvAction>({
	type: ActionTypes.DEACTIVATE_DISADV,
	payload: args
});

export interface SetDisAdvTierAction extends Action {
	type: ActionTypes.SET_DISADV_TIER;
	payload: {
		id: string;
		index: number;
		tier: number;
		cost: number;
	};
}

export const setTier = (id: string, index: number, tier: number, cost: number) => AppDispatcher.dispatch<SetDisAdvTierAction>({
	type: ActionTypes.SET_DISADV_TIER,
	payload: {
		id,
		tier,
		cost,
		index
	}
});

export interface SwitchDisAdvRatingVisibilityAction extends Action {
	type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY;
}

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchDisAdvRatingVisibilityAction>({
	type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY
});

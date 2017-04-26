import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface AddTalentPointAction extends Action {
	type: ActionTypes.ADD_TALENT_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddTalentPointAction>({
	type: ActionTypes.ADD_TALENT_POINT,
	payload: {
		id
	}
});

export interface RemoveTalentPointAction extends Action {
	type: ActionTypes.REMOVE_TALENT_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveTalentPointAction>({
	type: ActionTypes.REMOVE_TALENT_POINT,
	payload: {
		id
	}
});

export interface SetTalentsSortOrderAction extends Action {
	type: ActionTypes.SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetTalentsSortOrderAction>({
	type: ActionTypes.SET_TALENTS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SwitchTalentRatingVisibilityAction extends Action {
	type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY;
}

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchTalentRatingVisibilityAction>({
	type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY
});

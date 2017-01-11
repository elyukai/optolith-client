import { ADD_TALENT_POINT, REMOVE_TALENT_POINT, SET_TALENTS_SORT_ORDER, SWITCH_TALENT_RATING_VISIBILITY } from '../constants/ActionTypes';

export interface AddTalentPointAction {
	type: ADD_TALENT_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string): AddTalentPointAction => ({
	type: ADD_TALENT_POINT,
	payload: {
		id
	}
});

export interface RemoveTalentPointAction {
	type: REMOVE_TALENT_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string): RemoveTalentPointAction => ({
	type: REMOVE_TALENT_POINT,
	payload: {
		id
	}
});

export interface SetTalentsSortOrderAction {
	type: SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string): SetTalentsSortOrderAction => ({
	type: SET_TALENTS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SetTalentRatingVisibilityAction {
	type: SWITCH_TALENT_RATING_VISIBILITY;
	payload: {
		sortOrder: string;
	};
}

export const setRatingVisibility = (sortOrder: string): SetTalentRatingVisibilityAction => ({
	type: SWITCH_TALENT_RATING_VISIBILITY,
	payload: {
		sortOrder
	}
});

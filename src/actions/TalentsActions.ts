import { ADD_TALENT_POINT, REMOVE_TALENT_POINT, SET_TALENTS_SORT_ORDER, SWITCH_TALENT_RATING_VISIBILITY } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addPoint = (id: string): void => AppDispatcher.dispatch(<AddTalentPointAction>{
	type: ADD_TALENT_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string): void => AppDispatcher.dispatch(<RemoveTalentPointAction>{
	type: REMOVE_TALENT_POINT,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetTalentsSortOrderAction>{
	type: SET_TALENTS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setRatingVisibility = (sortOrder: string): void => AppDispatcher.dispatch(<SwitchTalentRatingVisibilityAction>{
	type: SWITCH_TALENT_RATING_VISIBILITY,
	payload: {
		sortOrder
	}
});

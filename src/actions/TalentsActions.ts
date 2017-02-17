import { ADD_TALENT_POINT, REMOVE_TALENT_POINT, SET_TALENTS_SORT_ORDER, SWITCH_TALENT_RATING_VISIBILITY } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addPoint = (id: string) => AppDispatcher.dispatch<AddTalentPointAction>({
	type: ADD_TALENT_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveTalentPointAction>({
	type: REMOVE_TALENT_POINT,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetTalentsSortOrderAction>({
	type: SET_TALENTS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const switchRatingVisibility = () => AppDispatcher.dispatch<SwitchTalentRatingVisibilityAction>({
	type: SWITCH_TALENT_RATING_VISIBILITY
});

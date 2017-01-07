import * as ActionTypes from '../constants/ActionTypes';

export interface SetTalentsSortOrderAction {
	type: ActionTypes.SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setTalentsSortOrder = (sortOrder: string): SetTalentsSortOrderAction => ({
	type: ActionTypes.SET_TALENTS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

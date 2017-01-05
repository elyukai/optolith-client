import * as ActionTypes from '../constants/ActionTypes';

export interface SortTalentsAction {
	type: ActionTypes.SORT_TALENTS;
	payload: {
		sortOrder: string;
	};
}

export const sortTalents = (sortOrder: string) => ({
	type: ActionTypes.SORT_TALENTS,
	payload: {
		sortOrder
	}
});

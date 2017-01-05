import AppDispatcher from '../dispatcher/AppDispatcher';
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

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.FILTER_TALENTS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.SORT_TALENTS,
			option
		});
	},
	changeTalentRating(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.CHANGE_TALENT_RATING
		});
	},
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.ADD_TALENT_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.REMOVE_TALENT_POINT,
			id
		});
	}
};

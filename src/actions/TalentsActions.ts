import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_TALENTS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_TALENTS,
			option
		});
	},
	changeTalentRating(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_TALENT_RATING
		});
	},
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_TALENT_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_TALENT_POINT,
			id
		});
	}
};

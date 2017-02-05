import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_TALENTS,
			text
		});
	},
	sort(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_TALENTS,
			option
		});
	},
	changeTalentRating() {
		AppDispatcher.dispatch({
			type: ActionTypes.CHANGE_TALENT_RATING
		});
	},
	addPoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_TALENT_POINT,
			id
		});
	},
	removePoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_TALENT_POINT,
			id
		});
	}
};

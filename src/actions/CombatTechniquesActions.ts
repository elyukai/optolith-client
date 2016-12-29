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
			actionType: ActionTypes.SORT_COMBATTECHNIQUES,
			option
		});
	},
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
			id
		});
	}
};

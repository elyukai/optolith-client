import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_LITURGIES,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_LITURGIES,
			option
		});
	},
	changeView(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_LITURGY_VIEW,
			option
		});
	},
	addToList(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ACTIVATE_LITURGY,
			id
		});
	},
	removeFromList(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.DEACTIVATE_LITURGY,
			id
		});
	},
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_LITURGY_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_LITURGY_POINT,
			id
		});
	}
};

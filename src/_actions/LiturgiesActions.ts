import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_LITURGIES,
			text
		});
	},
	sort(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_LITURGIES,
			option
		});
	},
	changeView(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_LITURGY_VIEW,
			option
		});
	},
	addToList(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.ACTIVATE_LITURGY,
			id
		});
	},
	removeFromList(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.DEACTIVATE_LITURGY,
			id
		});
	},
	addPoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_LITURGY_POINT,
			id
		});
	},
	removePoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_LITURGY_POINT,
			id
		});
	}
};

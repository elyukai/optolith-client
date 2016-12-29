import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_SPELLS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_SPELLS,
			option
		});
	},
	changeView(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPELL_VIEW,
			option
		});
	},
	addToList(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ACTIVATE_SPELL,
			id
		});
	},
	removeFromList(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.DEACTIVATE_SPELL,
			id
		});
	},
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_SPELL_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_SPELL_POINT,
			id
		});
	}
};

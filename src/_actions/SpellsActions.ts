import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_SPELLS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_SPELLS,
			option
		});
	},
	changeView(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SPELL_VIEW,
			option
		});
	},
	addToList(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ACTIVATE_SPELL,
			id
		});
	},
	removeFromList(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.DEACTIVATE_SPELL,
			id
		});
	},
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_SPELL_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_SPELL_POINT,
			id
		});
	}
};

import { get } from '../stores/ListStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export default {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_SPELLS,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_SPELLS,
			option
		});
	},
	changeView: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPELL_VIEW,
			option
		});
	},
	addToList: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ACTIVATE_SPELL,
			id
		});
	},
	removeFromList: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.DEACTIVATE_SPELL,
			id
		});
	},
	addPoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_SPELL_POINT,
			id
		});
	},
	removePoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_SPELL_POINT,
			id
		});
	}
};

import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_LITURGIES,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_LITURGIES,
			option
		});
	},
	changeView: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_LITURGY_VIEW,
			option
		});
	},
	addToList: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ACTIVATE_LITURGY,
			id
		});
	},
	removeFromList: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.DEACTIVATE_LITURGY,
			id
		});
	},
	addPoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_LITURGY_POINT,
			id
		});
	},
	removePoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_LITURGY_POINT,
			id
		});
	}
};

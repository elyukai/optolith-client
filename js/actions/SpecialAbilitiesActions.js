import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_SPECIALABILITIES,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_SPECIALABILITIES,
			option
		});
	},
	changeView: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPECIALABILITY_VIEW,
			option
		});
	},
	addToList: function(args) {
		args.actionType = ActionTypes.ACTIVATE_SPECIALABILITY;
		AppDispatcher.dispatch(args);
	},
	removeFromList: function(args) {
		args.actionType = ActionTypes.DEACTIVATE_SPECIALABILITY;
		AppDispatcher.dispatch(args);
	},
	updateTier: function(id, tier, costs, sid) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPECIALABILITY_TIER,
			id, tier, costs, sid
		});
	}
};

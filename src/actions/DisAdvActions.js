import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_DISADV,
			text
		});
	},
	changeRating: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_DISADV_RATING
		});
	},
	addToList: function(args) {
		args.actionType = ActionTypes.ACTIVATE_DISADV;
		AppDispatcher.dispatch(args);
	},
	removeFromList: function(args) {
		args.actionType = ActionTypes.DEACTIVATE_DISADV;
		AppDispatcher.dispatch(args);
	},
	updateTier: function(id, tier, costs, sid) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_DISADV_TIER,
			id, tier, costs, sid
		});
	}
};

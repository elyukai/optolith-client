import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import ActionTypes from '../constants/ActionTypes';

var DisAdvActions = {
	receiveAll: function(rawAdv, rawDisAdv) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_DISADV,
			rawAdv, rawDisAdv
		});
	},
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
		AppDispatcher.dispatch(Object.assign({
			actionType: ActionTypes.ACTIVATE_DISADV
		},
			args
		));
	},
	removeFromList: function(args) {
		AppDispatcher.dispatch(Object.assign({
			actionType: ActionTypes.DEACTIVATE_DISADV
		},
			args
		));
	},
	updateTier: function(id, tier, ap_difference, sid) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_DISADV_TIER,
			id, tier, costs: ap_difference, sid
		});
	}
};

export default DisAdvActions;

import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import ActionTypes from '../constants/ActionTypes';

var SpecialAbilitiesActions = {
	receiveAll: function(rawSA) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_SPECIALABILITIES,
			rawSA
		});
	},
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
		var costs = APStore.validate(args.costs);
		if (costs !== false) {
			AppDispatcher.dispatch(Object.assign({
				actionType: ActionTypes.ACTIVATE_SPECIALABILITY
			}, args));
		}
	},
	removeFromList: function(args) {
		AppDispatcher.dispatch(Object.assign({
			actionType: ActionTypes.DEACTIVATE_SPECIALABILITY
		}, args));
	},
	updateTier: function(id, tier, ap_difference, sid) {
		var costs = APStore.validate(ap_difference, true, true, true);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.UPDATE_SPECIALABILITY_TIER,
				id, tier, costs: ap_difference, sid
			});
		}
	}
};

export default SpecialAbilitiesActions;

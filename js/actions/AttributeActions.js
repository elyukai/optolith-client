import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import AttributeStore from '../stores/AttributeStore';
import ActionTypes from '../constants/ActionTypes';

var AttributeActions = {
	receiveAll: function(rawAttributes) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_ATTRIBUTES,
			rawAttributes
		});
	},
	addPoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_ATTRIBUTE_POINT,
			id
		});
	},
	removePoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_ATTRIBUTE_POINT,
			id
		});
	},
	addMaxEnergyPoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_MAX_ENERGY_POINT,
			id
		});
	}
};

export default AttributeActions;

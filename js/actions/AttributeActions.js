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
		var attribute = AttributeStore.get(id);
		var costs = APStore.validate(attribute.value + 1, 5);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ADD_ATTRIBUTE_POINT,
				id, costs
			});
		}
	},
	removePoint: function(id) {
		var attribute = AttributeStore.get(id);
		var costs = APStore.getCosts(attribute.value, 5, false);
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_ATTRIBUTE_POINT,
			id, costs
		});
	},
	addMaxEnergyPoint: function(id) {
		var value = AttributeStore.getAdd(id);
		var costs = APStore.validate(value + 1, 4);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ADD_MAX_ENERGY_POINT,
				id, costs
			});
		}
	}
};

export default AttributeActions;

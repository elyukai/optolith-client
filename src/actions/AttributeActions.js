import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
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

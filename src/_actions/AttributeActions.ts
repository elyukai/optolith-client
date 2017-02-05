import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	addPoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_ATTRIBUTE_POINT,
			id
		});
	},
	removePoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
			id
		});
	},
	addMaxEnergyPoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_MAX_ENERGY_POINT,
			id
		});
	}
};

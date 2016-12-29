import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	addPoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_ATTRIBUTE_POINT,
			id
		});
	},
	removePoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_ATTRIBUTE_POINT,
			id
		});
	},
	addMaxEnergyPoint(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_MAX_ENERGY_POINT,
			id
		});
	}
};

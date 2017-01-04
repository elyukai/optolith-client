import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	checkRequests(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SHOW_MASTER_REQUESTED_LIST
		});
	},
	closeRequests(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.HIDE_MASTER_REQUESTED_LIST
		});
	}
};

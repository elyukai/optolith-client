import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	checkRequests(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SHOW_MASTER_REQUESTED_LIST
		});
	},
	closeRequests(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.HIDE_MASTER_REQUESTED_LIST
		});
	}
};

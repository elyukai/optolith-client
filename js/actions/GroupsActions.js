import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var GroupsActions = {
	checkRequests: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.SHOW_MASTER_REQUESTED_LIST
		});
	},
	closeRequests: function(){
		AppDispatcher.dispatch({
			actionType: ActionTypes.HIDE_MASTER_REQUESTED_LIST
		});
	}
};

export default GroupsActions;

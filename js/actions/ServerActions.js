import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var ServerActions = {
	receiveLists: function(raw) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_LISTS,
			...raw
		});
	},
	registrationSuccess: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REGISTRATION_SUCCESS
		});
	},
	receiveUser: function(raw) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.LOGIN_SUCCESS,
			raw
		});
	}
};

export default ServerActions;

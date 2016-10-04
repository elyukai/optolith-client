import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var WaitActions = {
	end: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_END
		});
	}
};

export default WaitActions;

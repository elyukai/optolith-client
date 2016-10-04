import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var PhaseActions = {
	increasePhase: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.INCREASE_PHASE
		});
	},
	resetPhase: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RESET_PHASE
		});
	}
};

export default PhaseActions;

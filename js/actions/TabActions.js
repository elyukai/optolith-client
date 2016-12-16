import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	showTab: function(tab) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SHOW_TAB,
			tab
		});
	},
	showSection: function(section) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SHOW_TAB_SECTION,
			section
		});
	}
};

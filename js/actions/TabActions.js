import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import reactAlert from '../utils/reactAlert';
import saveHero from '../utils/saveHero';
import AccountStore from '../stores/AccountStore';

var TabActions = {
	openTab: function(tab) {
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

export default TabActions;

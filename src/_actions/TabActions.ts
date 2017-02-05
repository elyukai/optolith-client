import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	showTab(tab: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SHOW_TAB,
			tab
		});
	},
	showSection(section: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SHOW_TAB_SECTION,
			section
		});
	}
};

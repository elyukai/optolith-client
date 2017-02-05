import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectCulture(cultureID: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SELECT_CULTURE,
			cultureID
		});
	},
	filter(text: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_CULTURES,
			text
		});
	},
	sort(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_CULTURES,
			option
		});
	},
	changeValueVisibility() {
		AppDispatcher.dispatch({
			type: ActionTypes.CHANGE_CULTURE_VALUE_VISIBILITY
		});
	},
	changeView(view: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.CHANGE_CULTURE_VIEW,
			view
		});
	}
};

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectCulture(cultureID: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_CULTURE,
			cultureID
		});
	},
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_CULTURES,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_CULTURES,
			option
		});
	},
	changeValueVisibility(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_CULTURE_VALUE_VISIBILITY
		});
	},
	changeView(view: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_CULTURE_VIEW,
			view
		});
	}
};

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import { ItemEditorInstance } from '../utils/data/Item';

export default {
	filter(text: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_ITEMS,
			text
		});
	},
	sort(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_ITEMS,
			option
		});
	},
	addToList(item: ItemEditorInstance) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_ITEM,
			item
		});
	},
	saveItem(item: ItemEditorInstance) {
		AppDispatcher.dispatch({
			type: ActionTypes.SAVE_ITEM,
			item
		});
	},
	removeFromList(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_ITEM,
			id
		});
	}
};

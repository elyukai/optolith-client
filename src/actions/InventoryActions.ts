import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import { ItemEditorInstance } from '../utils/data/Item';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_ITEMS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_ITEMS,
			option
		});
	},
	addToList(item: ItemEditorInstance): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_ITEM,
			item
		});
	},
	saveItem(item: ItemEditorInstance): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SAVE_ITEM,
			item
		});
	},
	removeFromList(id: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_ITEM,
			id
		});
	}
};

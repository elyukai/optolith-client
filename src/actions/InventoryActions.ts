import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import { ItemArguments } from '../utils/data/Item';

export default {
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_ITEMS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_ITEMS,
			option
		});
	},
	addToList(item: ItemArguments): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_ITEM,
			item
		});
	},
	saveItem(item: ItemArguments): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SAVE_ITEM,
			item
		});
	},
	removeFromList(id: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_ITEM,
			id
		});
	}
};

import { ADD_ITEM, SET_ITEMS_SORT_ORDER, REMOVE_ITEM, SET_ITEM } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (data: ItemInstance) => AppDispatcher.dispatch<AddItemAction>({
	type: ADD_ITEM,
	payload: {
		data
	}
});

export const set = (id: string, data: ItemInstance) => AppDispatcher.dispatch<SetItemAction>({
	type: SET_ITEM,
	payload: {
		id,
		data
	}
});

export const removeFromList = (id: string) => AppDispatcher.dispatch<RemoveItemAction>({
	type: REMOVE_ITEM,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetItemsSortOrderAction>({
	type: SET_ITEMS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

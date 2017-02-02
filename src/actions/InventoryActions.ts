/// <reference path="../data.d.ts" />

import { ADD_ITEM, SET_ITEMS_SORT_ORDER, REMOVE_ITEM, SET_ITEM } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (data: Item): void => AppDispatcher.dispatch(<AddItemAction>{
	type: ADD_ITEM,
	payload: {
		data
	}
});

export const set = (id: string, data: Item): void => AppDispatcher.dispatch(<SetItemAction>{
	type: SET_ITEM,
	payload: {
		id,
		data
	}
});

export const removeFromList = (id: string): void => AppDispatcher.dispatch(<RemoveItemAction>{
	type: REMOVE_ITEM,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetItemsSortOrderAction>{
	type: SET_ITEMS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

/// <reference path="../data.d.ts" />

import { ADD_ITEM, SET_ITEMS_SORT_ORDER, REMOVE_ITEM, SET_ITEM } from '../constants/ActionTypes';

export interface AddItemAction {
	type: ADD_ITEM;
	payload: {
		data: Item;
	};
}

export const addToList = (data: Item): AddItemAction => ({
	type: ADD_ITEM,
	payload: {
		data
	}
});

export interface SetItemAction {
	type: SET_ITEM;
	payload: {
		id: string;
		data: Item;
	};
}

export const set = (id: string, data: Item): SetItemAction => ({
	type: SET_ITEM,
	payload: {
		id,
		data
	}
});

export interface RemoveItemAction {
	type: REMOVE_ITEM;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string): RemoveItemAction => ({
	type: REMOVE_ITEM,
	payload: {
		id
	}
});

export interface SetItemsSortOrderAction {
	type: SET_ITEMS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string): SetItemsSortOrderAction => ({
	type: SET_ITEMS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

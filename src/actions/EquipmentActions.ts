import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { ItemInstance } from '../types/data.d';

export interface AddItemAction extends Action {
	type: ActionTypes.ADD_ITEM;
	payload: {
		data: ItemInstance;
	};
}

export const addToList = (data: ItemInstance) => AppDispatcher.dispatch<AddItemAction>({
	type: ActionTypes.ADD_ITEM,
	payload: {
		data
	}
});

export interface SetItemAction extends Action {
	type: ActionTypes.SET_ITEM;
	payload: {
		id: string;
		data: ItemInstance;
	};
}

export const set = (id: string, data: ItemInstance) => AppDispatcher.dispatch<SetItemAction>({
	type: ActionTypes.SET_ITEM,
	payload: {
		id,
		data
	}
});

export interface RemoveItemAction extends Action {
	type: ActionTypes.REMOVE_ITEM;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string) => AppDispatcher.dispatch<RemoveItemAction>({
	type: ActionTypes.REMOVE_ITEM,
	payload: {
		id
	}
});

export interface SetItemsSortOrderAction extends Action {
	type: ActionTypes.SET_ITEMS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetItemsSortOrderAction>({
	type: ActionTypes.SET_ITEMS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SetDucatesAction extends Action {
	type: ActionTypes.SET_DUCATES;
	payload: {
		value: string;
	};
}

export const setDucates = (value: string) => AppDispatcher.dispatch<SetDucatesAction>({
	type: ActionTypes.SET_DUCATES,
	payload: {
		value
	}
});

export interface SetSilverthalersAction extends Action {
	type: ActionTypes.SET_SILVERTHALERS;
	payload: {
		value: string;
	};
}

export const setSilverthalers = (value: string) => AppDispatcher.dispatch<SetSilverthalersAction>({
	type: ActionTypes.SET_SILVERTHALERS,
	payload: {
		value
	}
});

export interface SetHellersAction extends Action {
	type: ActionTypes.SET_HELLERS;
	payload: {
		value: string;
	};
}

export const setHellers = (value: string) => AppDispatcher.dispatch<SetHellersAction>({
	type: ActionTypes.SET_HELLERS,
	payload: {
		value
	}
});

export interface SetKreutzersAction extends Action {
	type: ActionTypes.SET_KREUTZERS;
	payload: {
		value: string;
	};
}

export const setKreutzers = (value: string) => AppDispatcher.dispatch<SetKreutzersAction>({
	type: ActionTypes.SET_KREUTZERS,
	payload: {
		value
	}
});

import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (data: ItemInstance) => AppDispatcher.dispatch<AddItemAction>({
	type: ActionTypes.ADD_ITEM,
	payload: {
		data
	}
});

export const set = (id: string, data: ItemInstance) => AppDispatcher.dispatch<SetItemAction>({
	type: ActionTypes.SET_ITEM,
	payload: {
		id,
		data
	}
});

export const removeFromList = (id: string) => AppDispatcher.dispatch<RemoveItemAction>({
	type: ActionTypes.REMOVE_ITEM,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetItemsSortOrderAction>({
	type: ActionTypes.SET_ITEMS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setDucates = (value: string) => AppDispatcher.dispatch<SetDucatesAction>({
	type: ActionTypes.SET_DUCATES,
	payload: {
		value
	}
});

export const setSilverthalers = (value: string) => AppDispatcher.dispatch<SetSilverthalersAction>({
	type: ActionTypes.SET_SILVERTHALERS,
	payload: {
		value
	}
});

export const setHellers = (value: string) => AppDispatcher.dispatch<SetHellersAction>({
	type: ActionTypes.SET_HELLERS,
	payload: {
		value
	}
});

export const setKreutzers = (value: string) => AppDispatcher.dispatch<SetKreutzersAction>({
	type: ActionTypes.SET_KREUTZERS,
	payload: {
		value
	}
});

import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { ArmorZonesEditorInstance, ArmorZonesInstance, ItemInstance } from '../types/data.d';

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

export function _addToList(data: ItemInstance): AddItemAction {
	return {
		type: ActionTypes.ADD_ITEM,
		payload: {
			data
		}
	};
}

export interface AddArmorZonesAction extends Action {
	type: ActionTypes.ADD_ARMOR_ZONES;
	payload: {
		data: ArmorZonesEditorInstance;
	};
}

export const addArmorZonesToList = (data: ArmorZonesEditorInstance) => AppDispatcher.dispatch<AddArmorZonesAction>({
	type: ActionTypes.ADD_ARMOR_ZONES,
	payload: {
		data
	}
});

export function _addArmorZonesToList(data: ArmorZonesEditorInstance): AddArmorZonesAction {
	return {
		type: ActionTypes.ADD_ARMOR_ZONES,
		payload: {
			data
		}
	};
}

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

export function _set(id: string, data: ItemInstance): SetItemAction {
	return {
		type: ActionTypes.SET_ITEM,
		payload: {
			id,
			data
		}
	};
}

export interface SetArmorZonesAction extends Action {
	type: ActionTypes.SET_ARMOR_ZONES;
	payload: {
		id: string;
		data: ArmorZonesInstance;
	};
}

export const setArmorZones = (id: string, data: ArmorZonesInstance) => AppDispatcher.dispatch<SetArmorZonesAction>({
	type: ActionTypes.SET_ARMOR_ZONES,
	payload: {
		id,
		data
	}
});

export function _setArmorZones(id: string, data: ArmorZonesInstance): SetArmorZonesAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES,
		payload: {
			id,
			data
		}
	};
}

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

export function _removeFromList(id: string): RemoveItemAction {
	return {
		type: ActionTypes.REMOVE_ITEM,
		payload: {
			id
		}
	};
}

export interface RemoveArmorZonesAction extends Action {
	type: ActionTypes.REMOVE_ARMOR_ZONES;
	payload: {
		id: string;
	};
}

export const removeArmorZonesFromList = (id: string) => AppDispatcher.dispatch<RemoveArmorZonesAction>({
	type: ActionTypes.REMOVE_ARMOR_ZONES,
	payload: {
		id
	}
});

export function _removeArmorZonesFromList(id: string): RemoveArmorZonesAction {
	return {
		type: ActionTypes.REMOVE_ARMOR_ZONES,
		payload: {
			id
		}
	};
}

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

export function _setSortOrder(sortOrder: string): SetItemsSortOrderAction {
	return {
		type: ActionTypes.SET_ITEMS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

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

export function _setDucates(value: string): SetDucatesAction {
	return {
		type: ActionTypes.SET_DUCATES,
		payload: {
			value
		}
	};
}

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

export function _setSilverthalers(value: string): SetSilverthalersAction {
	return {
		type: ActionTypes.SET_SILVERTHALERS,
		payload: {
			value
		}
	};
}

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

export function _setHellers(value: string): SetHellersAction {
	return {
		type: ActionTypes.SET_HELLERS,
		payload: {
			value
		}
	};
}

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

export function _setKreutzers(value: string): SetKreutzersAction {
	return {
		type: ActionTypes.SET_KREUTZERS,
		payload: {
			value
		}
	};
}

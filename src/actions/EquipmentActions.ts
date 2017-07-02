import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { ArmorZonesEditorInstance, ArmorZonesInstance, ItemInstance } from '../types/data.d';
import { getNewId } from '../utils/IDUtils';

export interface AddItemAction {
	type: ActionTypes.ADD_ITEM;
	payload: {
		id: string;
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
	const { items } = store.getState().currentHero.present.equipment;
	const id = `ITEM_${getNewId([...items.keys()])}`;
	return {
		type: ActionTypes.ADD_ITEM,
		payload: {
			id,
			data
		}
	};
}

export interface AddArmorZonesAction {
	type: ActionTypes.ADD_ARMOR_ZONES;
	payload: {
		id: string;
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
	const { items } = store.getState().currentHero.present.equipment;
	const id = `ARMORZONES_${getNewId([...items.keys()])}`;
	return {
		type: ActionTypes.ADD_ARMOR_ZONES,
		payload: {
			id,
			data
		}
	};
}

export interface SetItemAction {
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

export interface SetArmorZonesAction {
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

export interface RemoveItemAction {
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

export interface RemoveArmorZonesAction {
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

export interface SetItemsSortOrderAction {
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

export interface SetDucatesAction {
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

export interface SetSilverthalersAction {
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

export interface SetHellersAction {
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

export interface SetKreutzersAction {
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

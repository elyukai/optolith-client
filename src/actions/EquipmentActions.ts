import * as ActionTypes from '../constants/ActionTypes';
import { AsyncAction } from '../types/actions.d';
import { ArmorZonesEditorInstance, ArmorZonesInstance, ItemInstance } from '../types/data.d';
import { getNewId } from '../utils/IDUtils';

export interface AddItemAction {
	type: ActionTypes.ADD_ITEM;
	payload: {
		id: string;
		data: ItemInstance;
	};
}

export function _addToList(data: ItemInstance): AsyncAction {
	return (dispatch, getState) => {
		const { items } = getState().currentHero.present.equipment;
		const id = `ITEM_${getNewId([...items.keys()])}`;
		dispatch({
			type: ActionTypes.ADD_ITEM,
			payload: {
				id,
				data
			}
		} as AddItemAction);
	};
}

export interface AddArmorZonesAction {
	type: ActionTypes.ADD_ARMOR_ZONES;
	payload: {
		id: string;
		data: ArmorZonesEditorInstance;
	};
}

export function _addArmorZonesToList(data: ArmorZonesEditorInstance): AsyncAction {
	return (dispatch, getState) => {
		const { items } = getState().currentHero.present.equipment;
		const id = `ARMORZONES_${getNewId([...items.keys()])}`;
		dispatch({
			type: ActionTypes.ADD_ARMOR_ZONES,
			payload: {
				id,
				data
			}
		} as AddArmorZonesAction);
	};
}

export interface SetItemAction {
	type: ActionTypes.SET_ITEM;
	payload: {
		id: string;
		data: ItemInstance;
	};
}

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

export function _setKreutzers(value: string): SetKreutzersAction {
	return {
		type: ActionTypes.SET_KREUTZERS,
		payload: {
			value
		}
	};
}

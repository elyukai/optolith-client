import * as ActionTypes from '../constants/ActionTypes';
import { PetInstance } from '../types/data.d';

export interface AddPetAction {
	type: ActionTypes.ADD_PET;
	payload: {
		data: PetInstance;
	};
}

export const addToList = (data: PetInstance) => AppDispatcher.dispatch<AddPetAction>({
	type: ActionTypes.ADD_PET,
	payload: {
		data
	}
});

export function _addToList(data: PetInstance): AddPetAction {
	return {
		type: ActionTypes.ADD_PET,
		payload: {
			data
		}
	};
}

export interface SetPetAction {
	type: ActionTypes.SET_PET;
	payload: {
		id: string;
		data: PetInstance;
	};
}

export const set = (id: string, data: PetInstance) => AppDispatcher.dispatch<SetPetAction>({
	type: ActionTypes.SET_PET,
	payload: {
		id,
		data
	}
});

export function _set(id: string, data: PetInstance): SetPetAction {
	return {
		type: ActionTypes.SET_PET,
		payload: {
			id,
			data
		}
	};
}

export interface RemovePetAction {
	type: ActionTypes.REMOVE_PET;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string) => AppDispatcher.dispatch<RemovePetAction>({
	type: ActionTypes.REMOVE_PET,
	payload: {
		id
	}
});

export function _removeFromList(id: string): RemovePetAction {
	return {
		type: ActionTypes.REMOVE_PET,
		payload: {
			id
		}
	};
}

export interface SetPetsSortOrderAction {
	type: ActionTypes.SET_PETS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetPetsSortOrderAction>({
	type: ActionTypes.SET_PETS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export function _setSortOrder(sortOrder: string): SetPetsSortOrderAction {
	return {
		type: ActionTypes.SET_PETS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

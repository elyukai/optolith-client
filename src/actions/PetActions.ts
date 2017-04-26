import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { PetInstance } from '../types/data.d';

export interface AddPetAction extends Action {
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

export interface SetPetAction extends Action {
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

export interface RemovePetAction extends Action {
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

export interface SetPetsSortOrderAction extends Action {
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

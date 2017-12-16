import * as ActionTypes from '../constants/ActionTypes';
import { AsyncAction } from '../types/actions.d';
import { PetEditorInstance, PetInstance } from '../types/data.d';
import { getNewId } from '../utils/IDUtils';
import { convertToSave } from '../utils/PetUtils';
import { getPetsState } from '../selectors/stateSelectors';

export interface AddPetAction {
	type: ActionTypes.ADD_PET;
	payload: {
		id: string;
		data: PetInstance;
	};
}

export function _addToList(data: PetEditorInstance): AsyncAction {
	return (dispatch, getState) => {
		const id = `PET_${getNewId([...getPetsState(getState()).keys()])}`;
		dispatch<AddPetAction>({
			type: ActionTypes.ADD_PET,
			payload: {
				id,
				data: convertToSave(data)
			}
		});
	};
}

export interface SetPetAction {
	type: ActionTypes.SET_PET;
	payload: {
		id: string;
		data: PetInstance;
	};
}

export function _set(id: string, data: PetEditorInstance): SetPetAction {
	return {
		type: ActionTypes.SET_PET,
		payload: {
			id,
			data: convertToSave(data)
		}
	};
}

export interface RemovePetAction {
	type: ActionTypes.REMOVE_PET;
	payload: {
		id: string;
	};
}

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

export function _setSortOrder(sortOrder: string): SetPetsSortOrderAction {
	return {
		type: ActionTypes.SET_PETS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

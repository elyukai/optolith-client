import { ActionTypes } from '../constants/ActionTypes';
import { getPets } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { PetEditorInstance, PetInstance } from '../types/data';
import { Record } from '../utils/dataUtils';
import { getNewId } from '../utils/IDUtils';
import { convertToSave } from '../utils/PetUtils';

export interface AddPetAction {
  type: ActionTypes.ADD_PET;
  payload: {
    id: string;
    data: Record<PetInstance>;
  };
}

export const addPet = (data: Record<PetEditorInstance>): AsyncAction => (dispatch, getState) => {
  getPets (getState ()).fmap (
    pets => {
      const id = `PET_${getNewId (pets.keys ())}`;

      return dispatch<AddPetAction> ({
        type: ActionTypes.ADD_PET,
        payload: {
          id,
          data: convertToSave (data)
        }
      });
    }
  )
};

export interface SetPetAction {
  type: ActionTypes.SET_PET;
  payload: {
    id: string;
    data: Record<PetInstance>;
  };
}

export const adjustPet = (id: string) => (data: Record<PetEditorInstance>): SetPetAction => ({
  type: ActionTypes.SET_PET,
  payload: {
    id,
    data: convertToSave (data)
  }
});

export interface RemovePetAction {
  type: ActionTypes.REMOVE_PET;
  payload: {
    id: string;
  };
}

export const removePet = (id: string): RemovePetAction => ({
  type: ActionTypes.REMOVE_PET,
  payload: {
    id
  }
});

export interface SetPetsSortOrderAction {
  type: ActionTypes.SET_PETS_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setPetsSortOrder = (sortOrder: string): SetPetsSortOrderAction => ({
  type: ActionTypes.SET_PETS_SORT_ORDER,
  payload: {
    sortOrder
  }
});

import * as PetActions from '../actions/PetActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { Record } from '../utils/dataUtils';

type Action =
  PetActions.AddPetAction |
  PetActions.RemovePetAction |
  PetActions.SetPetAction;

export function petsReducer(
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_PET:
    case ActionTypes.SET_PET: {
      const { data, id } = action.payload;

      return state.modify(
        pets => pets.insert('family', Record.of<Data.PetInstance>({ ...data, id })),
        'pets'
      );
    }

    case ActionTypes.REMOVE_PET:
      return state.modify(
        pets => pets.delete(action.payload.id),
        'pets'
      );

    default:
      return state;
  }
}

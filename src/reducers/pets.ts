import * as HerolistActions from '../actions/HerolistActions';
import * as PetActions from '../actions/PetActions';
import { ActionTypes } from '../constants/ActionTypes';
import { PetInstance } from '../types/data.d';
import { removeListItem, setListItem } from '../utils/ListUtils';

type Action =
  PetActions.AddPetAction |
  PetActions.RemovePetAction |
  PetActions.SetPetAction |
  HerolistActions.LoadHeroAction |
  HerolistActions.CreateHeroAction;

export interface PetsState extends Map<string, PetInstance> {}

export function pets(state: PetsState = new Map(), action: Action): PetsState {
  switch (action.type) {
    case ActionTypes.CREATE_HERO:
      return new Map();

    case ActionTypes.ADD_PET:
    case ActionTypes.SET_PET: {
      const { data, id } = action.payload;
      return setListItem(state, id, { ...data, id });
    }

    case ActionTypes.REMOVE_PET: {
      const { id } = action.payload;
      return removeListItem(state, id);
    }

    case ActionTypes.LOAD_HERO:
      const { pets = {} } = action.payload.data;
      const petsMap = new Map<string, PetInstance>();

      for (const [id, pet] of Object.entries(pets)) {
        petsMap.set(id, pet);
      }

      return petsMap;

    default:
      return state;
  }
}

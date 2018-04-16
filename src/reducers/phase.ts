import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { EndHeroCreationAction } from '../actions/ProfileActions';
import { ActionTypes } from '../constants/ActionTypes';

type Action =
  CreateHeroAction |
  LoadHeroAction |
  SetSelectionsAction |
  EndHeroCreationAction;

export type PhaseState = number;

export function phase(state: PhaseState = 1, action: Action): PhaseState {
  switch (action.type) {
    case ActionTypes.LOAD_HERO:
      return action.payload.data.phase;

    case ActionTypes.CREATE_HERO:
      return 1;

    case ActionTypes.ASSIGN_RCP_OPTIONS:
      return 2;

    case ActionTypes.END_HERO_CREATION:
      return 3;

    default:
      return state;
  }
}

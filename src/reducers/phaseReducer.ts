import { SetSelectionsAction } from '../actions/ProfessionActions';
import { EndHeroCreationAction } from '../actions/ProfileActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { Record } from '../utils/dataUtils';

type Action =
  SetSelectionsAction |
  EndHeroCreationAction;

export function phaseReducer(
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ASSIGN_RCP_OPTIONS:
      return state.insert('phase', 2);

    case ActionTypes.END_HERO_CREATION:
      return state.insert('phase', 3);

    default:
      return state;
  }
}

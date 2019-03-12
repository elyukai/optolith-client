import { SetSelectionsAction } from '../Actions/ProfessionActions';
import { EndHeroCreationAction } from '../Actions/ProfileActions';
import { ActionTypes } from '../Constants/ActionTypes';
import * as Data from '../Models/Hero/heroTypeHelpers';
import { Record } from '../utils/dataUtils';

type Action =
  SetSelectionsAction |
  EndHeroCreationAction;

export function phaseReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ASSIGN_RCP_OPTIONS:
      return state.insert ('phase') (2);

    case ActionTypes.END_HERO_CREATION:
      return state.insert ('phase') (3);

    default:
      return state;
  }
}

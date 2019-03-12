import { SwitchEnableEditingHeroAfterCreationPhaseAction } from '../Actions/ConfigActions';
import { CreateHeroAction, LoadHeroAction } from '../Actions/HerolistActions';
import { SetTabAction } from '../Actions/LocationActions';
import { SetSelectionsAction } from '../Actions/ProfessionActions';
import { ActionTypes } from '../Constants/ActionTypes';
import { TabId } from '../Utils/LocationUtils';

type Action =
  SetTabAction |
  CreateHeroAction |
  LoadHeroAction |
  SetSelectionsAction |
  SwitchEnableEditingHeroAfterCreationPhaseAction;

export interface UILocationState {
  tab: TabId;
}

const initialState: UILocationState = {
  tab: 'herolist'
};

export function routeReducer (
  state: UILocationState = initialState,
  action: Action
): UILocationState {
  switch (action.type) {
    case ActionTypes.SET_TAB:
      return { tab: action.payload.tab };

    case ActionTypes.CREATE_HERO:
      return { tab: 'races' };

    case ActionTypes.LOAD_HERO:
      return { tab: 'profile' };

    case ActionTypes.ASSIGN_RCP_OPTIONS:
      return { tab: 'attributes' };

    case ActionTypes.SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE:
      if (state.tab === 'advantages' || state.tab === 'disadvantages') {
        return { tab: 'profile' };
      }

      return state;

    default:
      return state;
  }
}

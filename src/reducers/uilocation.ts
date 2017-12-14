import { SwitchEnableEditingHeroAfterCreationPhaseAction } from '../actions/ConfigActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetTabAction } from '../actions/LocationActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';
import { TabId } from '../utils/LocationUtils';

type Action = SetTabAction | CreateHeroAction | LoadHeroAction | SetSelectionsAction | SwitchEnableEditingHeroAfterCreationPhaseAction;

export interface UILocationState {
	tab: TabId;
}

const initialState: UILocationState = {
	tab: 'herolist'
};

export function uilocation(state: UILocationState = initialState, action: Action): UILocationState {
	switch (action.type) {
		case ActionTypes.SET_TAB:
			return { tab: action.payload.tab };

		case ActionTypes.CREATE_HERO:
			return { tab: 'rules' };

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

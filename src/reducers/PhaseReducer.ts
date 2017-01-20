import { RECEIVE_HERO_DATA, CREATE_HERO, ASSIGN_RCP_OPTIONS, END_HERO_CREATION } from '../constants/ActionTypes';
import { CreateHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { EndHeroCreationAction } from '../actions/ProfileActions';
import { ReceiveHeroDataAction } from '../actions/ServerActions';

type Action = ReceiveHeroDataAction | CreateHeroAction | EndHeroCreationAction | SetSelectionsAction;

export type PhaseState = number;

const initialState: PhaseState = 0;

export default (state: PhaseState = initialState, action: Action): PhaseState => {
	switch (action.type) {
		case RECEIVE_HERO_DATA:
			return action.payload.data.phase;

		case CREATE_HERO:
			return 1;

		case ASSIGN_RCP_OPTIONS:
			return 2;

		case END_HERO_CREATION:
			return 3;

		default:
			return state;
	}
}

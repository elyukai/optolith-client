import { CreateHeroAction } from '../actions/HerolistActions';
import { ReceiveHeroDataAction } from '../actions/ServerActions';
import { CREATE_HERO, RECEIVE_HERO_DATA } from '../constants/ActionTypes';

type Action = CreateHeroAction | ReceiveHeroDataAction;

export type SexState = 'm' | 'f';

export default (state: SexState = 'm', action: Action): SexState => {
	switch (action.type) {
		case RECEIVE_HERO_DATA:
			return action.payload.data.sex;

		case CREATE_HERO:
			return action.payload.sex;

		default:
			return state;
	}
};

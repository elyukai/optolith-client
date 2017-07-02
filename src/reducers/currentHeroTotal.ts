import { CreateHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { CurrentHeroInstanceState } from './currentHero';
import { getStart } from './el';

type Action = CreateHeroAction;

export function currentHeroTotal(state: CurrentHeroInstanceState, action: Action): CurrentHeroInstanceState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO:
			return {
				...state,
				ap: {
					total: getStart(state.el).ap,
					spent: 0,
					adv: [0, 0, 0],
					disadv: [0, 0, 0]
				}
			};

		default:
			return state;
	}
}

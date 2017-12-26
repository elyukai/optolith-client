import { Pact, SetPactCategoryAction, SetPactLevelAction, SetTargetDomainAction, SetTargetNameAction, SetTargetTypeAction } from '../actions/PactActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = SetPactCategoryAction | SetPactLevelAction | SetTargetDomainAction | SetTargetNameAction | SetTargetTypeAction;

export type PactState = Pact | null;

export function pactReducer(state: PactState = null, action: Action): PactState {
	switch (action.type) {
		case ActionTypes.SET_PACT_CATEGORY: {
			const { category } = action.payload;
			if (category === undefined) {
				return null;
			}
			return {
				category,
				level: 1,
				type: 1,
				domain: '',
				name: ''
			};
		}

		case ActionTypes.SET_PACT_LEVEL:
		case ActionTypes.SET_TARGET_TYPE:
		case ActionTypes.SET_TARGET_DOMAIN:
		case ActionTypes.SET_TARGET_NAME: {
			if (state !== null) {
				return {
					...state,
					...action.payload
				};
			}
			return null;
		}

		default:
			return state;
	}
}

import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetHigherParadeValuesAction, SwitchAttributeValueLimitAction } from '../actions/RulesActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = ReceiveInitialDataAction | LoadHeroAction | CreateHeroAction | SetHigherParadeValuesAction | SwitchAttributeValueLimitAction;

export interface RulesState {
	higherParadeValues: number;
	attributeValueLimit: boolean;
}

const initialState: RulesState = {
	higherParadeValues: 0,
	attributeValueLimit: false
};

export function rules(state: RulesState = initialState, action: Action): RulesState {
	switch (action.type) {
		case ActionTypes.RECEIVE_INITIAL_DATA:
		case ActionTypes.CREATE_HERO:
			return {
				higherParadeValues: 0,
				attributeValueLimit: false
			};

		case ActionTypes.LOAD_HERO:
			return {
				...state,
				...action.payload.data.rules
			};

		case ActionTypes.SET_HIGHER_PARADE_VALUES:
			return { ...state, higherParadeValues: action.payload.value };

		case ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT:
			return { ...state, attributeValueLimit: !state.attributeValueLimit };

		default:
			return state;
	}
}

import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { ExperienceLevel } from '../types/data.d';

type Action = CreateHeroAction | LoadHeroAction | ReceiveInitialDataAction;

export interface ELState {
	all: Map<string, ExperienceLevel>;
	startId?: string;
}

const initialState: ELState = {
	all: new Map()
};

export function el(state: ELState = initialState, action: Action): ELState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO:
			return { ...state, startId: action.payload.el };

		case ActionTypes.LOAD_HERO:
			return { ...state, startId: action.payload.data.el };

		case ActionTypes.RECEIVE_INITIAL_DATA:
			throw new Error();

		default:
			return state;
	}
}

export function getStart(state: ELState): ExperienceLevel {
	return state.all.get(state.startId!)!;
}

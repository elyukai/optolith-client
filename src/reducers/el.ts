import { ExperienceLevel } from '../types/data.d';

export interface ELState {
	all: Map<string, ExperienceLevel>;
	startId?: string;
}

const initialState: ELState = {
	all: new Map()
};

export function el(state: ELState = initialState, action: Action): ELState {
	return state;
}

export function getStart(state: ELState): ExperienceLevel {
	return state.all.get(state.startId!)!;
}

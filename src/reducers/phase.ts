import { Hero } from '../types/data.d';

export type PhaseState = number;

export function phase(state: PhaseState = 1, action: Action): PhaseState {
	return state;
}

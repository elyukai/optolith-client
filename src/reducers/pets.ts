import { Hero } from '../types/data.d';

export type PetsState = Map<string, Hero>;

export function pets(state: PetsState = new Map(), action: Action): PetsState {
	return state;
}

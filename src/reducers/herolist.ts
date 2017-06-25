import { Hero } from '../types/data.d';

export type HerolistState = Map<string, Hero>;

export function herolist(state: HerolistState = new Map(), action: Action): HerolistState {
	return state;
}

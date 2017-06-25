import { Hero } from '../types/data.d';

export type HistoryState = Map<string, Hero>;

export function history(state: HistoryState = new Map(), action: Action): HistoryState {
	return state;
}

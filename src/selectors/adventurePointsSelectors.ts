import { AdventurePointsState } from '../reducers/adventurePoints';
import { AppState } from '../reducers/app';

export const getAp = (state: AppState) => state.currentHero.present.ap;
export const getTotal = (state: AppState) => state.currentHero.present.ap.total;
export const getSpent = (state: AppState) => state.currentHero.present.ap.spent;
export const getAvailable = (state: AppState) => getTotal(state) - getSpent(state);

export function getLeft(state: AdventurePointsState) {
	return state.total - state.spent;
}

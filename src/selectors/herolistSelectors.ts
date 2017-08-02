import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { HerolistState } from '../reducers/herolist';

export function getForSave(state: HerolistState, id: string) {
	const hero = state.heroes.get(id);
	if (hero) {
		const { player: playerId, dateCreated, dateModified, ...rest } = hero;
		return {
			...rest,
			id,
			dateCreated: dateCreated.toJSON(),
			dateModified: dateModified.toJSON(),
			player: playerId ? state.users.get(playerId) : undefined
		};
	}
	return;
}

export const getCurrentId = (state: AppState) => state.herolist.currentId;
export const getHeroes = (state: AppState) => state.herolist.heroes;
export const getUsers = (state: AppState) => state.herolist.users;

export const getHeroesArray = createSelector(
	getHeroes,
	heroes => [...heroes.values()]
);

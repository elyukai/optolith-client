import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { ToListById } from '../types/data.d';
import { RawHero } from '../types/rawdata.d';

export const getCurrentId = (state: AppState) => state.herolist.currentId;
export const getHeroes = (state: AppState) => state.herolist.heroes;
export const getUsers = (state: AppState) => state.herolist.users;

export const getHeroesArray = createSelector(
	getHeroes,
	heroes => [...heroes.values()]
);

export function getHeroForSave(state: AppState, id: string): RawHero {
	const heroes = getHeroes(state);
	const users = getUsers(state);
	const hero = heroes.get(id)!;
	const { player: playerId, dateCreated, dateModified, ...rest } = hero;
	return {
		...rest,
		id,
		dateCreated: dateCreated.toJSON(),
		dateModified: dateModified.toJSON(),
		player: playerId ? users.get(playerId) : undefined
	};
}

export function getHeroesForSave(state: AppState): ToListById<RawHero> {
	const heroes = getHeroes(state);
	return [...heroes.keys()].reduce<ToListById<RawHero>>((obj, id) => ({...obj, [id]: getHeroForSave(state, id)}), {});
}

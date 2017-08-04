import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { PetsState } from '../reducers/pets';
import { PetInstance, ToListById } from '../types/data.d';

export function getForSave(state: PetsState) {
	const obj: ToListById<PetInstance> = {};
	for (const [id, item] of state) {
		obj[id] = item;
	}
	return obj;
}

export const getPetsState = (state: AppState) => state.currentHero.present.pets;

export const getPet = createSelector(
	getPetsState,
	pets => [...pets.values()][0]
);

export const getPets = createSelector(
	getPetsState,
	pets => [...pets.values()]
);

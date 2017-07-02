import { PetInstance, ToListById } from '../types/data.d';

export interface PetsState extends Map<string, PetInstance> {}

export function pets(state: PetsState = new Map(), action: Action): PetsState {
	return state;
}

export function getForSave(state: PetsState) {
	const obj: ToListById<PetInstance> = {};
	for (const [id, item] of state) {
		obj[id] = item;
	}
	return obj;
}

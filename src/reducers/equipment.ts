import { Hero } from '../types/data.d';

export type EquipmentState = Map<string, Hero>;

export function equipment(state: EquipmentState = new Map(), action: Action): EquipmentState {
	return state;
}

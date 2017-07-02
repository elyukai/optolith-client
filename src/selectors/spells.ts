import { CANTRIPS, SPELLS } from '../constants/Categories';
import { DependentInstancesState, getAllByCategory } from '../reducers/dependentInstances';
import { CantripInstance, SpellInstance } from '../types/data.d';

export function getForSave(state: DependentInstancesState) {
	const active: { [id: string]: number } = {};
	for (const skill of getAllByCategory(state, SPELLS) as SpellInstance[]) {
		const { id, active: isActive, value } = skill;
		if (isActive) {
			active[id] = value;
		}
	}
	return active;
}

export function getCantripsForSave(state: DependentInstancesState) {
	return (getAllByCategory(state, CANTRIPS) as CantripInstance[]).reduce<string[]>((arr, e) => {
		if (e.active) {
			return [...arr, e.id];
		}
		return arr;
	}, []);
}

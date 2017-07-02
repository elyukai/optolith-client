import { COMBAT_TECHNIQUES } from '../constants/Categories';
import { DependentInstancesState, getAllByCategory } from '../reducers/dependentInstances';
import { CombatTechniqueInstance } from '../types/data.d';

export function getForSave(state: DependentInstancesState) {
	const active: { [id: string]: number } = {};
	for (const skill of getAllByCategory(state, COMBAT_TECHNIQUES) as CombatTechniqueInstance[]) {
		const { id, value } = skill;
		if (value > 6) {
			active[id] = value;
		}
	}
	return active;
}

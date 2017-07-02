import { TALENTS } from '../constants/Categories';
import { DependentInstancesState, getAllByCategory } from '../reducers/dependentInstances';
import { TalentInstance } from '../types/data.d';

export function getForSave(state: DependentInstancesState) {
	const active: { [id: string]: number } = {};
	for (const skill of getAllByCategory(state, TALENTS) as TalentInstance[]) {
		const { id, value } = skill;
		if (value > 0) {
			active[id] = value;
		}
	}
	return active;
}

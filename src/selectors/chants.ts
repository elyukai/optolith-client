import { BLESSINGS, LITURGIES } from '../constants/Categories';
import { DependentInstancesState, getAllByCategory } from '../reducers/dependentInstances';
import { BlessingInstance, LiturgyInstance } from '../types/data.d';

export function getForSave(state: DependentInstancesState) {
	const active: { [id: string]: number } = {};
	for (const skill of getAllByCategory(state, LITURGIES) as LiturgyInstance[]) {
		const { id, active: isActive, value } = skill;
		if (isActive) {
			active[id] = value;
		}
	}
	return active;
}

export function getBlessingsForSave(state: DependentInstancesState) {
	return (getAllByCategory(state, BLESSINGS) as BlessingInstance[]).reduce<string[]>((arr, e) => {
		if (e.active) {
			return [...arr, e.id];
		}
		return arr;
	}, []);
}

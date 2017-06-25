import { DependentInstancesState, get } from '../reducers/dependentInstances';
import { ProfessionInstance, ProfessionVariantInstance } from '../types/data.d';

export function getDiffCost(state: DependentInstancesState, id?: string) {
	return id ? (get(state, id) as ProfessionInstance | ProfessionVariantInstance).ap : 0;
}

import { isEqual } from 'lodash';
import { AbilityInstance } from '../types/data.d';

function addDependencyToArray<T>(array: T[], add: T): T[] {
	return [ ...array, add ];
}

function removeDependencyFromArray<T>(array: T[], index: number): T[] {
	array.splice(index, 1);
	return [ ...array ];
}

export function addDependency(obj: AbilityInstance, add: any): AbilityInstance {
	return {
		...obj,
		dependencies: addDependencyToArray(obj.dependencies, add),
	};
}

export function removeDependency<D>(obj: AbilityInstance, remove: D): AbilityInstance {
	let index;
	if (typeof remove === 'object') {
		index = (obj.dependencies as D[]).findIndex(e => isEqual(remove, e));
	}
	else {
		index = (obj.dependencies as D[]).findIndex(e => e === remove);
	}
	if (index > -1) {
		return {
			...obj,
			dependencies: removeDependencyFromArray(obj.dependencies as D[], index),
		} as AbilityInstance;
	}
	else {
		return obj;
	}
}

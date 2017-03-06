interface Dependent<T> {
	dependencies: T[];
}

const addDependencyToArray = <T>(array: T[], add: T): T[] => [ ...array, add ];
const removeDependencyFromArray = <T>(array: T[], index: number): T[] => {
	array.splice(index, 1);
	return [ ...array ];
};

export const addDependency = <D extends AllDependency, T extends Dependent<D>>(obj: T, add: AllDependency): T => ({
	...obj,
	dependencies: addDependencyToArray(obj.dependencies, add),
});

export const removeDependency = <D extends AllDependency, T extends Dependent<D>>(obj: T, add: AllDependency): T => {
	let index;
	if (typeof add === 'object') {
		index = obj.dependencies.findIndex((e: DependencyObject) => {
			const removeKeys = Object.keys(add);
			const existingKeys = Object.keys(e);
			return removeKeys.length === existingKeys.length && removeKeys.every((key: keyof typeof add) => add[key] === e[key]);
		});
	}
	else {
		index = obj.dependencies.findIndex(e => e === add);
	}
	if (index > -1) {
		return {
			...obj,
			dependencies: removeDependencyFromArray(obj.dependencies, index),
		};
	}
	else {
		return obj;
	}
};

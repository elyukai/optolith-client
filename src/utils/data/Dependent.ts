import Core, { CoreArguments, CoreInstance } from './Core';

export interface DependentInstance extends CoreInstance {
	dependencies: (string | number | boolean)[];
	addDependency(dependency: string | number | boolean);
	removeDependency(dependency: string | number | boolean): boolean;
}

export interface DependentArguments extends CoreArguments {}

export default class Dependent extends Core implements DependentInstance {

	dependencies: (string | number | boolean)[] = [];

	constructor(args: DependentArguments) {
		super(args);
	}

	addDependency(obj: string | number | boolean) {
		this.dependencies.push(obj);
	}

	removeDependency(obj: string | number | boolean): boolean {
		return this.dependencies.some((e, i) => {
			if (e === obj) {
				this.dependencies.splice(i, 1);
				return true;
			}
			return false;
		});
	}
}

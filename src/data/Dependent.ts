import Core from './Core';

export default class Dependent extends Core {
	dependencies: (string | number | boolean)[] = [];

	constructor(args: { id: string; name: string; }) {
		super(args);
	}

	addDependency(obj: string | number | boolean): void {
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

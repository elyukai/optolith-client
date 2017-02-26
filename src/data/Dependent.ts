import Core from './Core';

export default class Dependent extends Core {
	dependencies: (number | boolean | DependencyObject)[] = [];

	constructor(args: { id: string; name: string; }) {
		super(args);
	}

	addDependency(obj: number | boolean | DependencyObject) {
		this.dependencies.push(obj);
	}

	removeDependency(obj: number | boolean | DependencyObject): boolean {
		if (typeof obj === 'object') {
			const index = this.dependencies.findIndex((e: DependencyObject) => {
				const removeKeys = Object.keys(obj);
				const existingKeys = Object.keys(e);
				return removeKeys.length === existingKeys.length && removeKeys.every((key: keyof typeof obj) => obj[key] === e[key]);
			});
			if (index) {
				this.dependencies.splice(index, 1);
				return true;
			}
			else {
				return false;
			}
		}
		return this.dependencies.some((e, i) => {
			if (e === obj) {
				this.dependencies.splice(i, 1);
				return true;
			}
			return false;
		});
	}
}

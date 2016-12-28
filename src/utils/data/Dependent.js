import Core from './Core';

export default class Dependent extends Core {
	
	constructor(args) {
		super(args);
		this.dependencies = [];
	}

	addDependency(obj) {
		this.dependencies.push(obj);
	}

	removeDependency(obj) {
		return this.dependencies.some((e, i) => {
			if (e === obj) {
				this.dependencies.splice(i, 1);
				return true;
			}
			return false;
		});
	}
}

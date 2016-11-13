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
		let index = this.dependencies.indexOf(obj);
		if (index > -1) {
			this.dependencies.splice(index, 1);
			return true;
		}
		return false;
	}
}

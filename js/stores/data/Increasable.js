import Dependent from './Dependent';

export default class Increasable extends Dependent {
	constructor(args) {
		super(args);
		this.value = 0;
	}

	set(value) {
		this.value = value;
	}

	add(value) {
		this.value += value;
	}

	remove(value) {
		this.value -= value;
	}

	addPoint() {
		this.value += 1;
	}

	removePoint() {
		this.value -= 1;
	}
}

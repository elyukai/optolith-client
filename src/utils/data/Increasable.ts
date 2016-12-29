import Dependent, { DependentArguments, DependentInstance } from './Dependent';

export interface IncreasableInstance extends DependentInstance {
	value: number;
	set(value: number);
	add(value: number);
	remove(value: number);
	addPoint();
	removePoint();
}

export interface IncreasableArguments extends DependentArguments {
	value: number;
}

export default class Increasable extends Dependent implements IncreasableInstance {

	value: number;
	
	constructor({ value = 0, ...args }: IncreasableArguments) {
		super(args);
		this.value = value;
	}

	set(value: number) {
		this.value = value;
	}

	add(value: number) {
		this.value += value;
	}

	remove(value: number) {
		this.value -= value;
	}

	addPoint() {
		this.value += 1;
	}

	removePoint() {
		this.value -= 1;
	}
}

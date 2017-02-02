import Dependent from './Dependent';

export default class Increasable extends Dependent {
	value: number;

	constructor({ value = 0, ...args }: { value?: number; id: string; name: string; }) {
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

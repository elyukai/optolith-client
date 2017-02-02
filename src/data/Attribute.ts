import Increasable from './Increasable';
import AttributeStore from '../stores/AttributeStore';
import ELStore from '../stores/ELStore';
import PhaseStore from '../stores/PhaseStore';
import * as Categories from '../constants/Categories';

export default class Attribute extends Increasable {
	short: string;
	value: number = 8;
	mod: number = 0;
	readonly ic: number = 5;
	readonly category: string = Categories.ATTRIBUTES;
	dependencies: number[];

	constructor({ short, ...args }: RawAttribute) {
		super(args);
		this.short = short;
	}

	get isIncreasable(): boolean {
		if (PhaseStore.get() < 3) {
			const max = AttributeStore.getSum() >= ELStore.getStart().maxTotalAttributeValues ? 0 : ELStore.getStart().maxAttributeValue + this.mod;
			return this.value < max;
		} else {
			return true;
		}
	}

	get isDecreasable(): boolean {
		return this.value > Math.max(8, ...(this.dependencies));
	}

	reset() {
		this.dependencies = [];
		this.value = 8;
		this.mod = 0;
	}
}

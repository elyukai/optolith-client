import Increasable, { IncreasableArguments, IncreasableInstance } from './Increasable';
import AttributeStore from '../../stores/AttributeStore';
import ELStore from '../../stores/ELStore';
import PhaseStore from '../../stores/PhaseStore';
import Categories from '../../constants/Categories';

export interface AttributeInstance extends IncreasableInstance {
	short: string;
	value: number;
	mod: number;
	readonly ic: number;
	readonly category: string;
	dependencies: number[];
	isIncreasable: boolean;
	isDecreasable: boolean;
	reset();
}

export interface AttributeArguments extends IncreasableArguments {
	short: string;
}

export default class Attribute extends Increasable implements AttributeInstance {

	short: string;
	value: number = 8;
	mod: number = 0;
	readonly ic: number = 5;
	readonly category: string = Categories.ATTRIBUTES;
	dependencies: number[];
	
	constructor({ short, ...args }: AttributeArguments) {
		super(args);
		this.short = short;
	}

	get isIncreasable(): boolean {
		if (PhaseStore.get() < 3) {
			let max = AttributeStore.getSum() >= ELStore.getStart().max_attrsum ? 0 : ELStore.getStart().max_attr + this.mod;
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

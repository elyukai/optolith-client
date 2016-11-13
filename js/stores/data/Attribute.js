import Increasable from './Increasable';
import AttributeStore from '../AttributeStore';
import ELStore from '../ELStore';
import PhaseStore from '../PhaseStore';
import Categories from '../../constants/Categories';

export default class Attribute extends Increasable {
	constructor(args) {
		super(args);
		let { short } = args;
		this.short = short;

		this.value = 8;
		this.mod = 0;
		this.ic = 5;
		this.category = Categories.ATTRIBUTES;
	}

	get isIncreasable() {
		if (PhaseStore.get() < 3) {
			let max = AttributeStore.getSum() >= ELStore.getStart().max_attrsum ? 0 : ELStore.getStart().max_attr + this.mod;
			return this.value < max;
		} else {
			return true;
		}
	}

	get isDecreasable() {
		return this.value > Math.max(8, ...(this.dependencies));
	}
}

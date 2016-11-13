import Skill from './Skill';
import ELStore from '../ELStore';
import { get } from '../ListStore';
import PhaseStore from '../PhaseStore';
import SpellsStore from '../SpellsStore';
import Categories from '../../constants/Categories';

export default class Spell extends Skill {
	constructor(args) {
		super(args);
		let { trad, merk } = args;
		this.check = this.check.map((e,i) => i < 3 ? `ATTR_${e}` : e);
		this.tradition = trad;
		this.property = merk;

		this.active = false;
		this.category = Categories.SPELLS;
	}

	get isOwnTradition() {
		return this.tradition.some(e => e === 1 || e === get('SA_86').sid + 1);
	}

	get isIncreasable() {
		let max = 0;
		let bonus = get('ADV_16').active.filter(e => e === this.id).length;
		
		if (PhaseStore.get() < 3) {
			max = ELStore.getStart().max_skill;
		} else {
			let checkValues = this.check.map(attr => get(attr).value);
			max = Math.max(...checkValues) + 2;
		}

		if (get('SA_88').active.indexOf(this.property) === -1) {
			max = Math.min(14, max);
		}

		return this.value < max + bonus;
	}

	get isDecreasable() {
		if (get('SA_88').active.indexOf(this.property) > -1) {
			const counter = SpellsStore.getPropertyCounter();

			return !(counter.get(this.property) <= 3 && this.value <= 10 && this.gr !== 5);
		}
	}
}

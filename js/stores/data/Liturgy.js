import Skill from './Skill';
import ELStore from '../ELStore';
import { get } from '../ListStore';
import LiturgiesStore from '../LiturgiesStore';
import PhaseStore from '../PhaseStore';
import Categories from '../../constants/Categories';

export default class Spell extends Skill {
	constructor(args) {
		super(args);
		let { trad, aspc } = args;
		this.check = this.check.map((e,i) => i < 3 ? `ATTR_${e}` : e);
		this.tradition = trad;
		this.aspect = aspc;

		this.active = false;
		this.category = Categories.CHANTS;
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

		if (get('SA_103').active.indexOf(this.aspect) === -1) {
			max = Math.min(14, max);
		}

		return this.value < max + bonus;
	}

	get isDecreasable() {
		if (get('SA_103').active.indexOf(this.aspect) > -1) {
			const counter = LiturgiesStore.getAspectCounter();

			return !(counter.get(this.aspect) <= 3 && this.value <= 10 && this.gr !== 5);
		}
		return true;
	}
}

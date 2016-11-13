import Skill from './Skill';
import CultureStore from '../CultureStore';
import ELStore from '../ELStore';
import { get } from '../ListStore';
import PhaseStore from '../PhaseStore';
import Categories from '../../constants/Categories';

export default class Talent extends Skill {
	constructor(args) {
		super(args);
		let { enc, spec, spec_input } = args;
		this.enc = enc;
		this.spec = spec;
		this.spec_input = spec_input;

		this.category = Categories.TALENTS;
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

		return this.value < max + bonus;
	}

	get isDecreasable() {
		var SA_18_REQ = get('SA_18').active && get('TAL_51').value + get('TAL_55').value < 12;

		return (['TAL_51','TAL_55'].indexOf(this.id) > -1 && SA_18_REQ) || this.value > Math.max(0, ...(this.dependencies));
	}

	get isTyp() {
		const culture = CultureStore.getCurrent();
		return culture.typ_talents.indexOf(this.id) > -1;
	}

	get isUntyp() {
		const culture = CultureStore.getCurrent();
		return culture.untyp_talents.indexOf(this.id) > -1;
	}
}

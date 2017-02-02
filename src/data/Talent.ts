import Skill from './Skill';
import CultureStore from '../stores/CultureStore';
import ELStore from '../stores/ELStore';
import { get } from '../stores/ListStore';
import PhaseStore from '../stores/PhaseStore';
import * as Categories from '../constants/Categories';

export default class Talent extends Skill {
	check: string[];
	enc: string;
	spec: string[];
	specInput: string | null;
	readonly category: string = Categories.TALENTS;
	dependencies: number[];

	constructor({ check, be, spec, spec_input, ...args }: RawTalent) {
		super(args);
		this.check = check;
		this.enc = be;
		this.spec = spec;
		this.specInput = spec_input;
	}

	get isIncreasable(): boolean {
		let max = 0;
		const bonus = (get('ADV_16') as Advantage).active.filter(e => e === this.id).length;

		if (PhaseStore.get() < 3) {
			max = ELStore.getStart().maxSkillRating;
		} else {
			const checkValues = this.check.map(attr => (get(attr) as Attribute).value);
			max = Math.max(...checkValues) + 2;
		}

		return this.value < max + bonus;
	}

	get isDecreasable(): boolean {
		const SA_18_REQ = (get('SA_18') as SpecialAbility).active && (get('TAL_51') as Talent).value + (get('TAL_55') as Talent).value < 12;

		return (['TAL_51','TAL_55'].includes(this.id) && SA_18_REQ) || this.value > Math.max(0, ...(this.dependencies));
	}

	get isTyp(): boolean {
		const culture = CultureStore.getCurrent();
		return culture.typ_talents.includes(this.id);
	}

	get isUntyp(): boolean {
		const culture = CultureStore.getCurrent();
		return culture.untyp_talents.includes(this.id);
	}

	reset() {
		this.dependencies = [];
		this.value = 0;
	}
}

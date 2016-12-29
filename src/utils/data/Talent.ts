import Skill, { SkillArguments, SkillInstance } from './Skill';
import CultureStore from '../../stores/CultureStore';
import ELStore from '../../stores/ELStore';
import { get } from '../../stores/ListStore';
import PhaseStore from '../../stores/PhaseStore';
import Categories from '../../constants/Categories';

export interface TalentInstance extends SkillInstance {
	check: string[];
	enc: string;
	spec: string[];
	spec_input: string | null;
	readonly category: string;
	dependencies: number[];
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	readonly isTyp: boolean;
	readonly isUntyp: boolean;
	reset();
}

export interface TalentArguments extends SkillArguments {
	check: string[];
	be: string;
	spec: string[];
	spec_input: string | null;
}

export default class Talent extends Skill implements TalentInstance {

	check: string[];
	enc: string;
	spec: string[];
	spec_input: string | null;
	readonly category: string = Categories.TALENTS;
	dependencies: number[];
	
	constructor({ check, be, spec, spec_input, ...args }: TalentArguments) {
		super(args);
		this.check = check;
		this.enc = be;
		this.spec = spec;
		this.spec_input = spec_input;
	}

	get isIncreasable(): boolean {
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

	get isDecreasable(): boolean {
		var SA_18_REQ = get('SA_18').active && get('TAL_51').value + get('TAL_55').value < 12;

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

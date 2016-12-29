import Skill, { SkillArguments, SkillInstance } from './Skill';
import ELStore from '../../stores/ELStore';
import { get } from '../../stores/ListStore';
import PhaseStore from '../../stores/PhaseStore';
import SpellsStore from '../../stores/SpellsStore';
import Categories from '../../constants/Categories';

export interface SpellInstance extends SkillInstance {
	readonly check: string[];
	readonly tradition: number[];
	readonly property: number[];
	active: boolean;
	readonly category: string;
	readonly isOwnTradition: boolean;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	reset();
}

export interface SpellArguments extends SkillArguments {
	check: (string | number)[];
	trad: number[];
	merk: number[];
}

export default class Spell extends Skill implements SpellInstance {

	readonly check: string[];
	readonly tradition: number[];
	readonly property: number[];
	active: boolean = false;
	readonly category: string = Categories.SPELLS;
	
	constructor({ check, trad, merk, ...args }: SpellArguments) {
		super(args);
		this.check = check.map((e,i) => typeof e === 'number' ? `ATTR_${e}` : e);
		this.tradition = trad;
		this.property = merk;
	}

	get isOwnTradition(): boolean {
		return this.tradition.some(e => e === 1 || e === get('SA_86').sid + 1);
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

		if (!get('SA_88').active.includes(this.property)) {
			max = Math.min(14, max);
		}

		return this.value < max + bonus;
	}

	get isDecreasable(): boolean {
		if (get('SA_88').active.includes(this.property)) {
			const counter = SpellsStore.getPropertyCounter();

			return !(counter.get(this.property) <= 3 && this.value <= 10 && this.gr !== 5);
		}
		return true;
	}

	reset() {
		this.dependencies = [];
		this.active = false;
		this.value = 0;
	}
}

import Skill from './Skill';
import ELStore from '../stores/ELStore';
import { get } from '../stores/ListStore';
import PhaseStore from '../stores/PhaseStore';
import SpellsStore from '../stores/SpellsStore';
import * as Categories from '../constants/Categories';

export default class Spell extends Skill implements SpellInstance {

	readonly check: string[];
	readonly tradition: number[];
	readonly property: number;
	active: boolean = false;
	readonly category = Categories.SPELLS;

	constructor({ check, trad, merk, ...args }: RawSpell) {
		super(args);
		this.check = check.map(e => typeof e === 'number' ? `ATTR_${e}` : e);
		this.tradition = trad;
		this.property = merk;
	}

	get isOwnTradition(): boolean {
		return this.tradition.some(e => e === 1 || e === (get('SA_86') as SpecialAbilityInstance).sid[0] as number + 1);
	}

	get isIncreasable(): boolean {
		let max = 0;
		const bonus = (get('ADV_16') as AdvantageInstance).active.filter(e => e === this.id).length;

		if (PhaseStore.get() < 3) {
			max = ELStore.getStart().maxSkillRating;
		} else {
			const checkValues = this.check.map((attr, i) => i > 2 ? 0 : (get(attr) as AttributeInstance).value);
			max = Math.max(...checkValues) + 2;
		}

		if (!(get('SA_88') as SpecialAbilityInstance).active.includes(this.property)) {
			max = Math.min(14, max);
		}

		return this.value < max + bonus;
	}

	get isDecreasable(): boolean {
		if ((get('SA_88') as SpecialAbilityInstance).active.includes(this.property)) {
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

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
		switch (this.id) {
			case 'SPELL_28': {
				const SPELL_48 = get('SPELL_48') as SpellInstance;
				if (SPELL_48.active) {
					return this.value > 10;
				}
				break;
			}
			case 'SPELL_48': {
				const SPELL_47 = get('SPELL_47') as SpellInstance;
				if (SPELL_47.active) {
					return this.value > 12;
				}
				break;
			}
			case 'SPELL_22': {
				const SPELL_50 = get('SPELL_50') as SpellInstance;
				if (SPELL_50.active) {
					return this.value > 10;
				}
				break;
			}
			case 'SPELL_50': {
				const SPELL_49 = get('SPELL_49') as SpellInstance;
				if (SPELL_49.active) {
					return this.value > 12;
				}
				break;
			}
		}
		if ((get('SA_88') as SpecialAbilityInstance).active.includes(this.property)) {
			const counter = SpellsStore.getPropertyCounter();

			return !(counter.get(this.property) <= 3 && this.value <= 10 && this.gr !== 5);
		}
		return true;
	}

	get isActivatable(): boolean {
		switch (this.id) {
			case 'SPELL_48': {
				const SPELL_28 = get('SPELL_28') as SpellInstance;
				return SPELL_28.active && SPELL_28.value >= 10;
			}
			case 'SPELL_47': {
				const SPELL_48 = get('SPELL_48') as SpellInstance;
				return SPELL_48.active && SPELL_48.value >= 12;
			}
			case 'SPELL_50': {
				const SPELL_22 = get('SPELL_22') as SpellInstance;
				return SPELL_22.active && SPELL_22.value >= 10;
			}
			case 'SPELL_49': {
				const SPELL_50 = get('SPELL_50') as SpellInstance;
				return SPELL_50.active && SPELL_50.value >= 12;
			}
		}
		return true;
	}

	reset() {
		this.dependencies = [];
		this.active = false;
		this.value = 0;
	}
}

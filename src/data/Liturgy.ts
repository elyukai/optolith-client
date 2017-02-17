import Skill from './Skill';
import ELStore from '../stores/ELStore';
import { get } from '../stores/ListStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import PhaseStore from '../stores/PhaseStore';
import * as Categories from '../constants/Categories';

export default class Liturgy extends Skill implements LiturgyInstance {

	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	active: boolean = false;
	readonly category = Categories.LITURGIES;

	constructor({ check, trad, aspc, ...args }: RawLiturgy) {
		super(args);
		this.check = check.map(e => typeof e === 'number' ? `ATTR_${e}` : e);
		this.tradition = trad;
		this.aspect = aspc;
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
			const checkValues = this.check.map(attr => (get(attr) as AttributeInstance).value);
			max = Math.max(...checkValues) + 2;
		}

		if (!(get('SA_103') as SpecialAbilityInstance).active.includes(this.aspect)) {
			max = Math.min(14, max);
		}

		return this.value < max + bonus;
	}

	get isDecreasable(): boolean {
		if ((get('SA_103') as SpecialAbilityInstance).active.includes(this.aspect)) {
			const counter = LiturgiesStore.getAspectCounter();

			return !(counter.get(this.aspect) <= 3 && this.value <= 10 && this.gr !== 5);
		}
		return true;
	}

	reset() {
		this.dependencies = [];
		this.active = false;
		this.value = 0;
	}
}

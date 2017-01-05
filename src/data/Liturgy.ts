import Skill, { SkillArguments, SkillInstance } from './Skill';
import ELStore from '../../stores/ELStore';
import { get } from '../../stores/ListStore';
import LiturgiesStore from '../../stores/LiturgiesStore';
import PhaseStore from '../../stores/PhaseStore';
import Categories from '../../constants/Categories';

export interface LiturgyInstance extends SkillInstance {
	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	active: boolean;
	readonly category: string;
	readonly isOwnTradition: boolean;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	reset();
}

export interface LiturgyArguments extends SkillArguments {
	check: (string | number)[];
	trad: number[];
	aspc: number[];
}

export default class Liturgy extends Skill implements LiturgyInstance {

	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	active: boolean = false;
	readonly category: string = Categories.CHANTS;
	
	constructor({ check, trad, aspc, ...args }: LiturgyArguments) {
		super(args);
		this.check = check.map((e,i) => typeof e === 'number' ? `ATTR_${e}` : e);
		this.tradition = trad;
		this.aspect = aspc;
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

		if (!get('SA_103').active.includes(this.aspect)) {
			max = Math.min(14, max);
		}

		return this.value < max + bonus;
	}

	get isDecreasable(): boolean {
		if (get('SA_103').active.includes(this.aspect)) {
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

import Increasable from './Increasable';
import CombatTechniquesStore from '../stores/CombatTechniquesStore';
import ELStore from '../stores/ELStore';
import { get, getAllByCategoryGroup } from '../stores/ListStore';
import PhaseStore from '../stores/PhaseStore';
import * as Categories from '../constants/Categories';

export default class CombatTechnique extends Increasable implements CombatTechniqueInstance {

	readonly ic: number;
	readonly gr: number;
	readonly primary: string[];
	value: number = 6;
	readonly category = Categories.COMBAT_TECHNIQUES;
	dependencies: number[];

	constructor({ skt, gr, leit, ...args }: RawCombatTechnique) {
		super(args);
		this.ic = skt;
		this.gr = gr;
		this.primary = leit;
	}

	get at(): number {
		let array = this.gr === 2 ? this.primary : ['ATTR_1'];
		let mod = CombatTechniquesStore.getPrimaryAttributeMod(array);
		return this.value + mod;
	}

	get pa(): number | string {
		let mod = CombatTechniquesStore.getPrimaryAttributeMod(this.primary);
		return this.gr === 2 ? '--' : Math.round(this.value / 2) + mod;
	}

	get isIncreasable(): boolean {
		let max = 0;
		const bonus = (get('ADV_17') as AdvantageInstance).sid.includes(this.id) ? 1 : 0;

		if (PhaseStore.get() < 3) {
			max = ELStore.getStart().maxCombatTechniqueRating;
		} else {
			max = CombatTechniquesStore.getMaxPrimaryAttributeValueByID(this.primary) + 2;
		}

		return this.value < max + bonus;
	}

	get isDecreasable(): boolean {
		const SA_19_REQ = (get('SA_19') as SpecialAbilityInstance).active.length > 0 && (getAllByCategoryGroup(this.category, 2) as CombatTechniqueInstance[]).filter(e => e.value >= 10).length === 1;

		return (SA_19_REQ && this.value > 10 && this.gr === 2) || this.value > Math.max(6, ...(this.dependencies));
	}

	reset() {
		this.dependencies = [];
		this.value = 6;
	}
}

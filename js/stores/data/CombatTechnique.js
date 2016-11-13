import Increasable from './Increasable';
import CombatTechniquesStore from '../CombatTechniquesStore';
import ELStore from '../ELStore';
import ListStore, { get } from '../ListStore';
import PhaseStore from '../PhaseStore';
import Categories from '../../constants/Categories';

export default class CombatTechnique extends Increasable {
	constructor(args) {
		super(args);
		let { skt, gr, leit } = args;
		this.ic = skt;
		this.gr = gr;
		this.primary = leit;

		this.value = 6;
		this.category = Categories.COMBAT_TECHNIQUES;
	}

	get at() {
		let array = this.gr === 2 ? this.primary : ['ATTR_1'];
		let mod = CombatTechniquesStore.getPrimaryAttributeMod(array);
		return this.value + mod;
	}

	get pa() {
		let mod = CombatTechniquesStore.getPrimaryAttributeMod(this.primary);
		return this.gr === 2 ? '--' : Math.round(this.value / 2) + mod;
	}

	get isIncreasable() {
		let max = 0;
		let bonus = get('ADV_17').active.indexOf(this.id) > -1 ? 1 : 0;
		
		if (PhaseStore.get() < 3) {
			max = ELStore.getStart().max_combattech;
		} else {
			max = CombatTechniquesStore.getMaxPrimaryAttributeValueByID(this.primary) + 2;
		}

		return this.value < max + bonus;
	}

	get isDecreasable() {
		var SA_19_REQ = get('SA_19').active && ListStore.getAllByCategoryGroup(this.category, 2).filter(e => e.value >= 10).length === 1;

		return (SA_19_REQ && this.value > 10 && this.gr === 2) || this.value > Math.max(6, ...(this.dependencies));
	}
}

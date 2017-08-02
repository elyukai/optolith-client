import { AddArcaneEnergyPointAction, AddAttributePointAction, AddBoughtBackAEPointAction, AddBoughtBackKPPointAction, AddKarmaPointAction, AddLifePointAction, AddLostAEPointAction, AddLostAEPointsAction, AddLostKPPointAction, AddLostKPPointsAction, RemoveAttributePointAction, RemoveBoughtBackAEPointAction, RemoveBoughtBackKPPointAction, RemoveLostAEPointAction, RemoveLostKPPointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { SelectCultureAction } from '../actions/CultureActions';
import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { SelectProfessionAction, SetSelectionsAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { AddAdventurePointsAction } from '../actions/ProfileActions';
import { SelectRaceAction } from '../actions/RaceActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';

import { get } from '../stores/ListStore';
import { AdventurePoints, ProfessionDependencyCost, ProfessionInstance, ProfessionVariantInstance, RaceInstance, Selections, SpecialAbilityInstance } from '../types/data.d';
import { getSelectionItem } from '../utils/ActivatableUtils';
import { CultureStore } from './CultureStore';
import { ELStore } from './ELStore';
import { ListStore } from './ListStore';
import { ProfessionStore } from './ProfessionStore';
import { ProfessionVariantStore } from './ProfessionVariantStore';
import { RaceStore } from './RaceStore';
import { RequirementsStore } from './RequirementsStore';
import { Store } from './Store';

type Action = LoadHeroAction | ActivateSpellAction | ActivateLiturgyAction | DeactivateSpellAction | DeactivateLiturgyAction | AddAttributePointAction | AddTalentPointAction | AddCombatTechniquePointAction | AddSpellPointAction | AddLiturgyPointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | RemoveTalentPointAction | RemoveCombatTechniquePointAction | RemoveSpellPointAction | RemoveLiturgyPointAction | ActivateDisAdvAction | SetDisAdvTierAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | SetSpecialAbilityTierAction | DeactivateSpecialAbilityAction | AddAdventurePointsAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction | SetSelectionsAction | AddBoughtBackAEPointAction | AddBoughtBackKPPointAction | AddLostAEPointsAction | AddLostKPPointsAction | RemoveBoughtBackAEPointAction | RemoveBoughtBackKPPointAction | AddLostAEPointAction | AddLostKPPointAction | RemoveLostAEPointAction | RemoveLostKPPointAction;

class APStoreStatic extends Store {
	private total = 0;
	private spent = 0;
	private spentForAdvantages: [number, number, number] = [0, 0, 0];
	private spentForDisadvantages: [number, number, number] = [0, 0, 0];
	readonly dispatchToken: string;

	getAll() {
		return {
			adv: this.spentForAdvantages,
			disadv: this.spentForDisadvantages,
			spent: this.spent,
			total: this.total,
		};
	}

	getTotal() {
		return this.total;
	}

	getSpent() {
		return this.spent;
	}

	getAvailable() {
		return this.total - this.spent;
	}

	getForDisAdv() {
		return {
			adv: this.spentForAdvantages,
			disadv: this.spentForDisadvantages,
		};
	}

	private spend(cost: number) {
		this.spent += cost;
	}

	private spendDisadv(id: string, cost: number, [ add, index ]: [boolean, 0 | 1 | 2]) {
		const target = () => add ? this.spentForAdvantages : this.spentForDisadvantages;
		const absCost = add ? cost : -cost;
		target()[0] += absCost;
		if (index > 0) {
			target()[index] += absCost;
		}
		if (['DISADV_17', 'DISADV_18'].includes(id)) {
			cost += add ? 10 : -10;
		}
		this.spent += cost;
	}

	private calculateRCPDiff(current: number = 0, next: number = 0) {
		this.spend(next - current);
	}

	private clear() {
		this.total = 0;
		this.spent = 0;
		this.spentForAdvantages = [ 0, 0, 0 ];
		this.spentForDisadvantages = [ 0, 0, 0 ];
	}

	private updateAll(obj: AdventurePoints) {
		this.total = obj.total;
		this.spent = obj.spent;
		this.spentForAdvantages = [ ...obj.adv ] as [number, number, number];
		this.spentForDisadvantages = [ ...obj.disadv ] as [number, number, number];
	}

	private assignRCP(selections: Selections) {
		if (selections.useCulturePackage === true) {
			this.spent += CultureStore.getCurrent()!.ap;
		}

		if (selections.buyLiteracy) {
			const culture = CultureStore.getCurrent();
			const id = culture!.scripts.length > 1 ? selections.litc : culture!.scripts[0];
			const selectionItem = getSelectionItem(get('SA_28') as SpecialAbilityInstance, id);
			this.spent += selectionItem && selectionItem.cost || 0;
		}

		const race = RaceStore.getCurrent();
		this.spentForAdvantages = race!.automaticAdvantagesCost;

		const p = ProfessionStore.getCurrent();
		if (p && p.id !== 'P_0') {
			const reducer = (a: ProfessionDependencyCost, b: number | ProfessionDependencyCost): ProfessionDependencyCost => {
				if (typeof b === 'number') {
					a.total += b;
				}
				else {
					a.total += b.total;
					a.adv = a.adv.map((e, i) => e + b.adv[i]) as [number, number, number];
					a.disadv = a.disadv.map((e, i) => e + b.disadv[i]) as [number, number, number];
				}
				return a;
			};

			const initialValue: ProfessionDependencyCost = {
				adv: [0, 0, 0],
				disadv: [0, 0, 0],
				total: 0,
			};

			const requires = [ ...p.requires ];
			const pv = ProfessionVariantStore.getCurrent();

			if (pv) {
				requires.push(...pv.requires);
			}

			const apCostsList = ListStore.getCostListForProfessionDependencies(p.requires);
			const apCosts = apCostsList.reduce<ProfessionDependencyCost>(reducer, initialValue);
			const spareAP = ListStore.getSpareAPForCombatTechniques();

			this.spent += apCosts.total - spareAP;
			this.spentForAdvantages = this.spentForAdvantages.map((e, i) => e + apCosts.adv[i]) as [number, number, number];
			this.spentForDisadvantages = apCosts.disadv;
		}
	}
}

export const APStore: APStoreStatic = new APStoreStatic();

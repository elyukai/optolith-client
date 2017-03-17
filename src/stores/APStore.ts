/// <reference path="../index.d.ts" />

import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { get } from '../stores/ListStore';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import ListStore from './ListStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | ActivateSpellAction | ActivateLiturgyAction | DeactivateSpellAction | DeactivateLiturgyAction | AddAttributePointAction | AddTalentPointAction | AddCombatTechniquePointAction | AddSpellPointAction | AddLiturgyPointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | RemoveTalentPointAction | RemoveCombatTechniquePointAction | RemoveSpellPointAction | RemoveLiturgyPointAction | ActivateDisAdvAction | SetDisAdvTierAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | SetSpecialAbilityTierAction | DeactivateSpecialAbilityAction | AddAdventurePointsAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction | SetSelectionsAction | RemoveRedeemedAEPointAction | RemoveRedeemedKPPointAction | RedeemAEPointAction | RedeemKPPointAction;

class APStoreStatic extends Store {
	private total = 0;
	private spent = 0;
	private spentForAdvantages: [number, number, number] = [0, 0, 0];
	private spentForDisadvantages: [number, number, number] = [0, 0, 0];
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ADD_ADVENTURE_POINTS:
						this.total -= action.payload.amount;
						break;

					default:
						this.spend(RequirementsStore.getCurrentCost());
						break;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_HERO_DATA:
						this.updateAll(action.payload.data.ap);
						break;

					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.ACTIVATE_LITURGY:
					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_LITURGY:
					case ActionTypes.ADD_ATTRIBUTE_POINT:
					case ActionTypes.ADD_TALENT_POINT:
					case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
					case ActionTypes.ADD_SPELL_POINT:
					case ActionTypes.ADD_LITURGY_POINT:
					case ActionTypes.ADD_ARCANE_ENERGY_POINT:
					case ActionTypes.ADD_KARMA_POINT:
					case ActionTypes.ADD_LIFE_POINT:
					case ActionTypes.REMOVE_ATTRIBUTE_POINT:
					case ActionTypes.REMOVE_TALENT_POINT:
					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
					case ActionTypes.REMOVE_SPELL_POINT:
					case ActionTypes.REMOVE_LITURGY_POINT:
					case ActionTypes.REDEEM_AE_POINT:
					case ActionTypes.REDEEM_KP_POINT:
					case ActionTypes.REMOVE_REDEEMED_AE_POINT:
					case ActionTypes.REMOVE_REDEEMED_KP_POINT:
						if (RequirementsStore.isValid()) {
							this.spend(RequirementsStore.getCurrentCost());
						}
						break;

					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.SET_DISADV_TIER:
					case ActionTypes.DEACTIVATE_DISADV:
						if (RequirementsStore.isValid()) {
							this.spendDisadv(action.payload.id, RequirementsStore.getCurrentCost(), RequirementsStore.getDisAdvDetails());
						}
						break;

					case ActionTypes.ACTIVATE_SPECIALABILITY:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						if (RequirementsStore.isValid()) {
							this.spend(RequirementsStore.getCurrentCost());
						}
						break;

					case ActionTypes.DEACTIVATE_SPECIALABILITY:
						if (RequirementsStore.isValid()) {
							this.spend(RequirementsStore.getCurrentCost());
						}
						break;

					case ActionTypes.ADD_ADVENTURE_POINTS:
						this.total += action.payload.amount;
						break;

					case ActionTypes.SELECT_RACE: {
						const race = RaceStore.getCurrent();
						const culture = CultureStore.getCurrent();
						const profession = ProfessionStore.getCurrent();
						const professionVariant = ProfessionVariantStore.getCurrent();
						this.calculateRCPDiff(race ? race.ap : 0, (get(action.payload.id) as RaceInstance).ap);
						this.calculateRCPDiff(culture ? culture.ap : 0, 0);
						this.calculateRCPDiff(profession ? profession.ap : 0, 0);
						if (professionVariant) {
							this.calculateRCPDiff(professionVariant.ap, 0);
						}
						break;
					}

					case ActionTypes.SELECT_CULTURE: {
						const culture = CultureStore.getCurrent();
						const profession = ProfessionStore.getCurrent();
						const professionVariant = ProfessionVariantStore.getCurrent();
						this.calculateRCPDiff(culture ? culture.ap : 0, (get(action.payload.id) as CultureInstance).ap);
						this.calculateRCPDiff(profession ? profession.ap : 0, 0);
						if (professionVariant) {
							this.calculateRCPDiff(professionVariant.ap, 0);
						}
						break;
					}

					case ActionTypes.SELECT_PROFESSION: {
						const profession = ProfessionStore.getCurrent();
						const professionVariant = ProfessionVariantStore.getCurrent();
						this.calculateRCPDiff(profession ? profession.ap : 0, (get(action.payload.id) as ProfessionInstance).ap);
						if (professionVariant) {
							this.calculateRCPDiff(professionVariant.ap, 0);
						}
						break;
					}

					case ActionTypes.SELECT_PROFESSION_VARIANT: {
						const professionVariant = ProfessionVariantStore.getCurrent();
						const professionVariantNext = get(action.payload.id!) as ProfessionVariantInstance | undefined;
						this.calculateRCPDiff(professionVariant ? professionVariant.ap : 0, professionVariantNext ? professionVariantNext.ap : 0);
						break;
					}

					case ActionTypes.ASSIGN_RCP_OPTIONS:
						this.assignRCP(action.payload);
						break;

					case ActionTypes.CREATE_HERO:
						this.clear();
						AppDispatcher.waitFor([ELStore.dispatchToken]);
						this.total = ELStore.getStart().ap;
						break;

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

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
		this.spentForAdvantages = obj.adv;
		this.spentForDisadvantages = obj.disadv;
	}

	private assignRCP(selections: Selections) {
		if (!selections.useCulturePackage) {
			this.spent -= CultureStore.getCurrent()!.ap;
		}

		if (selections.buyLiteracy) {
			const culture = CultureStore.getCurrent();
			const id = culture!.scripts.length > 1 ? selections.litc : culture!.scripts[0];
			this.spent += (get('SA_28') as SpecialAbilityInstance).sel[id - 1].cost!;
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
					a.adv = a.adv.map((e, i) => e + b.adv[i]);
					a.disadv = a.disadv.map((e, i) => e + b.disadv[i]);
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

			this.spent += apCosts.total;
			this.spent -= spareAP;
			this.spentForAdvantages = this.spentForAdvantages.map((e, i) => e + apCosts.adv[i]);
			this.spentForDisadvantages = apCosts.disadv;
		}
	}
}

const APStore: APStoreStatic = new APStoreStatic();

export default APStore;

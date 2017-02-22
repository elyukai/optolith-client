/// <reference path="../index.d.ts" />

import { get } from '../stores/ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import reqPurchase from '../utils/reqPurchase';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | ActivateSpellAction | ActivateLiturgyAction | DeactivateSpellAction | DeactivateLiturgyAction | AddAttributePointAction | AddTalentPointAction | AddCombatTechniquePointAction | AddSpellPointAction | AddLiturgyPointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | RemoveTalentPointAction | RemoveCombatTechniquePointAction | RemoveSpellPointAction | RemoveLiturgyPointAction | ActivateDisAdvAction | SetDisAdvTierAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | SetSpecialAbilityTierAction | DeactivateSpecialAbilityAction | AddAdventurePointsAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction | SetSelectionsAction | RemoveRedeemedAEPointAction | RemoveRedeemedKPPointAction | RedeemAEPointAction | RedeemKPPointAction;

let _total = 0;
let _spent = 0;
let _adv: [number, number, number] = [0, 0, 0];
let _disadv: [number, number, number] = [0, 0, 0];

function _spend(cost: number) {
	_spent += cost;
}

function _spendDisadv(cost: number, [ add, index ]: [boolean, 0 | 1 | 2]) {
	const target = () => add ? _adv : _disadv;
	_spent += cost;
	const absCost = add ? cost : -cost;
	target()[0] += absCost;
	if (index > 0) {
		target()[index] += absCost;
	}
}

function _calculateRCPDiff(current: number = 0, next: number = 0) {
	_spend(next - current);
}

function _clear() {
	_total = 0;
	_spent = 0;
	_adv = [ 0, 0, 0 ];
	_disadv = [ 0, 0, 0 ];
}

function _updateAll(obj: AdventurePoints) {
	_total = obj.total;
	_spent = obj.spent;
	_adv = obj.adv;
	_disadv = obj.disadv;
}

function _assignRCP(selections: Selections) {
	if (!selections.useCulturePackage) {
		_spent -= CultureStore.getCurrent().ap;
	}

	if (selections.buyLiteracy) {
		const culture = CultureStore.getCurrent();
		const id = culture.scripts.length > 1 ? selections.litc : culture.scripts[0];
		_spent += (get('SA_28') as SpecialAbilityInstance).sel[id - 1].cost!;
	}

	const race = RaceStore.getCurrent();
	_adv = race.automaticAdvantagesCost;

	const p = ProfessionStore.getCurrent();
	if (p && p.id !== 'P_0') {
		const apCosts = reqPurchase(p.requires);
		_spent += apCosts;
	}
}

class APStoreStatic extends Store {

	getAll() {
		return {
			total: _total,
			spent: _spent,
			adv: _adv,
			disadv: _disadv,
		};
	}

	getTotal() {
		return _total;
	}

	getSpent() {
		return _spent;
	}

	getAvailable() {
		return _total - _spent;
	}

	getForDisAdv() {
		return {
			adv: _adv,
			disadv: _disadv
		};
	}

}

const APStore: APStoreStatic = new APStoreStatic((action: Action) => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
	if (action.undo) {
		switch (action.type) {
			case ActionTypes.ADD_ADVENTURE_POINTS:
				_total -= action.payload.amount;
				break;

			default:
				_spend(RequirementsStore.getCurrentCost());
				break;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.RECEIVE_HERO_DATA:
				_updateAll(action.payload.data.ap);
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
					_spend(RequirementsStore.getCurrentCost());
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.SET_DISADV_TIER:
			case ActionTypes.DEACTIVATE_DISADV:
				if (RequirementsStore.isValid()) {
					_spendDisadv(RequirementsStore.getCurrentCost(), RequirementsStore.getDisAdvDetails());
				}
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.SET_SPECIALABILITY_TIER:
				if (RequirementsStore.isValid()) {
					_spend(RequirementsStore.getCurrentCost());
				}
				break;

			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					_spend(RequirementsStore.getCurrentCost());
				}
				break;

			case ActionTypes.ADD_ADVENTURE_POINTS:
				_total += action.payload.amount;
				break;

			case ActionTypes.SELECT_RACE: {
				const professionVariant = ProfessionVariantStore.getCurrent();
				_calculateRCPDiff(RaceStore.getCurrent().ap, (get(action.payload.id) as RaceInstance).ap);
				_calculateRCPDiff(CultureStore.getCurrent().ap, 0);
				_calculateRCPDiff(ProfessionStore.getCurrent().ap, 0);
				if (professionVariant) {
					_calculateRCPDiff(professionVariant.ap, 0);
				}
				break;
			}

			case ActionTypes.SELECT_CULTURE: {
				const professionVariant = ProfessionVariantStore.getCurrent();
				_calculateRCPDiff(CultureStore.getCurrent().ap, (get(action.payload.id) as CultureInstance).ap);
				_calculateRCPDiff(ProfessionStore.getCurrent().ap, 0);
				if (professionVariant) {
					_calculateRCPDiff(professionVariant.ap, 0);
				}
				break;
			}

			case ActionTypes.SELECT_PROFESSION: {
				const professionVariant = ProfessionVariantStore.getCurrent();
				_calculateRCPDiff(ProfessionStore.getCurrent().ap, (get(action.payload.id) as ProfessionInstance).ap);
				if (professionVariant) {
					_calculateRCPDiff(professionVariant.ap, 0);
				}
				break;
			}

			case ActionTypes.SELECT_PROFESSION_VARIANT: {
				const professionVariant = ProfessionVariantStore.getCurrent();
				const professionVariantNext = get(action.payload.id!) as ProfessionVariantInstance | undefined;
				_calculateRCPDiff(professionVariant ? professionVariant.ap : 0, professionVariantNext ? professionVariantNext.ap : 0);
				break;
			}

			case ActionTypes.ASSIGN_RCP_OPTIONS:
				_assignRCP(action.payload);
				break;

			case ActionTypes.CREATE_HERO:
				_clear();
				AppDispatcher.waitFor([ELStore.dispatchToken]);
				_total = ELStore.getStart().ap;
				break;

			default:
				return true;
		}
	}

	APStore.emitChange();

	return true;

});

export default APStore;

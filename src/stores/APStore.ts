import { AdventurePoints } from '../index.d';
import { get } from '../stores/ListStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import reqPurchase from '../utils/reqPurchase';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

// AP = Adventure Points

let _total = 0;
let _spent = 0;
let _rcp = [0, 0, 0, 0];
let _adv = [0, 0, 0];
let _disadv = [0, 0, 0];

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

function _calculateRCPDiff(index: number, next: number = 0) {
	let current = _rcp[index] || 0;
	let diff = next - current;
	_spend(diff);
	_rcp[index] = next;
}

function _clear() {
	_total = 0;
	_spent = 0;
	_rcp = [ 0, 0, 0, 0 ];
	_adv = [ 0, 0, 0 ];
	_disadv = [ 0, 0, 0 ];
}

function _updateAll(obj: AdventurePoints) {
	_total = obj.total;
	_spent = obj.spent;
	_rcp = obj.rcp;
	_adv = obj.adv;
	_disadv = obj.disadv;
}

function _assignRCP(selections) {
	if (!selections.useCulturePackage) {
		_spent -= _rcp[1];
	}

	if (selections.buyLiteracy) {
		const culture = CultureStore.getCurrent();
		let id = culture.scripts.length > 1 ? selections.litc : culture.scripts[0];
		_spent += get('SA_28').sel[id - 1][2];
	}

	let p = ProfessionStore.getCurrent();
	if (p && p.id !== 'P_0') {
		let apCosts = reqPurchase(p.reqs);
		_spent += apCosts;
	}
}

class _APStore extends Store {

	getAll() {
		return {
			total: _total,
			spent: _spent,
			rcp: _rcp,
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

const APStore = new _APStore(payload => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken]);

	if (payload.undoAction) {
		switch (payload.type) {
			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				return true;

			case ActionTypes.ADD_ADVENTURE_POINTS:
				_total -= payload.options.value;
				break;

			default:
				_spend(RequirementsStore.getCurrentCost());
				break;
		}
	}
	else {
		switch( payload.type ) {
			case ActionTypes.CLEAR_HERO:
				_clear();
				break;

			case ActionTypes.RECEIVE_HERO:
				_updateAll(payload.ap);
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
			case ActionTypes.ADD_MAX_ENERGY_POINT:
			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					_spend(RequirementsStore.getCurrentCost());
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.UPDATE_DISADV_TIER:
			case ActionTypes.DEACTIVATE_DISADV:
				if (RequirementsStore.isValid()) {
					_spendDisadv(RequirementsStore.getCurrentCost(), RequirementsStore.getDisAdvDetails());
				}
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.UPDATE_SPECIALABILITY_TIER:
				if (RequirementsStore.isValid()) {
					_spend(payload.costs);
				}
				break;

			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					_spend(-(payload.costs));
				}
				break;

			case ActionTypes.ADD_ADVENTURE_POINTS:
				_total += payload.value;
				break;

			case ActionTypes.SELECT_RACE:
				AppDispatcher.waitFor([RaceStore.dispatchToken]);
				_calculateRCPDiff(0, RaceStore.getCurrent().ap);
				_calculateRCPDiff(1, 0);
				_calculateRCPDiff(2, 0);
				_calculateRCPDiff(3, 0);
				break;

			case ActionTypes.SELECT_CULTURE:
				AppDispatcher.waitFor([CultureStore.dispatchToken]);
				_calculateRCPDiff(1, CultureStore.getCurrent().ap);
				_calculateRCPDiff(2, 0);
				_calculateRCPDiff(3, 0);
				break;

			case ActionTypes.SELECT_PROFESSION:
				AppDispatcher.waitFor([ProfessionStore.dispatchToken]);
				_calculateRCPDiff(2, ProfessionStore.getCurrentID() === 'P_0' ? 0 : ProfessionStore.getCurrent().ap);
				_calculateRCPDiff(3, 0);
				break;

			case ActionTypes.SELECT_PROFESSION_VARIANT:
				AppDispatcher.waitFor([ProfessionVariantStore.dispatchToken]);
				if (ProfessionVariantStore.getCurrentID() === null) {
					_calculateRCPDiff(3, 0);
				} else {
					_calculateRCPDiff(3, ProfessionVariantStore.getCurrent().ap);
				}
				break;

			case ActionTypes.ASSIGN_RCP_ENTRIES:
				_assignRCP(payload.selections);
				break;

			case ActionTypes.CREATE_NEW_HERO: {
				_clear();
				AppDispatcher.waitFor([ELStore.dispatchToken]);
				_total = ELStore.getStart().ap;
				break;
			}

			default:
				return true;
		}
	}

	APStore.emitChange();

	return true;

});

export default APStore;

import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import ListStore, { get } from '../stores/ListStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';
import alert from '../utils/alert';
import reqPurchase from '../utils/reqPurchase';

// AP = Adventure Points

var _total = 0;
var _spent = 0;
var _rcp = [0, 0, 0, 0];
var _adv = [0, 0, 0];
var _disadv = [0, 0, 0];

function _spend(value) {
	const valid = _spent + value <= _total;
	if (valid) {
		_spent += value;
	} else {
		alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');		
	}
	return valid;
}

function _spendDisadv(payload) {
	const { id, costs: value } = payload;
	const { category, reqs } = get(id);
	const add = category === Categories.ADVANTAGES;
	const target = () => add ? _adv : _disadv;

	const isKar = reqs.some(e => e[0] === 'ADV_12' && e[1]);
	const isMag = reqs.some(e => e[0] === 'ADV_50' && e[1]);
	const index = isKar ? 2 : isMag ? 1 : 0;

	const subValid = index > 0 ? target[index] + value <= 50 : true;
	const mainValid = target[0] + value <= 80;
	const totalValid = _spent + value <= _total;

	if ([subValid, mainValid, totalValid].every(e => e)) {
		_spent += add ? value : -value;
		target[0] += value;
		if (index > 0) {
			target[index] += value;
		}
	}
	else if (!subValid) {
		const sub = isKar ? 'karmale' : isMag ? 'magische' : '';
		const text = add ? 'Vorteile' : 'Nachteile';
		alert(`Obergrenze für ${sub} ${text} erreicht`, `Du kannst nicht mehr als 50 AP für ${sub} ${text} ausgeben!`);
	}
	else if (!mainValid) {
		const text = add ? 'Vorteile' : 'Nachteile';
		alert(`Obergrenze für ${text} erreicht`, `Du kannst nicht mehr als 80 AP für ${text} ausgeben!`);
	}
	else {
		alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');		
	}
}

function _calculateRCPDiff(index, next) {
	var current = _rcp[index] || 0;
	next = next || 0;
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

function _updateAll(obj) {
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

const APStore = new _APStore();

APStore.dispatchToken = AppDispatcher.register(payload => {

	AppDispatcher.waitFor([RequirementsStore.dispatchToken]);

	if (payload.undoAction) {
		_spend(RequirementsStore.getCurrentCost());
		APStore.emitChange();
		return true;
	}

	switch( payload.actionType ) {

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
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spendDisadv(payload);
			break;

		case ActionTypes.ACTIVATE_SPECIALABILITY:
		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spend(payload.costs);
			break;

		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spend(-(payload.costs));
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

	APStore.emitChange();

	return true;

});

export default APStore;

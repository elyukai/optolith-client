import AppDispatcher from '../dispatcher/AppDispatcher';
import AttributeStore from './AttributeStore';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import { EventEmitter } from 'events';
import ListStore from '../stores/ListStore';
import RaceStore from './RaceStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';
import { getIC } from '../utils/iccalc';
import reactAlert from '../utils/reactAlert';
import reqPurchase from '../utils/reqPurchase';

// AP = Adventure Points

var _max = 0;
var _used = 0;
var _rcp = [0, 0, 0, 0];
var _adv = 0;
var _adv_mag = 0;
var _adv_kar = 0;
var _disadv = 0;
var _disadv_mag = 0;
var _disadv_kar = 0;

function _spend(value) {
	if ((value > 0 && _used + value <= _max) || value < 1) {
		_used += value;
		return true;
	}
	reactAlert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
	return false;
}

function _addAdv(value) {
	if ((value > 0 && _adv + value <= 80) || value < 1) {
		_adv += value;
		return true;
	}
	reactAlert('Obergrenze für Vorteile erreicht', 'Du kannst nicht mehr als 80 AP für Vorteile ausgeben!');
	return false;
}

function _addAdvMag(value) {
	if ((value > 0 && _adv_mag + value <= 50) || value < 1) {
		_adv_mag += value;
		return _addAdv(value);
	}
	return false;
}

function _addAdvKar(value) {
	if ((value > 0 && _adv_kar + value <= 50) || value < 1) {
		_adv_kar += value;
		return _addAdv(value);
	}
	return false;
}

function _addDisadv(value) {
	if ((value > 0 && _disadv + value <= 80) || value < 1) {
		_disadv += value;
		return true;
	}
	reactAlert('Obergrenze für Nachteile erreicht', 'Du kannst nicht mehr als 80 AP durch Nachteile erhalten!');
	return false;
}

function _addDisadvMag(value) {
	if ((value > 0 && _disadv_mag + value <= 50) || value < 1) {
		_disadv_mag += value;
		return _addDisadv(value);
	}
	return false;
}

function _addDisadvKar(value) {
	if ((value > 0 && _disadv_kar + value <= 50) || value < 1) {
		_disadv_kar += value;
		return _addDisadv(value);
	}
	return false;
}

function _spendDisadv(payload) {
	const { id, costs } = payload;
	const { category, req } = ListStore.get(id);
	const add = category === Categories.ADVANTAGES;
	const valid = _spend(add ? costs : -costs);
	if (valid) {
		let type = req.some(e => e[0] === 'ADV_12' && e[1]) ? 'kar' : req.some(e => e[0] === 'ADV_50' && e[1]) ? 'mag' : 'cmn';
		if (add && type === 'cmn') _addAdv(costs);
		else if (add && type === 'kar') _addAdvKar(costs);
		else if (add && type === 'mag') _addAdvMag(costs);
		else if (!add && type === 'cmn') _addDisadv(costs);
		else if (!add && type === 'kar') _addDisadvKar(costs);
		else if (!add && type === 'mag') _addDisadvMag(costs);
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
	_max = 0;
	_used = 0;
	_rcp = [ 0, 0, 0, 0 ];
	_adv = 0;
	_adv_mag = 0;
	_adv_kar = 0;
	_disadv = 0;
	_disadv_mag = 0;
	_disadv_kar = 0;
}

function _updateAll(obj) {
	_max = obj._max;
	_used = obj._used;
	_rcp = obj._rcp;
	_adv = obj._adv;
	_adv_mag = obj._adv_mag;
	_adv_kar = obj._adv_kar;
	_disadv = obj._disadv;
	_disadv_mag = obj._disadv_mag;
	_disadv_kar = obj._disadv_kar;
}

function _assignRCP(selections) {
	if (!selections.useCulturePackage) {
		_used -= _rcp[1];
	}

	if (selections.buyLiteracy) {
		const culture = CultureStore.getCurrent();
		let id = culture.literacy.length > 1 ? selections.litc : culture.literacy[0];
		_used += ListStore.get('SA_28').sel[id - 1][2];
	}

	let p = ProfessionStore.getCurrent();
	if (p) {
		let apCosts = reqPurchase(p.req);
		_used += apCosts;
	}
}

var APStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getForSave: function() {
		return { _max, _used, _rcp, _adv, _adv_mag, _adv_kar, _disadv, _disadv_mag, _disadv_kar };
	},

	getAll: function() {
		return { total: _max, spent: _used };
	},

	get: function() {
		return _max;
	},

	getUsed: function() {
		return _used;
	},

	getUnused: function() {
		return _max - _used;
	},

	getAvailable: function() {
		return _max - _used;
	},

	getForDisAdv: function() {
		return {
			adv: [_adv, _adv_mag, _adv_kar],
			disadv: [_disadv, _disadv_mag, _disadv_kar]
		};
	}

});

APStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CLEAR_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.ap);
			break;

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spend(getIC(ListStore.get(payload.id).skt, 0));
			break;
		
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spend(-getIC(ListStore.get(payload.id).skt, 0));
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
			_spend(-payload.costs);
			break;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spend(getIC(ListStore.get(payload.id).skt, ListStore.get(payload.id).value));
			break;

		case ActionTypes.ADD_MAX_ENERGY_POINT:
			AppDispatcher.waitFor([AttributeStore.dispatchToken]);
			_spend(getIC(4, AttributeStore.getAdd(payload.id)));
			break;

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			_spend(-getIC(ListStore.get(payload.id).skt, ListStore.get(payload.id).value + 1));
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
			_max = ELStore.getStart().ap;
			break;
		}

		default:
			return true;
	}

	APStore.emitChange();

	return true;

});

export default APStore;

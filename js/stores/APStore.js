import AppDispatcher from '../dispatcher/AppDispatcher';
import CultureStore from './rcp/CultureStore';
import ELStore from './ELStore';
import { EventEmitter } from 'events';
import ListStore from '../stores/ListStore';
import RaceStore from './rcp/RaceStore';
import ProfessionStore from './rcp/ProfessionStore';
import ProfessionVariantStore from './rcp/ProfessionVariantStore';
import ActionTypes from '../constants/ActionTypes';
import reactAlert from '../utils/reactAlert';
import reqPurchase from '../utils/reqPurchase';

// AP = Adventure Points

const AKTV = [1, 2, 3, 4];
const SKT = [
	[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
	[2,4,6,8,10,12,14,16,18,20,22,24,26,28],
	[3,6,9,12,15,18,21,24,27,30,33,36,39,42],
	[4,8,12,16,20,24,28,32,36,40,44,48,52,56],
	[15,15,15,30,45,60,75,90,105,120,135,150,165,180]
];

var _max = 1100;
var _used = 224;
var _rcp = [0, 12, 212, 0];
var _adv = 0;
var _adv_mag = 0;
var _adv_kar = 0;
var _disadv = 0;
var _disadv_mag = 0;
var _disadv_kar = 0;

function _addUsed(value) {
	_used += value;
}

function _addAdv(value) {
	_adv += value;
}

function _addAdvMag(value) {
	_addAdv(value);
	_adv_mag += value;
}

function _addAdvKar(value) {
	_addAdv(value);
	_adv_kar += value;
}

function _addDisadv(value) {
	_disadv += value;
}

function _addDisadvMag(value) {
	_addDisadv(value);
	_disadv_mag += value;
}

function _addDisadvKar(value) {
	_addDisadv(value);
	_disadv_kar += value;
}

function _addAdvDisadv(payload) {
	var disadv = ListStore.get(payload.id);
	var adv = disadv.category === 'adv';
	var type = 'cmn'; // common
	for (let i = 0; i < disadv.req.length; i++) {
		if (disadv.req[i][0] === 'ADV_50' && disadv.req[i][1] === true) type = 'mag';
		else if (disadv.req[i][0] === 'ADV_12' && disadv.req[i][1] === true) type = 'kar';
	}
	_addUsed(payload.costs);
	if (adv && type === 'cmn') _addAdv(payload.costs);
	else if (adv && type === 'mag') _addAdvMag(payload.costs);
	else if (adv && type === 'kar') _addAdvKar(payload.costs);
	else if (!adv && type === 'cmn') _addDisadv(-payload.costs);
	else if (!adv && type === 'mag') _addDisadvMag(-payload.costs);
	else if (!adv && type === 'kar') _addDisadvKar(-payload.costs);
}

function _calculateRCPDiff(index, next) {
	var current = _rcp[index] || 0;
	next = next || 0;
	let diff = next - current;
	_addUsed(diff);
	_rcp[index] = next;
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

	get: function() {
		return _max;
	},

	getUsed: function() {
		return _used;
	},

	getUnused: function() {
		return _max - _used;
	},

	getForDisAdv: function() {
		return {
			adv: [_adv, _adv_mag, _adv_kar],
			disadv: [_disadv, _disadv_mag, _disadv_kar]
		};
	},

	getCosts: function(fw, skt, add = true) {
		var costs = skt !== undefined ? (fw == 'aktv' ? AKTV[skt - 1] : fw < 13 ? SKT[skt - 1][0] : SKT[skt - 1][fw - 12]) : fw;
		if (!add) costs = -costs;
		return costs;
	},

	validate: function(fw, skt, add = true, adv = false) {
		if (adv && add) {
			// fw = ap, skt = [Adv/Disadv, common/magic/karm]
			if (skt) {
				if ((_adv + fw) > 80) {
					reactAlert('Obergrenze für Vorteile erreicht', 'Du kannst nicht mehr als 80 AP für Vorteile ausgeben!');
					return false;
				}
				if ((_max - _used - fw) < 0) {
					reactAlert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
					return false;
				}
				if (skt[1] === 2) {
					if (_adv_mag + fw <= 50) return true;
				} else if (skt[1] === 3) {
					if (_adv_kar + fw <= 50) return true;
				} else {
					return true;
				}
			} else if (!skt) {
				if ((_disadv - fw) > 80) {
					reactAlert('Obergrenze für Nachteile erreicht', 'Du kannst nicht mehr als 80 AP durch Nachteile erhalten!');
					return false;
				}
				if (skt[1] === 2) {
					if (_disadv_mag - fw <= 50) return true;
				} else if (skt[1] === 3) {
					if (_disadv_kar - fw <= 50) return true;
				} else {
					return true;
				}
			}
		} else {
			var costs = this.getCosts(fw, skt, add);
			if ((_max - _used - costs) >= 0) return costs;
		}
		reactAlert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		return false;
	}

});

APStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.ap);
			break;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.ADD_MAX_ENERGY_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.ACTIVATE_LITURGY:
		case ActionTypes.DEACTIVATE_LITURGY:
		case ActionTypes.ADD_LITURGY_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
			_addUsed(payload.costs);
			break;

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.UPDATE_DISADV_TIER:
			_addAdvDisadv(payload);
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

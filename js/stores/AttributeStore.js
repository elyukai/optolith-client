import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ELStore from './ELStore';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import RaceStore from './rcp/RaceStore';
import ActionTypes from '../constants/ActionTypes';

const CATEGORY = 'attributes';

var _le = 5;
var _le_add = 0;
var _ae_add = 0;
var _ke_add = 0;
var _sk = -5;
var _zk = -5;
var _gs = 8;

function _addPoint(id) {
	ListStore.addAttrPoint(id);
}

function _removePoint(id) {
	ListStore.removeAttrPoint(id);
}

function _addMaxEnergyPoint(id) {
	switch (id) {
		case 'LE':
			_le_add++;
			break;
		case 'AE':
			_ae_add++;
			break;
		case 'KE':
			_ke_add++;
			break;
	}
}

function _assignRCP(selections) {
	let currentRace = RaceStore.getCurrent() || {};
	let mod = 0;

	mod = currentRace.attr_sel[0];
	_le = currentRace.le;
	_sk = currentRace.sk;
	_zk = currentRace.zk;
	_gs = currentRace.gs;

	ListStore.addToProperty(selections.attrSel, 'mod', mod);
}

var AttributeStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawAttributes) {
		for (let id in rawAttributes) {
			rawAttributes[id].value = 8;
			rawAttributes[id].category = CATEGORY;
			rawAttributes[id].dependencies = [];
			rawAttributes[id].mod = 0;
		}
		ListStore.init(rawAttributes);
	},
	
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
		return {
			values: ListStore.getAllByCategory(CATEGORY).map(e => [e.value, e.mod]),
			_le, _le_add, _ae_add, _ke_add, _sk, _zk, _gs
		};
	},

	get: function(id) {
		return ListStore.get(id);
	},

	getValue: function(id) {
		return this.get(id).value;
	},

	getAdd: function(id) {
		switch (id) {
			case 'LE':
				return _le_add;
			case 'AE':
				return _ae_add;
			case 'KE':
				return _ke_add;
		}
	},

	getAllForView: function() {
		// var phase = PhaseStore.get();
		var phase = 1;

		var attrsObj = ListStore.getObjByCategory(CATEGORY);
		var attrs = [];

		var sum = this.getSum();
		
		for (let id in attrsObj) {
			let attr = attrsObj[id];
			let { value, mod, dependencies } = attr;

			let _max = 25;
			if (phase < 3) {
				_max = sum >= ELStore.getStart().max_attrsum ? 0 : ELStore.getStart().max_attr + mod;
			}
			attr.disabledIncrease = value >= _max;

			let _min = Math.max(8, ...dependencies);
			attr.disabledDecrease = value <= _min;

			attrs.push(attr);
		}
		return ListStore.getAllByCategory(CATEGORY);
	},

	getBaseValues: function() {
		return {
			le: _le,
			leAdd: _le_add,
			aeAdd: _ae_add,
			keAdd: _ke_add,
			sk: _sk,
			zk: _zk,
			gs: _gs
		};
	},

	getSum: function() {
		var sum = 0;
		var attrsObj = ListStore.getObjByCategory(CATEGORY);
		for (let id in attrsObj) {
			sum += attrsObj[id].value;
		}
		return sum;
	}

});

AttributeStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.ADD_ATTRIBUTE_POINT:
			_addPoint(payload.id);
			break;

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			_removePoint(payload.id);
			break;

		case ActionTypes.ADD_MAX_ENERGY_POINT:
			_addMaxEnergyPoint(payload.id);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			AttributeStore.init(payload.attributes);
			break;
		
		default:
			return true;
	}
	
	AttributeStore.emitChange();

	return true;

});

export default AttributeStore;

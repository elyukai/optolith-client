import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ELStore from './ELStore';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import RaceStore from './RaceStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.ATTRIBUTES;

var _le = 0;
var _le_add = 0;
var _ae_add = 0;
var _ke_add = 0;
var _sk = 0;
var _zk = 0;
var _gs = 0;

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

function _clear() {
	_le = 0;
	_le_add = 0;
	_ae_add = 0;
	_ke_add = 0;
	_sk = 0;
	_zk = 0;
	_gs = 0;
}

function _updateAll(obj) {
	_le = obj._le;
	_le_add = obj._le_add;
	_ae_add = obj._ae_add;
	_ke_add = obj._ke_add;
	_sk = obj._sk;
	_zk = obj._zk;
	_gs = obj._gs;
}

function _assignRCP() {
	let currentRace = RaceStore.getCurrent() || { le: 0, sk: 0, zk: 0, gs: 0 };
	_le = currentRace.le;
	_sk = currentRace.sk;
	_zk = currentRace.zk;
	_gs = currentRace.gs;
}

var AttributeStore = Object.assign({}, EventEmitter.prototype, {
	
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
			values: ListStore.getAllByCategory(CATEGORY).map(e => [e.id, e.value, e.mod]),
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
		var phase = PhaseStore.get();

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

		case ActionTypes.CLEAR_HERO:
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.attr);
			break;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			break;

		case ActionTypes.ADD_MAX_ENERGY_POINT:
			_addMaxEnergyPoint(payload.id);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;
		
		default:
			return true;
	}
	
	AttributeStore.emitChange();

	return true;

});

export default AttributeStore;

import { getAllByCategory } from './ListStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Categories from '../constants/Categories';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

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
		case 'LP':
			_le_add++;
			break;
		case 'AE':
			_ae_add++;
			break;
		case 'KP':
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
	_le = obj.le;
	_le_add = obj.le_add;
	_ae_add = obj.ae_add;
	_ke_add = obj.ke_add;
	_sk = obj.sk;
	_zk = obj.zk;
	_gs = obj.gs;
}

function _assignRCP() {
	let currentRace = RaceStore.getCurrent();
	_le = currentRace.lp;
	_sk = currentRace.spi;
	_zk = currentRace.tou;
	_gs = currentRace.mov;
}

class _AttributeStore extends Store {

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	getAdd(id) {
		switch (id) {
			case 'LP':
				return _le_add;
			case 'AE':
				return _ae_add;
			case 'KP':
				return _ke_add;
			default:
				return 0;
		}
	}

	getBaseValues() {
		return {
			le: _le,
			leAdd: _le_add,
			aeAdd: _ae_add,
			keAdd: _ke_add,
			sk: _sk,
			zk: _zk,
			gs: _gs
		};
	}

	getSum() {
		return this.getAll().reduce((a,b) => a + b.value, 0);
	}

	getForSave() {
		return Object.assign({}, {
			values: this.getAll().map(e => [e.id, e.value, e.mod])
		}, this.getBaseValues());
	}

}

const AttributeStore = new _AttributeStore();

AttributeStore.dispatchToken = AppDispatcher.register(payload => {

	AppDispatcher.waitFor([RequirementsStore.dispatchToken]);	

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
			if (RequirementsStore.isValid()) {
				_addMaxEnergyPoint(payload.id);
			}
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

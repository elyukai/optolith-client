import { getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import * as Categories from '../constants/Categories';
import HistoryStore from './HistoryStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

const CATEGORY = Categories.ATTRIBUTES;

type ids = 'LP' | 'AE' | 'KP';

let _le = 0;
let _ae = 0;
let _ke = 0;

function _addPoint(id: ids) {
	switch (id) {
		case 'LP':
			_le++;
			break;
		case 'AE':
			_ae++;
			break;
		case 'KP':
			_ke++;
			break;
	}
}

function _removePoint(id: ids) {
	switch (id) {
		case 'LP':
			_le--;
			break;
		case 'AE':
			_ae--;
			break;
		case 'KP':
			_ke--;
			break;
	}
}

function _clear() {
	_le = 0;
	_ae = 0;
	_ke = 0;
}

function _updateAll(obj) {
	_le = obj.le;
	_ae = obj.ae;
	_ke = obj.ke;
}

class AttributeStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	getAdd(id: ids) {
		switch (id) {
			case 'LP':
				return _le;
			case 'AE':
				return _ae;
			case 'KP':
				return _ke;
		}
	}

	getAddEnergies() {
		return {
			le: _le,
			ae: _ae,
			ke: _ke
		};
	}

	getSum() {
		return this.getAll().reduce((a,b) => a + b.value, 0);
	}

	getForSave() {
		return Object.assign({}, {
			values: this.getAll().map(e => [e.id, e.value, e.mod])
		}, this.getAddEnergies());
	}

}

const AttributeStore: AttributeStoreStatic = new AttributeStoreStatic(action => {

	AppDispatcher.waitFor([RequirementsStore.dispatchToken, HistoryStore.dispatchToken]);

	if (action.undoAction) {
		switch(action.type) {
			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
				break;

			case ActionTypes.ADD_MAX_ENERGY_POINT:
				_removePoint(action.options.id);
				break;

			default:
				return true;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.CLEAR_HERO:
			case ActionTypes.CREATE_NEW_HERO:
				_clear();
				break;

			case ActionTypes.RECEIVE_HERO:
				_updateAll(action.attr);
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
				break;

			case ActionTypes.ADD_MAX_ENERGY_POINT:
				if (RequirementsStore.isValid()) {
					_addPoint(action.id);
				}
				break;

			default:
				return true;
		}
	}

	AttributeStore.emitChange();

	return true;

});

export default AttributeStore;

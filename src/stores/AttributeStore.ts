import { getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import HistoryStore from './HistoryStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

type Action = AddAttributePointAction | RemoveAttributePointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | ReceiveHeroDataAction | CreateHeroAction | UndoTriggerActions;

const CATEGORY = Categories.ATTRIBUTES;

type ids = 'LP' | 'AE' | 'KP';

let _lp = 0;
let _ae = 0;
let _kp = 0;

function _addLifePoint() {
	_lp++;
}

function _addArcaneEnergyPoint() {
	_ae++;
}

function _addKarmaPoint() {
	_kp++;
}

function _removeLifePoint() {
	_lp--;
}

function _removeArcaneEnergyPoint() {
	_ae--;
}

function _removeKarmaPoint() {
	_kp--;
}

function _clear() {
	_lp = 0;
	_ae = 0;
	_kp = 0;
}

function _updateAll(obj: { lp: number; ae: number; kp: number; }) {
	_lp = obj.lp;
	_ae = obj.ae;
	_kp = obj.kp;
}

class AttributeStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as AttributeInstance[];
	}

	getAdd(id: ids) {
		switch (id) {
			case 'LP':
				return _lp;
			case 'AE':
				return _ae;
			case 'KP':
				return _kp;
		}
	}

	getAddEnergies() {
		return {
			lp: _lp,
			ae: _ae,
			kp: _kp
		};
	}

	getSum() {
		return this.getAll().reduce((a,b) => a + b.value, 0);
	}

	getForSave() {
		return {
			values: this.getAll().map(e => [e.id, e.value, e.mod] as [string, number, number]),
			...this.getAddEnergies()
		};
	}

}

const AttributeStore: AttributeStoreStatic = new AttributeStoreStatic((action: Action) => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken, HistoryStore.dispatchToken]);
	if (action.undo) {
		switch(action.type) {
			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				break;

			case ActionTypes.ADD_LIFE_POINT:
				_removeLifePoint();
				break;

			case ActionTypes.ADD_ARCANE_ENERGY_POINT:
				_removeArcaneEnergyPoint();
				break;

			case ActionTypes.ADD_KARMA_POINT:
				_removeKarmaPoint();
				break;

			default:
				return true;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.CREATE_HERO:
				_clear();
				break;

			case ActionTypes.RECEIVE_HERO_DATA:
				_updateAll(action.payload.data.attr);
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
				break;

			case ActionTypes.ADD_LIFE_POINT:
				if (RequirementsStore.isValid()) {
					_addLifePoint();
				}
				break;

			case ActionTypes.ADD_ARCANE_ENERGY_POINT:
				if (RequirementsStore.isValid()) {
					_addArcaneEnergyPoint();
				}
				break;

			case ActionTypes.ADD_KARMA_POINT:
				if (RequirementsStore.isValid()) {
					_addKarmaPoint();
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

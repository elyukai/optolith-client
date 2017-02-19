import { getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import HistoryStore from './HistoryStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

type Action = AddAttributePointAction | RemoveAttributePointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | ReceiveHeroDataAction | CreateHeroAction | UndoTriggerActions | RemovePermanentAEPointAction | RemovePermanentKPPointAction | RemoveRedeemedAEPointAction | RemoveRedeemedKPPointAction | RedeemAEPointAction | RedeemKPPointAction;

const CATEGORY = Categories.ATTRIBUTES;

type ids = 'LP' | 'AE' | 'KP';

let _lp = 0;
let _ae = 0;
let _kp = 0;
let _permanentAE = {
	lost: 0,
	redeemed: 0
};
let _permanentKP = {
	lost: 0,
	redeemed: 0
};

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

function _redeemAEPoint() {
	_permanentAE.redeemed++;
}

function _redeemKPPoint() {
	_permanentKP.redeemed++;
}

function _removeRedeemedAEPoint() {
	_permanentAE.redeemed--;
}

function _removeRedeemedKPPoint() {
	_permanentKP.redeemed--;
}

function _removePermanentAEPoints(value: number) {
	_permanentAE.lost += value;
}

function _removePermanentKPPoints(value: number) {
	_permanentKP.lost += value;
}

function _addPermanentAEPoints(value: number) {
	_permanentAE.lost -= value;
}

function _addPermanentKPPoints(value: number) {
	_permanentKP.lost -= value;
}

function _clear() {
	_lp = 0;
	_ae = 0;
	_kp = 0;
}

function _updateAll(obj: { lp: number; ae: number; kp: number; permanentAE: { lost: number; redeemed: number; }; permanentKP: { lost: number; redeemed: number; }; }) {
	_lp = obj.lp;
	_ae = obj.ae;
	_kp = obj.kp;
	_permanentAE = obj.permanentAE;
	_permanentKP = obj.permanentKP;
}

const getChangePermanentArcaneEnergyBySpecialAbilityAmount = (id: string, negative: boolean = false) => {
	const modifier = negative ? -1 : 1;
	let value = 0;
	switch (id) {
		case 'SA_92':
			value = 2;
			break;
	}
	return value * modifier;
};

const changePermanentArcaneEnergyBySpecialAbility = (id: string, negative: boolean = false) => {
	const value = getChangePermanentArcaneEnergyBySpecialAbilityAmount(id, negative);
	_permanentAE.lost += value;
	const { redeemed, lost } = _permanentAE;
	if (redeemed > lost) {
		_permanentAE.redeemed = lost;
	}
};

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
			kp: _kp,
			permanentAE: _permanentAE,
			permanentKP: _permanentKP
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

	getPermanentRedeemedChangeAmount(id: string) {
		const value = getChangePermanentArcaneEnergyBySpecialAbilityAmount(id, true);
		const { redeemed, lost } = _permanentAE;
		const balance = lost + value;
		return redeemed > balance ? redeemed - balance : 0;
	}

}

const AttributeStore: AttributeStoreStatic = new AttributeStoreStatic((action: Action) => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken, HistoryStore.dispatchToken]);
	if (action.undo) {
		switch(action.type) {
			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_DISADV:
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
				changePermanentArcaneEnergyBySpecialAbility(action.payload.id, true);
				break;

			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				changePermanentArcaneEnergyBySpecialAbility(action.payload.id);
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

			case ActionTypes.REDEEM_AE_POINT:
				_removeRedeemedAEPoint();
				break;

			case ActionTypes.REDEEM_KP_POINT:
				_removeRedeemedKPPoint();
				break;

			case ActionTypes.REMOVE_REDEEMED_AE_POINT:
				_redeemAEPoint();
				break;

			case ActionTypes.REMOVE_REDEEMED_KP_POINT:
				_redeemKPPoint();
				break;

			case ActionTypes.REMOVE_PERMANENT_AE_POINTS:
				_addPermanentAEPoints(action.payload.value);
				break;

			case ActionTypes.REMOVE_PERMANENT_KP_POINTS:
				_addPermanentKPPoints(action.payload.value);
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

			case ActionTypes.REDEEM_AE_POINT:
				if (RequirementsStore.isValid()) {
					_redeemAEPoint();
				}
				break;

			case ActionTypes.REDEEM_KP_POINT:
				if (RequirementsStore.isValid()) {
					_redeemKPPoint();
				}
				break;

			case ActionTypes.REMOVE_REDEEMED_AE_POINT:
				if (RequirementsStore.isValid()) {
					_removeRedeemedAEPoint();
				}
				break;

			case ActionTypes.REMOVE_REDEEMED_KP_POINT:
				if (RequirementsStore.isValid()) {
					_removeRedeemedKPPoint();
				}
				break;

			case ActionTypes.REMOVE_PERMANENT_AE_POINTS:
				_removePermanentAEPoints(action.payload.value);
				break;

			case ActionTypes.REMOVE_PERMANENT_KP_POINTS:
				_removePermanentKPPoints(action.payload.value);
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
				changePermanentArcaneEnergyBySpecialAbility(action.payload.id);
				break;

			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				changePermanentArcaneEnergyBySpecialAbility(action.payload.id, true);
				break;

			default:
				return true;
		}
	}

	AttributeStore.emitChange();
	return true;
});

export default AttributeStore;

import { check, checkDisAdvantages, final } from '../utils/iccalc';
import { get } from './ListStore';
import alert from '../utils/alert';
import APStore from './APStore';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AttributeStore from './AttributeStore';
import Categories from '../constants/Categories';
import Store from './Store';

let _cost = 0;
let _validCost = false;
let _disadv: [boolean, 0 | 1 | 2] = [true, 0];
let _validOwnRequirements = false;

const updateCost = (cost: number, valid: boolean) => {
	_cost = cost;
	_validCost = valid || check(_cost);
	if (valid !== undefined) {
		_validCost = valid;
	}
	else {
		_validCost = check(cost);
	}
	if (!_validCost) {
		alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
	}
}

function _updateDisAdvCost(id: string, cost: number, valid?: boolean) {
	_cost = cost;
	if (valid !== undefined) {
		_validCost = valid;
		if (!_validCost) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
	}
	else {
		const { category, reqs } = get(id);
		const { adv, disadv, spent, total } = APStore.getAll();
		const add = category === Categories.ADVANTAGES;
		const target = () => add ? adv : disadv;

		const isKar = reqs.some((e: [string, number]) => e[0] === 'ADV_12' && e[1]);
		const isMag = reqs.some((e: [string, number]) => e[0] === 'ADV_50' && e[1]);
		const index = isKar ? 2 : isMag ? 1 : 0;

		_validCost = checkDisAdvantages(id, cost, index, target(), spent, total, add);

		const sub = isKar ? 'karmale' : isMag ? 'magische' : '';
		const text = add ? 'Vorteile' : 'Nachteile';

		if (!_validCost[2]) {
			alert(`Obergrenze für ${sub} ${text} erreicht`, `Du kannst nicht mehr als 50 AP für ${sub} ${text} ausgeben!`);
		}
		else if (!_validCost[1]) {
			alert(`Obergrenze für ${text} erreicht`, `Du kannst nicht mehr als 80 AP für ${text} ausgeben!`);
		}
		else if (!_validCost[0]) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
		else {
			_disadv = [ add, index ];
		}

		_validCost = _validCost.every(e => e);
	}
}

function _updateOwnRequirements(isValid) {
	_validOwnRequirements = isValid;
}

class _RequirementsStore extends Store {

	getCurrentCost() {
		return _cost;
	}

	getDisAdvDetails() {
		return _disadv;
	}

	isValid() {
		return _validCost && _validOwnRequirements;
	}

}

const RequirementsStore = new _RequirementsStore();

RequirementsStore.dispatchToken = AppDispatcher.register(payload => {

	if (payload.undoAction) {
		_updateOwnRequirements(true);
		_updateCost(-payload.cost, true);
	}
	else {
		switch( payload.type ) {
			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY: {
				const obj = get(payload.id);
				_updateOwnRequirements(true);
				if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.CHANTS && obj.gr === 3)) {
					_updateCost(1);
				}
				else {
					_updateCost(final(obj.ic, 0));
				}
				break;
			}

			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY: {
				const obj = get(payload.id);
				_updateOwnRequirements(true);
				if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.CHANTS && obj.gr === 3)) {
					_updateCost(-1);
				}
				else {
					_updateCost(final(obj.ic, 0) * -1);
				}
				break;
			}

			case ActionTypes.ACTIVATE_DISADV:
				_updateOwnRequirements(get(payload.id).isActivatable);
				_updateDisAdvCost(payload.id, payload.cost);
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
				_updateOwnRequirements(get(payload.id).isActivatable);
				_updateCost(payload.cost);
				break;

			case ActionTypes.DEACTIVATE_DISADV:
				_updateOwnRequirements(get(payload.id).isDeactivatable);
				_updateDisAdvCost(payload.id, payload.cost);
				break;

			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				_updateOwnRequirements(get(payload.id).isDeactivatable);
				_updateCost(-payload.cost);
				break;

			case ActionTypes.UPDATE_DISADV_TIER:
				_updateOwnRequirements(true);
				_updateDisAdvCost(payload.id, payload.cost);
				break;

			case ActionTypes.UPDATE_SPECIALABILITY_TIER:
				_updateOwnRequirements(true);
				_updateCost(payload.cost);
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT: {
				const obj = get(payload.id);
				_updateOwnRequirements(obj.isIncreasable);
				_updateCost(final(obj.ic, obj.value + 1));
				break;
			}

			case ActionTypes.ADD_MAX_ENERGY_POINT: {
				const obj = secondaryAttributes.get(payload.id);
				_updateOwnRequirements(obj.maxAdd && obj.currentAdd < obj.maxAdd);
				_updateCost(final(4, AttributeStore.getAdd(payload.id) + 1));
				break;
			}

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT: {
				const obj = get(payload.id);
				_updateOwnRequirements(obj.isDecreasable);
				_updateCost(final(obj.ic, obj.value) * -1);
				break;
			}

			default:
				return true;
		}
	}

	RequirementsStore.emitChange();

	return true;

});

export default RequirementsStore;

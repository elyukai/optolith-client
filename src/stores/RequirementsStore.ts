import { check, checkDisAdvantages, final } from '../utils/iccalc';
import { get } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import alert from '../utils/alert';
import APStore from './APStore';
import AttributeStore from './AttributeStore';
import Store from './Store';

let _cost = 0;
let _validCost = false;
let _disadv: [boolean, 0 | 1 | 2] = [true, 0];
let _validOwnRequirements = false;

const _updateCost = (cost: number, valid?: boolean) => {
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
};

function _updateDisAdvCost(id: string, cost: number, valid?: boolean) {
	_cost = cost;
	if (valid !== undefined) {
		_validCost = valid;
		if (!_validCost) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
	}
	else {
		const { category, reqs } = get(id) as AdvantageInstance | DisadvantageInstance;
		const { adv, disadv, spent, total } = APStore.getAll();
		const add = category === Categories.ADVANTAGES;
		const target = () => add ? adv : disadv;

		const isKar = reqs.some(e => e !== 'RCP' && e.id === 'ADV_12' && !!e.active);
		const isMag = reqs.some(e => e !== 'RCP' && e.id === 'ADV_50' && !!e.active);
		const index = isKar ? 2 : isMag ? 1 : 0;

		const validDisAdv = checkDisAdvantages(cost, index, target(), spent, total, add);

		const sub = isKar ? 'karmale' : isMag ? 'magische' : '';
		const text = add ? 'Vorteile' : 'Nachteile';

		if (!validDisAdv[2]) {
			alert(`Obergrenze für ${sub} ${text} erreicht`, `Du kannst nicht mehr als 50 AP für ${sub} ${text} ausgeben!`);
		}
		else if (!validDisAdv[1]) {
			alert(`Obergrenze für ${text} erreicht`, `Du kannst nicht mehr als 80 AP für ${text} ausgeben!`);
		}
		else if (!validDisAdv[0]) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
		else {
			_disadv = [ add, index ];
		}

		_validCost = validDisAdv.every(e => e);
	}
}

function _updateOwnRequirements(isValid: boolean) {
	_validOwnRequirements = isValid;
}

class RequirementsStoreStatic extends Store {

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

const RequirementsStore = new RequirementsStoreStatic((action: Action) => {
	if (action.undo) {
		_updateOwnRequirements(true);
		_updateCost(-action.cost!, true);
	}
	else {
		switch(action.type) {
			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY: {
				const obj = get(action.payload.id) as LiturgyInstance | SpellInstance;
				_updateOwnRequirements(true);
				if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.LITURGIES && obj.gr === 3)) {
					_updateCost(1);
				}
				else {
					_updateCost(final(obj.ic, 0));
				}
				break;
			}

			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY: {
				const obj = get(action.payload.id) as LiturgyInstance | SpellInstance;
				_updateOwnRequirements(true);
				if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.LITURGIES && obj.gr === 3)) {
					_updateCost(-1);
				}
				else {
					_updateCost(final(obj.ic, 0) * -1);
				}
				break;
			}

			case ActionTypes.ACTIVATE_DISADV:
				_updateOwnRequirements((get(action.payload.id) as AdvantageInstance | DisadvantageInstance).isActivatable);
				_updateDisAdvCost(action.payload.id, action.payload.cost);
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
				_updateOwnRequirements((get(action.payload.id) as AdvantageInstance | DisadvantageInstance).isActivatable);
				_updateCost(action.payload.cost);
				break;

			case ActionTypes.DEACTIVATE_DISADV:
				_updateOwnRequirements((get(action.payload.id) as AdvantageInstance | DisadvantageInstance).isDeactivatable);
				_updateDisAdvCost(action.payload.id, -action.payload.cost);
				break;

			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				_updateOwnRequirements((get(action.payload.id) as AdvantageInstance | DisadvantageInstance).isDeactivatable);
				_updateCost(-action.payload.cost - AttributeStore.getPermanentRedeemedChangeAmount(action.payload.id) * 2, true);
				break;

			case ActionTypes.SET_DISADV_TIER:
				_updateOwnRequirements(true);
				_updateDisAdvCost(action.payload.id, action.payload.cost);
				break;

			case ActionTypes.SET_SPECIALABILITY_TIER:
				_updateOwnRequirements(true);
				_updateCost(action.payload.cost);
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT: {
				const obj = get(action.payload.id) as AttributeInstance | TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance;
				_updateOwnRequirements(obj.isIncreasable);
				_updateCost(final(obj.ic, obj.value + 1));
				break;
			}

			case ActionTypes.ADD_LIFE_POINT: {
				const obj = secondaryAttributes.get('LP') as Energy;
				_updateOwnRequirements(obj.currentAdd < obj.maxAdd);
				_updateCost(final(4, AttributeStore.getAdd('LP') + 1));
				break;
			}

			case ActionTypes.ADD_ARCANE_ENERGY_POINT: {
				const obj = secondaryAttributes.get('AE') as Energy;
				_updateOwnRequirements(obj.currentAdd < obj.maxAdd);
				_updateCost(final(4, AttributeStore.getAdd('AE') + 1));
				break;
			}

			case ActionTypes.ADD_KARMA_POINT: {
				const obj = secondaryAttributes.get('KP') as Energy;
				_updateOwnRequirements(obj.currentAdd < obj.maxAdd);
				_updateCost(final(4, AttributeStore.getAdd('KP') + 1));
				break;
			}

			case ActionTypes.REDEEM_AE_POINT:
			case ActionTypes.REDEEM_KP_POINT: {
				_updateOwnRequirements(true);
				_updateCost(2);
				break;
			}

			case ActionTypes.REMOVE_REDEEMED_AE_POINT:
			case ActionTypes.REMOVE_REDEEMED_KP_POINT: {
				_updateOwnRequirements(true);
				_updateCost(-2, true);
				break;
			}

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT: {
				const obj = get(action.payload.id) as AttributeInstance | TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance;
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

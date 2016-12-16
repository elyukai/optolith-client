import AppDispatcher from '../dispatcher/AppDispatcher';
import AttributeStore from './AttributeStore';
import { check, final } from '../utils/iccalc';
import { get } from './ListStore';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

var _cost = 0;
var _validCost = false;
var _validOwnRequirements = false;

function _updateCost(cost, valid) {
	_cost = cost;
	_validCost = valid || check(_cost);
}

function _updateOwnRequirements(isValid) {
	_validOwnRequirements = isValid;
}

class _RequirementsStore extends Store {

	getCurrentCost() {
		return _cost;
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
		RequirementsStore.emitChange();
		return true;
	}

	switch( payload.actionType ) {

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
			_updateCost(final(get(payload.id).ic, 0));
			break;
		
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
			_updateCost(final(get(payload.id).ic, 0) * -1);
			break;

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
			_updateCost(payload.costs);
			break;

		case ActionTypes.DEACTIVATE_DISADV:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
			_updateCost(-payload.costs);
			break;

		case ActionTypes.UPDATE_DISADV_TIER:
		case ActionTypes.UPDATE_SPECIALABILITY_TIER:
			_updateCost(payload.costs);
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

		case ActionTypes.ADD_MAX_ENERGY_POINT:
			_updateCost(final(4, AttributeStore.getAdd(payload.id) + 1));
			break;

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
	
	RequirementsStore.emitChange();

	return true;

});

export default RequirementsStore;

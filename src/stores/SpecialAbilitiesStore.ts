import * as ActionTypes from '../constants/ActionTypes';
import Store from './Store';

type Action = ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | SetSpecialAbilitiesSortOrderAction | UndoTriggerActions;

// const GROUPS = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stab)', 'Magisch (Hexe)', 'Geweiht'];

let _sortOrder = 'group';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

class SpecialAbilitiesStoreStatic extends Store {

	getSortOrder() {
		return _sortOrder;
	}

}

const SpecialAbilitiesStore = new SpecialAbilitiesStoreStatic((action: Action) => {
	if (action.undo) {
		switch(action.type) {
			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				break;

			default:
				return true;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
				_updateSortOrder(action.payload.sortOrder);
				break;

			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
			case ActionTypes.SET_SPECIALABILITY_TIER:
				break;

			default:
				return true;
		}
	}

	SpecialAbilitiesStore.emitChange();
	return true;
});

export default SpecialAbilitiesStore;

import { get, getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import Store from './Store';

type Action = AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | SetCombatTechniquesSortOrderAction | UndoTriggerActions;

const CATEGORY = Categories.COMBAT_TECHNIQUES;

let _sortOrder = 'name';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

class CombatTechniquesStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as CombatTechniqueInstance[];
	}

	getAllForSave() {
		const active: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { id, value } = e;
			if (value > 6) {
				active[id] = value;
			}
		});
		return { active };
	}

	getMaxPrimaryAttributeValueByID(array: string[]) {
		return array.map(attr => (get(attr) as AttributeInstance).value).reduce((a, b) => Math.max(a, b), 0);
	}

	getPrimaryAttributeMod(array: string[]) {
		return Math.max(Math.floor((this.getMaxPrimaryAttributeValueByID(array) - 8) / 3), 0);
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const CombatTechniquesStore = new CombatTechniquesStoreStatic((action: Action) => {
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
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
				break;

			case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
				_updateSortOrder(action.payload.sortOrder);
				break;

			default:
				return true;
		}
	}

	CombatTechniquesStore.emitChange();
	return true;
});

export default CombatTechniquesStore;

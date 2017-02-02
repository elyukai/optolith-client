import { get, getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import Store from './Store';

type Action = AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | SetCombatTechniquesSortOrderAction;

const CATEGORY = Categories.COMBAT_TECHNIQUES;

let _sortOrder = 'name';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

class CombatTechniquesStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as CombatTechnique[];
	}

	getAllForSave() {
		const result = new Map();
		this.getAll().forEach(e => {
			const { id, value } = e;
			if (value > 6) {
				result.set(id, value);
			}
		});
		return {
			active: Array.from(result)
		};
	}

	getMaxPrimaryAttributeValueByID(array: string[]) {
		return array.map(attr => (get(attr) as Attribute).value).reduce((a, b) => Math.max(a, b), 0);
	}

	getPrimaryAttributeMod(array: string[]) {
		return Math.max(Math.floor((this.getMaxPrimaryAttributeValueByID(array) - 8) / 3), 0);
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const CombatTechniquesStore = new CombatTechniquesStoreStatic((action: Action) => {
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

	CombatTechniquesStore.emitChange();
	return true;
});

export default CombatTechniquesStore;

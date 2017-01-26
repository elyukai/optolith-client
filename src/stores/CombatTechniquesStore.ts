import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import { get, getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

const CATEGORY = Categories.COMBAT_TECHNIQUES;

let _sortOrder = 'name';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

class CombatTechniquesStoreStatic extends Store {

	getAllForSave() {
		var all = getAllByCategory(CATEGORY);
		var result = new Map();
		all.forEach(e => {
			let { id, fw } = e;
			if (fw > 6) {
				result.set(id, fw);
			}
		});
		return {
			active: Array.from(result)
		};
	}

	get(id: string) {
		return get(id);
	}

	getMaxPrimaryAttributeValueByID(array) {
		return array.map(attr => this.get(attr).value).reduce((a, b) => Math.max(a, b), 0);
	}

	getPrimaryAttributeMod(array) {
		return Math.max(Math.floor((this.getMaxPrimaryAttributeValueByID(array) - 8) / 3), 0);
	}

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	getFilter() {
		return _filter;
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const CombatTechniquesStore = new CombatTechniquesStoreStatic();

CombatTechniquesStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			break;

		case ActionTypes.FILTER_COMBATTECHNIQUES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_COMBATTECHNIQUES:
			_updateSortOrder(payload.option);
			break;

		default:
			return true;
	}

	CombatTechniquesStore.emitChange();

	return true;

});

export default CombatTechniquesStore;

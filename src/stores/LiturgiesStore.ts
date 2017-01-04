import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ELStore from './ELStore';
import { get, getAllByCategory, getObjByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.CHANTS;

var _filterText = '';
var _sortOrder = 'name';

function _updateFilterText(text) {
	_filterText = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

class _LiturgiesStore extends Store {

	getForSave() {
		var all = getAllByCategory(CATEGORY);
		var result = new Map();
		all.forEach(e => {
			let { active, id, fw } = e;
			if (active) {
				result.set(id, fw);
			}
		});
		return {
			active: Array.from(result)
		};
	}

	get(id) {
		return get(id);
	}

	getAspectCounter() {
		return getAllByCategory(CATEGORY).filter(e => e.value >= 10).reduce((a,b) => {
			if (!a.has(b.aspect)) {
				a.set(b.aspect, 1);
			} else {
				a.set(b.aspect, a.get(b.aspect) + 1);
			}
		}, new Map());
	}

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	isActivationDisabled() {
		let maxSpellsLiturgies = ELStore.getStart().max_spells_liturgies;
		return PhaseStore.get() < 3 && getAllByCategory(CATEGORY).filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	}

	getGroupNames() {
		return ['Liturgie', 'Zeremonie', 'Segnung'];
	}

	getAspectNames() {
		return ['Allgemein', 'Antimagie', 'Ordnung', 'Schild', 'Sturm', 'Tod', 'Traum', 'Magie', 'Wissen', 'Handel', 'Schatten', 'Heilung', 'Landwirtschaft'];
	}

	getTraditionNames() {
		return ['Allgemein', 'Gildenmagier', 'Hexen', 'Elfen'];
	}

	getFilterText() {
		return _filterText;
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const LiturgiesStore = new _LiturgiesStore();

LiturgiesStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.ACTIVATE_LITURGY:
		case ActionTypes.DEACTIVATE_LITURGY:
		case ActionTypes.ADD_LITURGY_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
			break;

		case ActionTypes.FILTER_LITURGIES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_LITURGIES:
			_updateSortOrder(payload.option);
			break;

		default:
			return true;
	}

	LiturgiesStore.emitChange();

	return true;

});

export default LiturgiesStore;

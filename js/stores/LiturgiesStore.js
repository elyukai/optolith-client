import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ELStore from './ELStore';
import { get, getAllByCategory, getObjByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.CHANTS;

var _filter = '';
var _sortOrder = 'name';

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _filterAndSort(array) {
	if (_filter !== '') {
		let filter = _filter.toLowerCase();
		array = array.filter(obj => obj.name.toLowerCase().match(filter));
	}
	if (_sortOrder == 'name') {
		array.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			} else {
				return 0;
			}
		});
	} else if (_sortOrder == 'groups') {
		array.sort((a, b) => {
			if (a.gr < b.gr) {
				return -1;
			} else if (a.gr > b.gr) {
				return 1;
			} else {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			}
		});
	}
	return array;
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

	getActiveForView() {
		var liturgies = getAllByCategory(CATEGORY).filter(e => e.active);
		return _filterAndSort(liturgies);
	}

	getDeactiveForView() {
		var liturgies = getObjByCategory(CATEGORY).filter(e => {
			if (!e.active) {
				if (!e.isOwnTradition) {
					return false;
				}
				return true;
			}
			return false;
		});
		return _filterAndSort(liturgies);
	}

	isActivationDisabled() {
		let maxSpellsLiturgies = ELStore.getStart().max_spells_liturgies;
		return PhaseStore.get() < 3 && getAllByCategory(CATEGORY).filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	}

	getFilter() {
		return _filter;
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const LiturgiesStore = new _LiturgiesStore();

LiturgiesStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

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

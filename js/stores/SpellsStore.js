import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ELStore from './ELStore';
import { get, getAllByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.SPELLS;

const TRADITIONS = ['Allgemein', 'Gildenmagier', 'Hexen', 'Elfen'];

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
	if (_sortOrder === 'name') {
		array.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			} else {
				return 0;
			}
		});
	} else if (_sortOrder === 'groups') {
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
	} else if (_sortOrder === 'merk') {
		let merk = ['Antimagie', 'Dämonisch', 'Einfluss', 'Elementar', 'Heilung', 'Hellsicht', 'Illusion', 'Sphären', 'Objekt', 'Telekinese', 'Verwandlung', 'Rituale'];
		array.sort((a, b) => {
			if (merk[a.merk - 1] < merk[b.merk - 1]) {
				return -1;
			} else if (merk[a.merk - 1] > merk[b.merk - 1]) {
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
	
class _SpellsStore extends Store {

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

	getPropertyCounter() {
		return getAllByCategory(CATEGORY).filter(e => e.value >= 10).reduce((a,b) => {
			if (!a.has(b.property)) {
				a.set(b.property, 1);
			} else {
				a.set(b.property, a.get(b.property) + 1);
			}
		}, new Map());
	}

	getActiveForView() {
		var spells = getAllByCategory(CATEGORY).filter(e => e.active);
		return _filterAndSort(spells);
	}

	getDeactiveForView() {
		const maxUnfamiliar = PhaseStore.get() < 3 && getAllByCategory(CATEGORY).filter(e =>
			!e.tradition.some(e =>
				e === 1 ||
				e === get('SA_86').sid + 1
			) && e.gr < 3 && e.active
		).length >= ELStore.getStart().max_unfamiliar_spells;

		var spells = getAllByCategory(CATEGORY).filter(e => {
			if (!e.active) {
				if (!e.isOwnTradition) {
					if (e.gr > 2 || maxUnfamiliar) {
						return false;
					} else {
						e.name_add = e.tradition.map(e => TRADITIONS[e - 1]).join(', ');
						return true;
					}
				}
				return true;
			}
			return false;
		});
		return _filterAndSort(spells);
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

const SpellsStore = new _SpellsStore();

SpellsStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
			break;

		case ActionTypes.FILTER_SPELLS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_SPELLS:
			_updateSortOrder(payload.option);
			break;
		
		default:
			return true;
	}
	
	SpellsStore.emitChange();

	return true;

});

export default SpellsStore;

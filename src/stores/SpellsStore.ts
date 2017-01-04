import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ELStore from './ELStore';
import { get, getAllByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.SPELLS;

var _filterText = '';
var _sortOrder = 'name';

function _updateFilterText(text) {
	_filterText = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
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

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	areMaxUnfamiliar() {
		const phase = PhaseStore.get() < 3;
		const max = ELStore.getStart().max_unfamiliar_spells;
		const SA_86 = get('SA_86');

		return phase && this.getAll().filter(e => !e.tradition.some(e => e === 1 || e === SA_86.sid + 1) && e.gr < 3 && e.active).length >= max;
	}

	isActivationDisabled() {
		let maxSpellsLiturgies = ELStore.getStart().max_spells_liturgies;
		return PhaseStore.get() < 3 && getAllByCategory(CATEGORY).filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	}

	getGroupNames() {
		return ['Spruch', 'Ritual', 'Fluch', 'Lied', 'Trick'];
	}

	getPropertyNames() {
		return ['Antimagie', 'Dämonisch', 'Einfluss', 'Elementar', 'Heilung', 'Hellsicht', 'Illusion', 'Sphären', 'Objekt', 'Telekinese', 'Verwandlung'];
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

const SpellsStore = new _SpellsStore();

SpellsStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

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

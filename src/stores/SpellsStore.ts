import { get, getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ELStore from './ELStore';
import PhaseStore from './PhaseStore';
import Store from './Store';

type Action = ActivateSpellAction | DeactivateSpellAction | AddSpellPointAction | RemoveSpellPointAction | SetSpellsSortOrderAction;

const CATEGORY = Categories.SPELLS;

let _sortOrder = 'name';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

class SpellsStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as SpellInstance[];
	}

	getForSave() {
		const result = new Map();
		this.getAll().forEach(e => {
			const { active, id, value } = e;
			if (active) {
				result.set(id, value);
			}
		});
		return {
			active: Array.from(result)
		};
	}

	getPropertyCounter() {
		return this.getAll().filter(e => e.value >= 10).reduce((a,b) => {
			if (!a.has(b.property)) {
				a.set(b.property, 1);
			} else {
				a.set(b.property, a.get(b.property) + 1);
			}
			return a;
		}, new Map());
	}

	areMaxUnfamiliar() {
		const phase = PhaseStore.get() < 3;
		const max = ELStore.getStart().maxUnfamiliarSpells;
		const SA_86 = get('SA_86') as SpecialAbilityInstance;

		return phase && this.getAll().filter(e => !e.tradition.some(e => e === 1 || e === (SA_86.sid as number) + 1) && e.gr < 3 && e.active).length >= max;
	}

	isActivationDisabled() {
		const maxSpellsLiturgies = ELStore.getStart().maxSpellsLiturgies;
		return PhaseStore.get() < 3 && this.getAll().filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
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

	getSortOrder() {
		return _sortOrder;
	}

}

const SpellsStore = new SpellsStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
			break;

		case ActionTypes.SET_SPELLS_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		default:
			return true;
	}

	SpellsStore.emitChange();
	return true;
});

export default SpellsStore;

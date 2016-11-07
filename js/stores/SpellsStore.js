import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ELStore from './ELStore';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import ProfessionStore from './ProfessionStore';
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
	
var SpellsStore = Object.assign({}, EventEmitter.prototype, {
	
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getForSave: function() {
		var all = ListStore.getAllByCategory(CATEGORY);
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
	},

	get: function(id) {
		return ListStore.get(id);
	},

	getActiveForView: function() {
		var phase = PhaseStore.get();

		var spellsObj = ListStore.getObjByCategory(CATEGORY);
		var spells = [];

		var SA_88_ACTIVE = this.get('SA_88').active;
		var spellsAbove10 = ListStore.getAllByCategory(CATEGORY).filter(e => e.value >= 10);
		var counter = {};
		for (let i = 0; i < spellsAbove10.length; i++) {
			let spell = spellsAbove10[i];
			if (!counter.hasOwnProperty(spell.merk))
				counter[spell.merk] = 1;
			else
				counter[spell.merk]++;
		}
		
		for (let id in spellsObj) {
			let spell = spellsObj[id];
			let { active, fw, merk, trad, gr } = spell;

			if (!active) continue;

			var available = trad.some(e => e === 1 || e === ListStore.get('SA_86').sid + 1);
			if (!available) {
				if (gr > 2)
					continue;
				else
					spell.add = trad.map(e => TRADITIONS[e - 1]).join(', ');
			}
			spell.ownTradition = available;

			let _max = 25;
			let _max_bonus = this.get('ADV_16').active.filter(e => e === id).length;
			if (phase < 3)
				_max = ELStore.getStart().max_skill + _max_bonus;
			else {
				let checkValues = spell.check.map(attr => ListStore.get(attr).value);
				_max = Math.max(...checkValues) + 2 + _max_bonus;
			}
			if (SA_88_ACTIVE.indexOf(merk) === -1)
				_max = Math.min(14, _max);
			spell.disabledIncrease = fw >= _max;

			if (SA_88_ACTIVE.indexOf(merk) > -1)
				spell.disabledDecrease = counter[merk] <= 3 && fw === 10 && gr !== 5;
			spells.push(spell);
		}
		return _filterAndSort(spells);
	},

	getDeactiveForView: function() {
		var spellsObj = ListStore.getObjByCategory(CATEGORY);
		var spells = [];

		const maxUnfamiliar = PhaseStore.get() < 3 && ListStore.getAllByCategory(CATEGORY).filter(e =>
				!e.trad.some(e =>
					e === 1 ||
					e === ListStore.get('SA_86').sid + 1
				) && e.gr < 3 && e.active
			).length >= ELStore.getStart().max_unfamiliar_spells;
		
		for (let id in spellsObj) {
			let spell = spellsObj[id];
			let { active, trad, gr } = spell;

			if (active) continue;

			var available = trad.some(e => e === 1 || e === ListStore.get('SA_86').sid + 1);
			if (!available) {
				if (gr > 2 || maxUnfamiliar) {
					continue;
				} else {
					spell.add = trad.map(e => TRADITIONS[e - 1]).join(', ');
				}
			}
			spell.ownTradition = available;

			spells.push(spell);
		}
		return _filterAndSort(spells);
	},

	isActivationDisabled: function() {
		let maxSpellsLiturgies = ELStore.getStart().max_spells_liturgies;
		return PhaseStore.get() < 3 && ListStore.getAllByCategory(CATEGORY).filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	},

	getFilter: function() {
		return _filter;
	},

	getSortOrder: function() {
		return _sortOrder;
	}

});

SpellsStore.dispatchToken = AppDispatcher.register( function( payload ) {

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

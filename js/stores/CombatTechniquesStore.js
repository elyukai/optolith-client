import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ELStore from './ELStore';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.COMBAT_TECHNIQUES;

var _filter = '';
var _sortOrder = 'name';

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}
	
var CombatTechniquesStore = Object.assign({}, EventEmitter.prototype, {
	
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
			let { id, fw } = e;
			if (fw > 6) {
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

	getMaxPrimaryAttributeValueByID: function(array) {
		return array.map(attr => this.get(attr).value).reduce((a, b) => Math.max(a, b), 0);
	},

	getPrimaryAttributeMod: function(array) {
		return Math.max(Math.floor((this.getMaxPrimaryAttributeValueByID(array) - 8) / 3), 0);
	},

	getAllForView: function() {
		var combatTechniques = ListStore.getAllByCategory(CATEGORY);
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			combatTechniques = combatTechniques.filter(obj => obj.name.toLowerCase().match(filter));
		}
		if (_sortOrder == 'name') {
			combatTechniques.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		} else if (_sortOrder == 'groups') {
			combatTechniques.sort((a, b) => {
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
		return combatTechniques;
	},

	getFilter: function() {
		return _filter;
	},

	getSortOrder: function() {
		return _sortOrder;
	}

});

CombatTechniquesStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

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

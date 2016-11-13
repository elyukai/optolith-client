import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ELStore from './ELStore';
import ListStore from './ListStore';
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
	
var LiturgiesStore = Object.assign({}, EventEmitter.prototype, {
	
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

	getAspectCounter: function() {
		return ListStore.getAllByCategory(CATEGORY).filter(e => e.value >= 10).reduce((a,b) => {
			if (!a.has(b.aspect)) {
				a.set(b.aspect, 1);
			} else {
				a.set(b.aspect, a.get(b.aspect) + 1);
			}
		}, new Map());
	},

	getActiveForView: function() {
		var liturgies = ListStore.getAllByCategory(CATEGORY).filter(e => e.active);
		return _filterAndSort(liturgies);
	},

	getDeactiveForView: function() {
		var liturgies = ListStore.getObjByCategory(CATEGORY).filter(e => {
			if (!e.active) {
				if (!e.isOwnTradition) {
					return false;
				}
				return true;
			}
			return false;
		});
		return _filterAndSort(liturgies);
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

LiturgiesStore.dispatchToken = AppDispatcher.register( function( payload ) {

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

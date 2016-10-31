import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ELStore from './ELStore';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import ProfessionStore from './ProfessionStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.CHANTS;

var _filter = '';
var _sortOrder = 'name';

function _activate(id) {
	ListStore.activate(id);
}

function _deactivate(id) {
	ListStore.deactivate(id);
}

function _addPoint(id) {
	ListStore.addPoint(id);
}

function _removePoint(id) {
	ListStore.removePoint(id);
}

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _clear() {
	ListStore.getAllByCategory(CATEGORY).forEach(e => {
		ListStore.deactivate(e.id);
		ListStore.setSR(e.id, 0);
		ListStore.setProperty(e.id, 'dependencies', []);
	});
}

function _updateAll(obj) {
	obj.active.forEach(e => {
		ListStore.activate(e[0]);
		if (ListStore.get(e[0]).gr !== 3) {
			ListStore.setSR(...e);
		}
	});
}

function _assignRCP() {
	var list = [];

	if ([null, 'P_0'].indexOf(ProfessionStore.getCurrentID()) === -1)
		list.push(...ProfessionStore.getCurrent().chants);

	list.forEach(e => {
		ListStore.activate(e[0]);
		if (e[1] !== null)
			ListStore.setSR(e[0], e[1]);
	});
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

	init: function(obj) {
		for (let id in obj) {
			obj[id].fw = 0;
			obj[id].check = obj[id].check.map((e,i) => i < 3 ? `ATTR_${e}` : e);
			obj[id].active = false;
			obj[id].category = CATEGORY;
			obj[id].dependencies = [];
		}
		ListStore.init(obj);
	},
	
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

		var liturgiesObj = ListStore.getObjByCategory(CATEGORY);
		var liturgies = [];

		var SA_103_ACTIVE = this.get('SA_103').active;
		var liturgiesAbove10 = ListStore.getAllByCategory(CATEGORY).filter(e => e.fw >= 10);
		var counter = {};
		liturgiesAbove10.forEach(n => {
			n.aspc.forEach(e => {
				if (!counter.hasOwnProperty(e))
					counter[e] = 1;
				else
					counter[e]++;
			});
		});

		for (let id in liturgiesObj) {
			let liturgy = liturgiesObj[id];
			let { active, fw, aspc, trad, gr } = liturgy;

			if (!active) continue;

			var available = trad.some(e => e === 1 || e === ListStore.get('SA_102').sid + 1);
			if (!available) continue;

			let _max = 25;
			let _max_bonus = this.get('ADV_16').active.filter(e => e === id).length;
			if (phase < 3)
				_max = ELStore.getStart().max_skill + _max_bonus;
			else {
				let checkValues = liturgy.check.map(attr => ListStore.get(attr).value);
				_max = Math.max(...checkValues) + 2 + _max_bonus;
			}
			aspc.some(e => {
				if (SA_103_ACTIVE.indexOf(e) === -1) {
					_max = Math.min(14, _max);
					return true;
				}
				else return false;
			});
			liturgy.disabledIncrease = fw >= _max;

			aspc.some(e => {
				if (SA_103_ACTIVE.indexOf(e) > -1 && counter[e] <= 3 && gr !== 3) {
					liturgy.disabledDecrease = fw <= 10;
					return true;
				}
				else return false;
			});

			liturgies.push(liturgy);
		}
		return _filterAndSort(liturgies);
	},

	getDeactiveForView: function() {
		var liturgiesObj = ListStore.getObjByCategory(CATEGORY);
		var liturgies = [];

		for (let id in liturgiesObj) {
			let liturgy = liturgiesObj[id];
			let { active, trad } = liturgy;

			if (active) continue;

			var available = trad.some(e => e === 1 || e === ListStore.get('SA_102').sid + 1);
			if (!available) continue;

			liturgies.push(liturgy);
		}
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

		case ActionTypes.CLEAR_HERO:
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.chants);
			break;

		case ActionTypes.FILTER_LITURGIES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_LITURGIES:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.ACTIVATE_LITURGY:
			_activate(payload.id);
			break;

		case ActionTypes.DEACTIVATE_LITURGY:
			_deactivate(payload.id);
			break;

		case ActionTypes.ADD_LITURGY_POINT:
			_addPoint(payload.id);
			break;

		case ActionTypes.REMOVE_LITURGY_POINT:
			_removePoint(payload.id);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			LiturgiesStore.init(payload.liturgies);
			break;
		
		default:
			return true;
	}
	
	LiturgiesStore.emitChange();

	return true;

});

export default LiturgiesStore;

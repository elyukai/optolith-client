import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import CultureStore from './rcp/CultureStore';
import ELStore from './ELStore';
import ListStore from './ListStore';
import PhaseStore from './PhaseStore';
import ProfessionStore from './rcp/ProfessionStore';
import ProfessionVariantStore from './rcp/ProfessionVariantStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.TALENTS;

var _filter = '';
var _sortOrder = 'groups';
var _talentRating = true;

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

function _updateTalentRating() {
	_talentRating = !_talentRating;
}

function _clear() {
	ListStore.getAllByCategory(CATEGORY).forEach(e => {
		ListStore.setSR(e.id, 0);
		ListStore.setProperty(e.id, 'dependencies', []);
	});
}

function _updateAll(obj) {
	obj.active.forEach(e => {
		ListStore.setSR(...e);
	});
	_talentRating = obj._talentRating;
}

function _assignRCP(selections) {
	var list = [];

	if (selections.useCulturePackage)
		list.push(...CultureStore.getCurrent().talents);
	if ([null, 'P_0'].indexOf(ProfessionStore.getCurrentID()) === -1)
		list.push(...ProfessionStore.getCurrent().talents);
	if (ProfessionVariantStore.getCurrentID() !== null)
		list.push(...ProfessionVariantStore.getCurrent().talents);

	list.forEach(e => ListStore.addSR(e[0], e[1]));
}
	
var TalentsStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawTalents) {
		for (let id in rawTalents) {
			rawTalents[id].fw = 0;
			rawTalents[id].category = CATEGORY;
			rawTalents[id].dependencies = [];
		}
		ListStore.init(rawTalents);
	},

	getNameByID: function(id) {
		return ListStore.get(id).name;
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
			let { id, fw } = e;
			if (fw > 0) {
				result.set(id, fw);
			}
		});
		return {
			active: Array.from(result),
			_talentRating
		};
	},

	get: function(id) {
		return ListStore.get(id);
	},

	getAllForView: function() {
		// var phase = PhaseStore.get();
		var phase = 1;

		var talentsObj = ListStore.getObjByCategory(CATEGORY);
		var talents = [];

		var SA_18 = this.get('SA_18').active;
		var SA_18_REQ = SA_18 && (talentsObj['TAL_51'].fw + talentsObj['TAL_55'].fw) < 12;

		for (let id in talentsObj) {
			let talent = talentsObj[id];
			let { fw, check, dependencies } = talent;

			var _max = 25;
			let _max_bonus = ListStore.get('ADV_16').active.filter(e => e === id).length;
			if (phase < 3)
				_max = ELStore.getStart().max_skill + _max_bonus;
			else {
				let checkValues = check.map(attr => this.get(`ATTR_${attr}`).value);
				_max = Math.max(...checkValues) + 2 + _max_bonus;
			}
			talent.disabledIncrease = fw >= _max;

			talent.disabledDecrease = (['TAL_51','TAL_55'].indexOf(id) > -1 && SA_18_REQ) || fw <= Math.max(0, ...dependencies);

			talents.push(talent);
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			talents = talents.filter(obj => obj.name.toLowerCase().match(filter));
		}
		if (_sortOrder == 'name') {
			talents.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		} else if (_sortOrder == 'groups') {
			talents.sort((a, b) => {
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
		return talents;
	},

	getFilter: function() {
		return _filter;
	},

	getSortOrder: function() {
		return _sortOrder;
	},

	getTalentRating: function() {
		return _talentRating;
	}

});

TalentsStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CLEAR_HERO:
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.talents);
			break;

		case ActionTypes.FILTER_TALENTS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_TALENTS:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_TALENT_RATING:
			_updateTalentRating();
			break;

		case ActionTypes.ADD_TALENT_POINT:
			_addPoint(payload.id);
			break;

		case ActionTypes.REMOVE_TALENT_POINT:
			_removePoint(payload.id);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			TalentsStore.init(payload.talents);
			break;
		
		default:
			return true;
	}
	
	TalentsStore.emitChange();

	return true;

});

export default TalentsStore;
